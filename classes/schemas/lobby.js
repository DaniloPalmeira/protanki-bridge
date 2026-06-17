const {
	readUTF,     writeUTF,
	readBoolean, writeBoolean,
	readInt,     writeInt,
} = require("../ByteArray").prototype;

module.exports = {
	// server → client
	"-1923286328": { alias: "enter",                      direction: "in", fields: [] },
	1118835050:    { alias: "beginLayoutSwitch",           direction: "in", fields: [] },
	"-593368100":  { alias: "endLayoutSwitch",             direction: "in", fields: [] },
	1405859779:    { alias: "initPremium",                 direction: "in", fields: [] },
	"-1232334539": { alias: "initUserCountryModel",        direction: "in", fields: [] },
	907073245:     { alias: "initPanel",                   direction: "in", fields: [] },
	834877801:     { alias: "initBattleInviteModel",       direction: "in", fields: [] },
	1422563374:    { alias: "initFriendsList",             direction: "in", fields: [] },
	"-1481254568": { alias: "initAchievementModel",        direction: "in", fields: [] },
	832270655:     { alias: "initReferrerPanelModel",      direction: "in", fields: [] },
	178154988:     { alias: "initChatModel",               direction: "in", fields: [] },
	"-1263520410": { alias: "showMessages",                direction: "in", fields: [] },
	"-583564465":  { alias: "initSocialNetworkPanelModel", direction: "in", fields: [] },
	"-962759489":  { alias: "setRank",                     direction: "in", fields: [] },
	"-2069508071": { alias: "setPremiumTimeLeft",          direction: "in", fields: [] },
	"-117055417":  { alias: "setClan",                     direction: "in", fields: [] },
	"-1895446889": { alias: "setBattle",                   direction: "in", fields: [] },
	"-1338449818": { alias: "initUserClanModels",          direction: "in", fields: [] },
	"-1855118498": { alias: "showForeignClanWindow",       direction: "in", fields: [] },
	"-1565553333": { alias: "validateResult",              direction: "in", fields: [] },
	"-1266665816": { alias: "skipDailyQuest",              direction: "in", fields: [] },
	"-169305322":  { alias: "onReserveSlotTeam",           direction: "in", fields: [] },
	2041598093:    { alias: "setOnline",                   direction: "in", fields: [] },
	134406915:     { alias: "setClanRatingsData",          direction: "in", fields: [] },
	560344632:     { alias: "showNotInClanWindow",         direction: "in", fields: [] },
	809822533:     { alias: "showQuestWindow",             direction: "in", fields: [] },
	1428217189:    { alias: "updateTeamScore",             direction: "in", fields: [] },
	1587315905:    { alias: "openReferrerPanel",           direction: "in", fields: [] },
	118447426:     { alias: "addUserTeam",                 direction: "in", fields: [] },

	744948472: {
		alias: "updateTypingSpeedAntiflood",
		direction: "in",
		fields: [
			{ name: "minDelay", read: readInt, write: writeInt },
			{ name: "maxDelay", read: readInt, write: writeInt },
		],
	},
	"-838186985": {
		alias: "initBattleCreateModel",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	552006706: {
		alias: "battleItemsJoinSuccess",
		direction: "in",
		fields: [
			{ name: "battleId", read: readUTF, write: writeUTF },
		],
	},
	2092412133: {
		alias: "select",
		direction: "in",
		fields: [
			{ name: "battleId", read: readUTF, write: writeUTF },
		],
	},
	546722394: {
		alias: "showBattleInfo",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	1941694508: {
		alias: "leaveBattle",
		direction: "in",
		fields: [
			{ name: "battleId", read: readUTF, write: writeUTF },
		],
	},
	"-375282889": {
		alias: "updateUserScore",
		direction: "in",
		fields: [
			{ name: "battleId", read: readUTF, write: writeUTF },
			{ name: "userId",   read: readUTF, write: writeUTF },
			{ name: "score",    read: readInt, write: writeInt },
		],
	},
	1447082276: {
		alias: "openSettings",
		direction: "in",
		fields: [
			{ name: "passwordSet", read: readBoolean, write: writeBoolean },
		],
	},
	1447204641: {
		alias: "onReleaseSlotTeam",
		direction: "in",
		fields: [
			{ name: "battleId", read: readUTF, write: writeUTF },
			{ name: "userId",   read: readUTF, write: writeUTF },
		],
	},
	"-2080893689": {
		alias: "getClanRatingsData",
		direction: "in",
		fields: [
			{ name: "page",     read: readInt, write: writeInt },
			{ name: "pageSize", read: readInt, write: writeInt },
		],
	},
	"-2002206647": { alias: "hideNotInClanPanel", direction: "in", fields: [] },
	"-1961983005": {
		alias: "itemBought",
		direction: "in",
		fields: [
			{ name: "itemId",   read: readUTF, write: writeUTF },
			{ name: "quantity", read: readInt, write: writeInt },
			{ name: "price",    read: readInt, write: writeInt },
		],
	},
	"-1712113407": {
		alias: "haltServer",
		direction: "in",
		fields: [
			{ name: "delay", read: readInt, write: writeInt },
		],
	},
	"-1518850075": {
		alias: "purchasePresent",
		direction: "in",
		fields: [
			{ name: "itemId",      read: readUTF, write: writeUTF },
			{ name: "recipientId", read: readUTF, write: writeUTF },
			{ name: "message",     read: readUTF, write: writeUTF },
			{ name: "quantity",    read: readInt, write: writeInt },
		],
	},
	"-1505530736": {
		alias: "itemMounted",
		direction: "in",
		fields: [
			{ name: "itemId", read: readUTF, write: writeUTF },
		],
	},
	"-1457773660": {
		alias: "add",
		direction: "in",
		fields: [
			{ name: "id", read: readUTF, write: writeUTF },
		],
	},
	"-1241704092": {
		alias: "addToOutgoing",
		direction: "in",
		fields: [
			{ name: "userId", read: readUTF, write: writeUTF },
		],
	},
	"-1123511676": { alias: "showNotInClanPanel", direction: "in", fields: [] },
	"-635715470": {
		alias: "validateUid",
		direction: "in",
		fields: [
			{ name: "uid", read: readUTF, write: writeUTF },
		],
	},
	"-602527073": {
		alias: "hideBattleInfo",
		direction: "in",
		fields: [
			{ name: "battleId", read: readUTF, write: writeUTF },
		],
	},
	"-593513288": {
		alias: "changeCrystal",
		direction: "in",
		fields: [
			{ name: "amount", read: readInt, write: writeInt },
		],
	},
	"-479046431": { alias: "switchGarage",   direction: "in", fields: [] },
	"-437587751": { alias: "onUsersLoaded",  direction: "in", fields: [] },
	"-324155151": { alias: "unloadLobbyModel", direction: "in", fields: [] },
	"-255516505": {
		alias: "initDepot",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	"-300370823": {
		alias: "initMarket",
		direction: "in",
		fields: [
			{ name: "json", read: readUTF, write: writeUTF },
		],
	},
	"-169921234": { alias: "showReferrerPanel", direction: "in", fields: [] },
	84050355: {
		alias: "revoke",
		direction: "in",
		fields: [
			{ name: "userId", read: readUTF, write: writeUTF },
		],
	},
	614714702: {
		alias: "removeFromOutgoing",
		direction: "in",
		fields: [
			{ name: "userId", read: readUTF, write: writeUTF },
		],
	},
	705454610: {
		alias: "sendMessage",
		direction: "in",
		fields: [
			{ name: "channel", read: readUTF, write: writeUTF },
			{ name: "text",    read: readUTF, write: writeUTF },
		],
	},
	947733823: {
		alias: "showForeignClan",
		direction: "in",
		fields: [
			{ name: "clanId", read: readUTF, write: writeUTF },
		],
	},
	1091756732: {
		alias: "fit",
		direction: "in",
		fields: [
			{ name: "itemId", read: readUTF, write: writeUTF },
		],
	},
	1227293080:    { alias: "openQuestWindow",   direction: "in", fields: [] },
	1441234714:    { alias: "show",              direction: "in", fields: [] },
	1642608662: {
		alias: "skipQuestForCrystals",
		direction: "in",
		fields: [
			{ name: "questId", read: readInt, write: writeInt },
		],
	},
	1924874982: {
		alias: "removeUser",
		direction: "in",
		fields: [
			{ name: "battleId", read: readUTF, write: writeUTF },
			{ name: "userId",   read: readUTF, write: writeUTF },
		],
	},
	2062201643: {
		alias: "initMounted",
		direction: "in",
		fields: [
			{ name: "itemId",  read: readUTF,     write: writeUTF     },
			{ name: "mounted", read: readBoolean,  write: writeBoolean },
		],
	},
	2116086491: {
		alias: "updateScore",
		direction: "in",
		fields: [
			{ name: "score", read: readInt, write: writeInt },
		],
	},

	// client → server
	1774907609: {
		alias: "subscribe",
		direction: "out",
		fields: [
			{ name: "battleId", read: readUTF, write: writeUTF },
		],
	},
	850220815:    { alias: "showSettings",        direction: "out", fields: [] },
	"-731115522": {
		alias: "uploadClientSettings",
		direction: "out",
		fields: [
			{ name: "compressed", read: readBoolean, write: writeBoolean },
		],
	},
};
