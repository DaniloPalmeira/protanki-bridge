// Auto-derived packet schemas with nested structures (lists, optionals, structs).
// Wire format extracted from the decompiled client's codec read() methods and
// validated against logs/*.ndjson captures. Field names are positional (f0, f1, …)
// where the obfuscated client did not preserve them. See memory: packet-schema-derivation.
const { fieldsOf } = require("./helpers");

module.exports = {
	"134406915": { alias: "setClanRatingsData", direction: "in", fields: fieldsOf([
		["f0", "int"],
		["f1", { list: [ ["f0", "bool"], ["f1", "long"], ["f2", "utf"], ["f3", "utf"], ["f4", "bool"], ["f5", "int"], ["f6", "int"], ["f7", "byte"], ["f8", "utf"], ["f9", "utf"], ["f10", "bool"], ["f11", "utf"], ["f12", { list: [ "utf" ], nullable: true }], ["f13", "utf"], ["f14", "int"] ], nullable: false }]
	]) },
	"178154988": { alias: "initChatModel", direction: "in", fields: fieldsOf([
		["f0", "bool"],
		["f1", "bool"],
		["f2", "int"],
		["f3", "bool"],
		["f4", "int"],
		["f5", { list: [ "utf" ], nullable: true }],
		["f6", "int"],
		["f7", "short"],
		["f8", "utf"],
		["f9", "bool"],
		["f10", "bool"]
	]) },
	"329279865": { alias: "moveCommand", direction: "in", fields: fieldsOf([
		["f0", "int"],
		["f1", "short"],
		["f2", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }],
		["f3", "byte"],
		["f4", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }],
		["f5", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }],
		["f6", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }]
	]) },
	"377959142": { alias: "exitFromBattle", direction: "in", fields: fieldsOf([
		["f0", "int"]
	]) },
	"522993449": { alias: "initStatisticsModel", direction: "in", fields: fieldsOf([
		["f0", "int"],
		["f1", "int"],
		["f2", "int"],
		["f3", "int"],
		["f4", "int"],
		["f5", "utf"],
		["f6", "int"],
		["f7", "bool"],
		["f8", "int"],
		["f9", "bool"],
		["f10", { list: [ "utf" ], nullable: true }],
		["f11", "int"]
	]) },
	"560344632": { alias: "showNotInClanWindow", direction: "in", fields: fieldsOf([
		["f0", "long"],
		["f1", "long"]
	]) },
	"809822533": { alias: "showQuestWindow", direction: "in", fields: fieldsOf([
		["f0", { list: [ ["f0", "bool"], ["f1", "utf"], ["f2", "int"], ["f3", "long"], ["f4", { list: [ ["f0", "int"], ["f1", "utf"] ], nullable: false }], ["f5", "int"], ["f6", "int"], ["f7", "int"] ], nullable: false }],
		["f1", "int"],
		["f2", "int"],
		["f3", "bool"],
		["f4", "long"],
		["f5", "long"]
	]) },
	"834877801": { alias: "initBattleInviteModel", direction: "in", fields: fieldsOf([
		["f0", "long"]
	]) },
	"907073245": { alias: "initPanel", direction: "in", fields: fieldsOf([
		["f0", "int"],
		["f1", "int"],
		["f2", "int"],
		["f3", "bool"],
		["f4", "int"],
		["f5", "int"],
		["f6", "byte"],
		["f7", "float"],
		["f8", "int"],
		["f9", "int"],
		["f10", "utf"],
		["f11", "utf"]
	]) },
	"1422563374": { alias: "initFriendsList", direction: "in", fields: fieldsOf([
		["f0", { list: [ "utf" ], nullable: true }],
		["f1", { list: [ "utf" ], nullable: true }],
		["f2", { list: [ "utf" ], nullable: true }],
		["f3", { list: [ "utf" ], nullable: true }],
		["f4", { list: [ "utf" ], nullable: true }]
	]) },
	"1587315905": { alias: "openReferrerPanel", direction: "in", fields: fieldsOf([
		["f0", { list: [ ["f0", "int"], ["f1", "utf"] ], nullable: false }],
		["f1", "utf"],
		["f2", "utf"],
		["f3", "utf"]
	]) },
	"1758551995": { alias: "initMeteorStormModel", direction: "in", fields: fieldsOf([
		["f0", "long"],
		["f1", { list: [ ["f0", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }], ["f1", "int"], ["f2", "int"], ["f3", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }] ], nullable: false }],
		["f2", "int"],
		["f3", "long"],
		["f4", "long"],
		["f5", "long"],
		["f6", "long"],
		["f7", "long"],
		["f8", "long"],
		["f9", "long"],
		["f10", "long"],
		["f11", "long"],
		["f12", { list: [ ["f0", "float"], ["f1", "float"], ["f2", "int"], ["f3", "float"], ["f4", "int"] ], nullable: false }],
		["f13", "long"]
	]) },
	"-1232334539": { alias: "initUserCountryModel", direction: "in", fields: fieldsOf([
		["f0", { list: [ ["f0", "utf"], ["f1", "utf"] ], nullable: false }],
		["f1", "utf"],
		["f2", "bool"]
	]) },
	"-1481254568": { alias: "initAchievementModel", direction: "in", fields: fieldsOf([
		["f0", { list: [ "int" ], nullable: false }]
	]) },
	"-1263520410": { alias: "showMessages", direction: "in", fields: fieldsOf([
		["f0", { list: [ ["f0", { opt: [ ["f0", "int"], ["f1", "utf"], ["f2", "int"], ["f3", "utf"] ] }], ["f1", "bool"], ["f2", { opt: [ ["f0", "int"], ["f1", "utf"], ["f2", "int"], ["f3", "utf"] ] }], ["f3", "utf"], ["f4", "bool"] ], nullable: false }]
	]) },
	"-583564465": { alias: "initSocialNetworkPanelModel", direction: "in", fields: fieldsOf([
		["f0", "bool"],
		["f1", { list: [ ["f0", "utf"], ["f1", "bool"], ["f2", "utf"] ], nullable: false }]
	]) },
	"-1895446889": { alias: "setBattle", direction: "in", fields: fieldsOf([
		["f0", "utf"],
		["f1", "utf"],
		["f2", "int"],
		["f3", "bool"],
		["f4", "bool"],
		["f5", "int"],
		["f6", "int"],
		["f7", "int"],
		["f8", "utf"]
	]) },
	"-1338449818": { alias: "initUserClanModels", direction: "in", fields: fieldsOf([
		["f0", "utf"],
		["f1", "bool"],
		["f2", "bool"],
		["f3", "int"],
		["f4", "bool"],
		["f5", "bool"],
		["f6", "int"],
		["f7", "int"],
		["f8", "bool"],
		["f9", "byte"],
		["f10", { list: [ "utf" ], nullable: true }],
		["f11", { list: [ "utf" ], nullable: true }],
		["f12", { list: [ "utf" ], nullable: true }],
		["f13", { list: [ "utf" ], nullable: true }],
		["f14", { list: [ "utf" ], nullable: true }],
		["f15", "long"]
	]) },
	"-1855118498": { alias: "showForeignClanWindow", direction: "in", fields: fieldsOf([
		["f0", "bool"],
		["f1", "long"],
		["f2", "utf"],
		["f3", "utf"],
		["f4", "bool"],
		["f5", "int"],
		["f6", "bool"],
		["f7", "byte"],
		["f8", "utf"],
		["f9", "utf"],
		["f10", "bool"],
		["f11", "bool"],
		["f12", "utf"],
		["f13", { list: [ ["f0", "int"], ["f1", "int"], ["f2", "int"], ["f3", "long"], ["f4", "int"], ["f5", "int"], ["f6", "utf"], ["f7", "int"], ["f8", "int"], ["f9", "int"] ], nullable: false }],
		["f14", "utf"],
		["f15", "int"]
	]) },
	"-1266665816": { alias: "skipDailyQuest", direction: "in", fields: fieldsOf([
		["f0", "int"],
		["f1", "bool"],
		["f2", "utf"],
		["f3", "int"],
		["f4", "long"],
		["f5", { list: [ ["f0", "int"], ["f1", "utf"] ], nullable: false }],
		["f6", "int"],
		["f7", "int"],
		["f8", "int"]
	]) },
	"-1683279062": { alias: "fullMoveCommand", direction: "in", fields: fieldsOf([
		["f0", "int"],
		["f1", "short"],
		["f2", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }],
		["f3", "byte"],
		["f4", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }],
		["f5", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }],
		["f6", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }],
		["f7", "float"]
	]) },
	"-1233891872": { alias: "initStatisticsTeamModel", direction: "in", fields: fieldsOf([
		["f0", "int"],
		["f1", "int"],
		["f2", { list: [ ["f0", "int"], ["f1", "short"], ["f2", "short"], ["f3", "byte"], ["f4", "int"], ["f5", "utf"] ], nullable: false }],
		["f3", { list: [ ["f0", "int"], ["f1", "short"], ["f2", "short"], ["f3", "byte"], ["f4", "int"], ["f5", "utf"] ], nullable: false }]
	]) },
	"-959048700": { alias: "initRegionsModel", direction: "in", fields: fieldsOf([
		["f0", { list: [ ["f0", "long"], ["f1", "int"] ], nullable: false }],
		["f1", { list: [ ["f0", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }], ["f1", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }], ["f2", "int"] ], nullable: false }]
	]) },
	"-497293992": { alias: "changeUserStat", direction: "in", fields: fieldsOf([
		["f0", "short"],
		["f1", "short"],
		["f2", "int"],
		["f3", "utf"],
		["f4", "int"]
	]) },
	"-484994657": { alias: "fireCommand", direction: "in", fields: fieldsOf([
		["f0", "int"],
		["f1", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }],
		["f2", { list: [ "utf" ], nullable: true }],
		["f3", { list: [ ["f0", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }] ], nullable: true }],
		["f4", { list: [ "short" ], nullable: true }],
		["f5", { list: [ ["f0", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }] ], nullable: true }],
		["f6", { list: [ ["f0", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }] ], nullable: true }]
	]) },
	"-226978906": { alias: "initBattleMinesModel", direction: "in", fields: fieldsOf([
		["f0", "long"],
		["f1", "int"],
		["f2", { list: [ ["f0", "utf"], ["f1", "utf"], ["f2", { opt: [ ["x", "float"], ["y", "float"], ["z", "float"] ] }] ], nullable: false }],
		["f3", "long"],
		["f4", "long"],
		["f5", "long"],
		["f6", "long"],
		["f7", "long"],
		["f8", "float"],
		["f9", "long"],
		["f10", "long"],
		["f11", "float"],
		["f12", "long"],
		["f13", "float"],
		["f14", "long"],
		["f15", "float"],
		["f16", "float"],
		["f17", "long"]
	]) },
};
