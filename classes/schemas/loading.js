const {
	readInt,  writeInt,
	readByte, writeByte,
	readUTF,  writeUTF,
} = require("../ByteArray").prototype;

const { listOf, objectListOf, readResourceId, writeResourceId } = require("./helpers");

const { read: readByteList,     write: writeByteList     } = listOf(readByte, writeByte);
const { read: readExternalList, write: writeExternalList } = objectListOf([
	{ name: "url",      read: readUTF, write: writeUTF },
	{ name: "provider", read: readUTF, write: writeUTF },
]);

module.exports = {
	// server → client
	2001736388: {
		alias: "receiveHash",
		direction: "in",
		fields: [
			{ name: "keys", read: readByteList, write: writeByteList },
		],
	},
	"-1797047325": {
		alias: "loadDependencies",
		direction: "in",
		fields: [
			{ name: "dependencies", read: readUTF, write: writeUTF },
			{ name: "version",      read: readInt, write: writeInt },
		],
	},
	"-1715719586": {
		alias: "initExternalModel",
		direction: "in",
		fields: [
			{ name: "links", read: readExternalList, write: writeExternalList },
		],
	},
	"-555602629":  { alias: "ping",             direction: "in",  fields: [] },
	"-1282173466": { alias: "onResourceLoaded", direction: "in",  fields: [] },
	2094741924: {
		alias: "initTipsModel",
		direction: "in",
		fields: [
			{ name: "previewResourceId", read: readResourceId, write: writeResourceId },
		],
	},
	"-1376947245": { alias: "nextTip",          direction: "in",  fields: [] },

	// client → server
	"-1864333717": {
		alias: "setLang",
		direction: "out",
		fields: [
			{ name: "lang", read: readUTF, write: writeUTF },
		],
	},
	"-82304134": {
		alias: "dependenciesLoaded",
		direction: "out",
		fields: [
			{ name: "loadedCount", read: readInt, write: writeInt },
		],
	},
	1484572481: { alias: "pong", direction: "out", fields: [] },
};
