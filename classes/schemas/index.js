const ByteArray = require("../ByteArray");
const incomplete = require("./incomplete");

const SCHEMAS = {
	...require("./loading"),
	...require("./login"),
	...require("./lobby"),
	...require("./battle"),
	...require("./structs"), // nested-structure packets (override empty stubs above)
};

// alias → packetId string
const BY_ALIAS = {};
for (const [id, schema] of Object.entries(SCHEMAS)) {
	if (schema.alias) BY_ALIAS[schema.alias] = id;
}

function lookupAlias(alias) {
	const id = BY_ALIAS[alias];
	if (!id) return null;
	return { id: Number(id), schema: SCHEMAS[id] };
}

function getSchema(packetId) {
	return SCHEMAS[String(packetId)] ?? null;
}

/**
 * Parse a packet's payload into a plain object using the registered schema.
 * Returns null if no schema or schema has no fields.
 * Throws if reading fails.
 */
function parse(packetId, packet) {
	const schema = getSchema(packetId);
	if (!schema || schema.fields.length === 0) return null;

	const clone = new ByteArray(packet.buffer);
	const result = {};
	try {
		for (const field of schema.fields) {
			result[field.name] = field.read.call(clone);
		}
		result.__remaining = clone.bytesAvailable();
	} catch (e) {
		// Schema/payload mismatch — never crash the bridge over a parse used
		// only for logging. Keep whatever fields we read and flag the error.
		result.__parseError = e.message;
	}
	return result;
}

/**
 * Serialize a plain object back into a ByteArray using the registered schema.
 */
function serialize(packetId, fields) {
	const schema = getSchema(packetId);
	if (!schema) throw new Error(`no schema for packet ${packetId}`);

	const out = new ByteArray();
	for (const field of schema.fields) {
		field.write.call(out, fields[field.name]);
	}
	return out;
}

/**
 * Format a parsed fields object as a human-readable string.
 * Uses schema.describe(fields) if defined, otherwise auto-generates
 * "field = value | field2 = value2" from the schema field list.
 */
function format(packetId, fields) {
	const schema = getSchema(packetId);
	if (!schema || !fields) return String(fields);
	if (typeof schema.describe === "function") return schema.describe(fields);
	return schema.fields
		.map(({ name }) => `${name} = ${JSON.stringify(fields[name])}`)
		.join(" | ");
}

/**
 * Validate a packet against its schema and print warnings.
 * Always operates on a clone — the original packet is untouched.
 */
function validate(packetId, packet, name, tag = "") {
	const schema = getSchema(packetId);
	const prefix = tag ? `${tag} [schema]` : "[schema]";

	const hex = Buffer.isBuffer(packet.buffer)
		? packet.buffer.toString("hex")
		: Buffer.from(packet.buffer).toString("hex");

	if (!schema) {
		console.warn(`${prefix} no schema: ${name} (${packetId})`);
		incomplete.record(packetId, name, "no schema", hex);
		return;
	}

	if (schema.fields.length === 0) {
		const size = packet.bytesAvailable();
		if (size > 0) {
			console.warn(`${prefix} ${name}: schema has no fields but payload is ${size} bytes — schema incomplete`);
			incomplete.record(packetId, name, `no fields, ${size} bytes payload`, hex);
		}
		return;
	}

	const clone = new ByteArray(packet.buffer);
	try {
		for (const field of schema.fields) {
			field.read.call(clone);
		}
		const remaining = clone.bytesAvailable();
		if (remaining > 0) {
			console.warn(`${prefix} ${name}: ${remaining} bytes remaining after parse — schema may be incomplete`);
			incomplete.record(packetId, name, `${remaining} bytes remaining`, hex);
		}
	} catch (e) {
		console.warn(`${prefix} ${name} (${packetId}): parse error — ${e.message}`);
		incomplete.record(packetId, name, `parse error: ${e.message}`, hex);
	}
}

module.exports = { SCHEMAS, BY_ALIAS, lookupAlias, getSchema, parse, serialize, validate, format };
