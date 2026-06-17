const {
	readUTF,     writeUTF,
	readBoolean, writeBoolean,
	readInt,     writeInt,
	readByte,    writeByte,
} = require("../ByteArray").prototype;

const { listOf, nullableListOf, readResourceId, writeResourceId } = require("./helpers");

const { read: readCaptchaLocation, write: writeCaptchaLocation } = listOf(readInt, writeInt);
const { read: readImageData,       write: writeImageData       } = listOf(readByte, writeByte);
const { read: readNameList,        write: writeNameList        } = nullableListOf(readUTF, writeUTF);

module.exports = {
	// server → client

	// --- Registration ---
	"-1277343167": {
		alias: "initRegistrationModel",
		direction: "in",
		fields: [
			{ name: "backgroundResourceId", read: readResourceId, write: writeResourceId },
			{ name: "emailRequired",        read: readBoolean,    write: writeBoolean    },
			{ name: "minPasswordLength",    read: readInt,        write: writeInt        },
			{ name: "maxPasswordLength",    read: readInt,        write: writeInt        },
		],
	},
	442888643: {
		alias: "suggestedNames",
		direction: "in",
		fields: [
			{ name: "names", read: readNameList, write: writeNameList },
		],
	},
	"-706679202": { alias: "closeRegistration", direction: "in", fields: [] },

	// --- Captcha ---
	321971701: {
		alias: "initCaptchaModel",
		direction: "in",
		fields: [
			{ name: "locations", read: readCaptchaLocation, write: writeCaptchaLocation },
		],
	},
	"-1670408519": {
		alias: "showCaptcha",
		direction: "in",
		fields: [
			{ name: "location",  read: readInt,       write: writeInt       },
			{ name: "imageData", read: readImageData, write: writeImageData },
		],
	},
	"-373510957": {
		alias: "refreshCaptcha",
		direction: "in",
		fields: [
			{ name: "location",  read: readInt,       write: writeInt       },
			{ name: "imageData", read: readImageData, write: writeImageData },
		],
	},
	"-819536476": {
		alias: "hideCaptcha",
		direction: "in",
		fields: [
			{ name: "location", read: readInt, write: writeInt },
		],
	},

	// --- Email / Password ---
	613462801: {
		alias: "initEmailPasswordModel",
		direction: "in",
		fields: [
			{ name: "email",          read: readUTF,     write: writeUTF     },
			{ name: "emailConfirmed", read: readBoolean, write: writeBoolean },
		],
	},
	600420685:    { alias: "notifyPasswordIsSet", direction: "in", fields: [] },
	"-262455387":  { alias: "emailConfirmSent",   direction: "in", fields: [] },
	"-1607756600": { alias: "emailAlreadySet",    direction: "in", fields: [] },
	"-16447159":   { alias: "passwordChanged",    direction: "in", fields: [] },

	// --- Invite ---
	444933603: {
		alias: "initInviteModel",
		direction: "in",
		fields: [
			{ name: "enabled", read: readBoolean, write: writeBoolean },
		],
	},

	// client → server

	"-739684591": {
		alias: "login",
		direction: "out",
		fields: [
			{ name: "username",   read: readUTF,     write: writeUTF     },
			{ name: "password",   read: readUTF,     write: writeUTF     },
			{ name: "rememberMe", read: readBoolean, write: writeBoolean },
		],
	},
	1083705823: {
		alias: "checkUid",
		direction: "out",
		fields: [
			{ name: "uid", read: readUTF, write: writeUTF },
		],
	},
	1271163230: {
		alias: "sendCaptchaAnswer",
		direction: "out",
		fields: [
			{ name: "location", read: readInt, write: writeInt },
			{ name: "code",     read: readUTF, write: writeUTF },
		],
	},
	"-349828108": {
		alias: "getNewCaptcha",
		direction: "out",
		fields: [
			{ name: "location", read: readInt, write: writeInt },
		],
	},
	903498755: {
		alias: "submitPassword",
		direction: "out",
		fields: [
			{ name: "password", read: readUTF, write: writeUTF },
		],
	},
	1744584433: {
		alias: "submitEmail",
		direction: "out",
		fields: [
			{ name: "email", read: readUTF, write: writeUTF },
		],
	},
	"-1507635228": { alias: "checkIsPasswordSet", direction: "out", fields: [] },
};
