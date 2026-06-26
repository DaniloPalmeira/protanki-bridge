/**
 * Creates a read/write pair for a length-prefixed list.
 * The list is encoded as: int32 (count) followed by count elements.
 *
 * @param {Function} readElement  - unbound ByteArray read method for each element
 * @param {Function} writeElement - unbound ByteArray write method for each element
 *
 * Example:
 *   const { read, write } = listOf(readByte, writeByte);
 *   field: { name: "keys", read, write }
 */
function listOf(readElement, writeElement) {
	return {
		read() {
			const count = this.readInt();
			const items = [];
			for (let i = 0; i < count; i++) items.push(readElement.call(this));
			return items;
		},
		write(items) {
			this.writeInt(items.length);
			for (const item of items) writeElement.call(this, item);
		},
	};
}

/**
 * Creates a read/write pair for a length-prefixed list of objects.
 * Each object is described by an array of { name, read, write } field descriptors.
 *
 * @param {Array<{name: string, read: Function, write: Function}>} fields
 *
 * Example:
 *   const { read, write } = objectListOf([
 *     { name: "type",    read: readUTF, write: writeUTF },
 *     { name: "version", read: readInt, write: writeInt },
 *   ]);
 *   field: { name: "dependencies", read, write }
 */
function objectListOf(fields) {
	return {
		read() {
			const count = this.readInt();
			const items = [];
			for (let i = 0; i < count; i++) {
				const obj = {};
				for (const field of fields) obj[field.name] = field.read.call(this);
				items.push(obj);
			}
			return items;
		},
		write(items) {
			this.writeInt(items.length);
			for (const item of items) {
				for (const field of fields) field.write.call(this, item[field.name]);
			}
		},
	};
}

// Nullable length-prefixed list: readBoolean (false = has data) + readInt count + N elements.
// Matches the AS3 null-check pattern used for Vector.<String> and similar nullable collections.
function nullableListOf(readElement, writeElement) {
	return {
		read() {
			const isNull = this.readBoolean();
			if (isNull) return null;
			const count = this.readInt();
			const items = [];
			for (let i = 0; i < count; i++) items.push(readElement.call(this));
			return items;
		},
		write(items) {
			if (items == null) { this.writeBoolean(true); return; }
			this.writeBoolean(false);
			this.writeInt(items.length);
			for (const item of items) writeElement.call(this, item);
		},
	};
}

// Resource IDs on wire are encoded as two int32s: { high, low }
function readResourceId() { return { high: this.readInt(), low: this.readInt() }; }
function writeResourceId(v) { this.writeInt(v.high); this.writeInt(v.low); }

// Nullable 3D vector (position): 1 null-flag byte, then 3 float32 (x, y, z) when present.
// Matches the client's optional CodecVector3 (e.g. spawn position, mine drop point).
function readOptionalVec3() {
	const isNull = this.readBoolean();
	if (isNull) return null;
	return { x: this.readFloat(), y: this.readFloat(), z: this.readFloat() };
}
function writeOptionalVec3(v) {
	if (v == null) { this.writeBoolean(true); return; }
	this.writeBoolean(false);
	this.writeFloat(v.x); this.writeFloat(v.y); this.writeFloat(v.z);
}

// ── Token compiler ───────────────────────────────────────────────────────────
// Builds a { read, write } pair from a wire-token derived from the decompiled
// client codecs. Tokens:
//   "int" "short" "byte" "float" "double" "long" "utf" "bool"  — primitives
//   { opt: [ [name, token], … ] }                  — optional struct (1 null-flag byte)
//   { list: [ [name, token], … ], nullable: bool } — list (nullable = leading null-flag)
// A list/opt body that is a single bare token (not [name, token] pairs) encodes a
// scalar element instead of an object.
const BA = require("../ByteArray").prototype;
const P = {
	int:   { read: BA.readInt,     write: BA.writeInt     },
	short: { read: BA.readShort,   write: BA.writeShort   },
	byte:  { read: BA.readByte,    write: BA.writeByte    },
	float: { read: BA.readFloat,   write: BA.writeFloat   },
	double:{ read: BA.readDouble,  write: BA.writeDouble  },
	utf:   { read: BA.readUTF,     write: BA.writeUTF     },
	bool:  { read: BA.readBoolean, write: BA.writeBoolean },
	long:  { read: readResourceId, write: writeResourceId }, // {high, low}
};
function rw(token) {
	if (typeof token === "string") {
		const p = P[token];
		if (!p) throw new Error("unknown token: " + token);
		return p;
	}
	if (token.opt) {
		const body = structRW(token.opt);
		return {
			read() { if (this.readBoolean()) return null; return body.read.call(this); },
			write(v) { if (v == null) { this.writeBoolean(true); return; } this.writeBoolean(false); body.write.call(this, v); },
		};
	}
	if (token.list) {
		const body = structRW(token.list);
		return {
			read() {
				if (token.nullable && this.readBoolean()) return null;
				const n = this.readInt(); const a = [];
				for (let i = 0; i < n; i++) a.push(body.read.call(this));
				return a;
			},
			write(arr) {
				if (token.nullable) { if (arr == null) { this.writeBoolean(true); return; } this.writeBoolean(false); }
				this.writeInt(arr.length);
				for (const it of arr) body.write.call(this, it);
			},
		};
	}
	throw new Error("bad token: " + JSON.stringify(token));
}
// struct body: array of [name, token] pairs → object; or a single bare token → scalar
function structRW(def) {
	if (def.length === 1 && !Array.isArray(def[0])) return rw(def[0]);
	const fields = def.map(([name, token]) => ({ name, ...rw(token) }));
	return {
		read() { const o = {}; for (const f of fields) o[f.name] = f.read.call(this); return o; },
		write(v) { for (const f of fields) f.write.call(this, v[f.name]); },
	};
}
// Build a schema fields[] array from [name, token] pairs.
function fieldsOf(def) { return def.map(([name, token]) => ({ name, ...rw(token) })); }

module.exports = { listOf, objectListOf, nullableListOf, readResourceId, writeResourceId, readOptionalVec3, writeOptionalVec3, rw, fieldsOf };
