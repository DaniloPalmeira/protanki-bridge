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

module.exports = { listOf, objectListOf, nullableListOf, readResourceId, writeResourceId, readOptionalVec3, writeOptionalVec3 };
