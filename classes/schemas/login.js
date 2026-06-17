const {
	readUTF,     writeUTF,
	readBoolean, writeBoolean,
	readInt,     writeInt,
} = require("../ByteArray").prototype;

const { listOf } = require("./helpers");

const { read: readCaptchaLocation, write: writeCaptchaLocation } = listOf(readInt, writeInt);

module.exports = {
	// server → client
	"-1277343167": {
		alias: "initRegistrationModel",
		direction: "in",
		fields: [
			{ name: "backgroundResourceId", read: readUTF,     write: writeUTF     },
			{ name: "emailRequired",        read: readBoolean,  write: writeBoolean },
			{ name: "minPasswordLength",    read: readInt,      write: writeInt     },
			{ name: "maxPasswordLength",    read: readInt,      write: writeInt     },
		],
	},
	321971701: {
		alias: "initCaptchaModel",
		direction: "in",
		fields: [
			{ name: "locations", read: readCaptchaLocation, write: writeCaptchaLocation },
		],
	},
	"-1670408519": { alias: "showCaptcha",            direction: "in", fields: [] },
	613462801: {
		alias: "initEmailPasswordModel",
		direction: "in",
		fields: [
			{ name: "email",          read: readUTF,     write: writeUTF     },
			{ name: "emailConfirmed", read: readBoolean,  write: writeBoolean },
		],
	},
	600420685: {
		alias: "notifyPasswordIsSet",
		direction: "in",
		fields: [],
	},
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
			{ name: "rememberMe", read: readBoolean,  write: writeBoolean },
		],
	},
	"-349828108":  { alias: "getNewCaptcha",      direction: "out", fields: [] },
	"-1507635228": { alias: "checkIsPasswordSet", direction: "out", fields: [] },
};
