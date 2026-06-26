const {
	readUTF,     writeUTF,
	readBoolean, writeBoolean,
	readInt,     writeInt,
	readFloat,   writeFloat,
	readShort,   writeShort,
	readByte,    writeByte,
} = require("../ByteArray").prototype;
const { readOptionalVec3, writeOptionalVec3 } = require("./helpers");

// Enum codecs (CodecBattleTeam, …) encode the enum's int .value as a single int32.
const readEnum = readInt, writeEnum = writeInt;

module.exports = {
	// server → client
	34068208: {
		alias: "battlePing",
		direction: "in",
		fields: [
			{ name: "time", read: readInt, write: writeInt },
			{ name: "id",   read: readInt, write: writeInt },
		],
	},
	103812952:  { alias: "wrongPassword",           direction: "in", fields: [] },
	183561709:  { alias: "initBattleTDMModel",       direction: "in", fields: [] },
	228171466: {
		alias: "initBonusesData",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	268832557:  { alias: "readyToSpawnCommand",      direction: "in", fields: [] },
	272183855: {
		alias: "putMine",
		direction: "in",
		fields: [
			{ name: "id",     read: readUTF,   write: writeUTF   },
			{ name: "x",      read: readFloat, write: writeFloat },
			{ name: "y",      read: readFloat, write: writeFloat },
			{ name: "z",      read: readFloat, write: writeFloat },
			{ name: "userId", read: readUTF,   write: writeUTF   },
		],
	},
	417965410: {
		alias: "initEffects",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	870278784: {
		alias: "initBonuses",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	875259457: {
		alias: "spawn",
		direction: "in",
		fields: [
			{ name: "userId",      read: readUTF,            write: writeUTF            },
			{ name: "team",        read: readEnum,           write: writeEnum           }, // CodecBattleTeam
			{ name: "position",    read: readOptionalVec3,   write: writeOptionalVec3   },
			{ name: "orientation", read: readOptionalVec3,   write: writeOptionalVec3   },
			{ name: "incarnation", read: readShort,          write: writeShort          },
			{ name: "health",      read: readShort,          write: writeShort          },
		],
	},
	1156768699: { alias: "disablePause",             direction: "in", fields: [] },
	1178028365: { alias: "activateTankCommand",      direction: "in", fields: [] },
	1411656080: {
		alias: "userDisconnect",
		direction: "in",
		fields: [
			{ name: "userId", read: readUTF, write: writeUTF },
		],
	},
	1452181070: { alias: "switchBattleSelect",       direction: "in", fields: [] },
	1534651002: {
		alias: "roundFinish",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	1831462385: {
		alias: "spawnBonus",
		direction: "in",
		fields: [
			{ name: "id",       read: readUTF,          write: writeUTF          },
			{ name: "position", read: readOptionalVec3, write: writeOptionalVec3 },
			{ name: "bonusType", read: readInt,         write: writeInt          },
		],
	},
	1868573511: {
		alias: "activateTank",
		direction: "in",
		fields: [
			{ name: "userId", read: readUTF, write: writeUTF },
		],
	},
	1953272681: { alias: "initModelPost",            direction: "in", fields: [] },
	2032104949: {
		alias: "activated",
		direction: "in",
		fields: [
			{ name: "entityId", read: readUTF,     write: writeUTF     },
			{ name: "duration", read: readInt,      write: writeInt     },
			{ name: "active",   read: readBoolean,  write: writeBoolean },
		],
	},
	2074243318: {
		alias: "battlePingPacket",
		direction: "in",
		fields: [
			{ name: "time", read: readInt, write: writeInt },
			{ name: "id",   read: readInt, write: writeInt },
		],
	},
	"-2124388778": {
		alias: "initWeaponWeakeningModel",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	"-2102525054": {
		alias: "activate",
		direction: "in",
		fields: [
			{ name: "entityId", read: readUTF, write: writeUTF },
		],
	},
	"-2026749922": {
		alias: "removeBonus",
		direction: "in",
		fields: [
			{ name: "bonusId", read: readUTF, write: writeUTF },
		],
	},
	"-1994318624": {
		alias: "effectStopped",
		direction: "in",
		fields: [
			{ name: "entityId", read: readUTF, write: writeUTF },
			{ name: "effectId", read: readInt, write: writeInt },
		],
	},
	"-1759063234": {
		alias: "startChargingCommand",
		direction: "in",
		fields: [
			{ name: "duration", read: readInt, write: writeInt },
		],
	},
	"-1749108178": {
		alias: "movementControlCommand",
		direction: "in",
		fields: [
			{ name: "control", read: readInt,   write: writeInt   },
			{ name: "x",       read: readShort, write: writeShort },
			{ name: "y",       read: readByte,  write: writeByte  },
		],
	},
	"-1672577397": {
		alias: "setSpecification",
		direction: "in",
		fields: [
			{ name: "id",    read: readUTF,   write: writeUTF   },
			{ name: "x",     read: readFloat, write: writeFloat },
			{ name: "y",     read: readFloat, write: writeFloat },
			{ name: "z",     read: readFloat, write: writeFloat },
			{ name: "w",     read: readFloat, write: writeFloat },
			{ name: "flags", read: readShort, write: writeShort },
		],
	},
	"-1643824092": {
		alias: "initTank",
		direction: "in",
		fields: [
			{ name: "id", read: readUTF, write: writeUTF },
		],
	},
	"-1639713644": {
		alias: "effectStarted",
		direction: "in",
		fields: [
			{ name: "entityId",   read: readUTF,     write: writeUTF     },
			{ name: "effectType", read: readInt,      write: writeInt     },
			{ name: "duration",   read: readInt,      write: writeInt     },
			{ name: "activation", read: readBoolean,  write: writeBoolean },
			{ name: "flags",      read: readByte,     write: writeByte    },
		],
	},
	"-1378839846": { alias: "readyToPlace",          direction: "in", fields: [] },
	"-1284211503": {
		alias: "fight",
		direction: "in",
		fields: [
			{ name: "team", read: readEnum, write: writeEnum }, // CodecBattleTeam
		],
	},
	"-1200619383": {
		alias: "removeMines",
		direction: "in",
		fields: [
			{ name: "userId", read: readUTF, write: writeUTF },
		],
	},
	"-985579124":  { alias: "unloadBattleModel",     direction: "in", fields: [] },
	"-920985123":  { alias: "unloadBattleEntity",    direction: "in", fields: [] },
	"-643105296":  { alias: "initBattleChatModel",   direction: "in", fields: [] },
	"-624217047": {
		alias: "activateMine",
		direction: "in",
		fields: [
			{ name: "mineId", read: readUTF, write: writeUTF },
		],
	},
	"-611961116": {
		alias: "setHealth",
		direction: "in",
		fields: [
			{ name: "userId", read: readUTF,   write: writeUTF   },
			{ name: "health", read: readFloat, write: writeFloat },
		],
	},
	"-157204477": {
		alias: "prepareToSpawn",
		direction: "in",
		fields: [
			{ name: "position",    read: readOptionalVec3, write: writeOptionalVec3 },
			{ name: "orientation", read: readOptionalVec3, write: writeOptionalVec3 },
		],
	},
	"-152638117": {
		alias: "initBattlefieldModel",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	"-137249251": {
		alias: "initInventoryItemModel",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	"-114968993": {
		alias: "rotateTurretCommand",
		direction: "in",
		fields: [
			{ name: "control",     read: readInt,   write: writeInt   },
			{ name: "angle",       read: readFloat, write: writeFloat },
			{ name: "controlType", read: readByte,  write: writeByte  },
			{ name: "incarnation", read: readShort, write: writeShort },
		],
	},
	1211186637:    { alias: "unloadModel",           direction: "in", fields: [] },
};
