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

module.exports = { listOf, objectListOf };
