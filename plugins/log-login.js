const { format } = require("../classes/schemas/index");
const { lookupAlias } = require("../classes/schemas/index");

const { id: packetId } = lookupAlias("login");

module.exports = {
	packet: "login",

	handle(fields) {
		console.log("[login]:", format(packetId, fields));
		return fields;
	},
};
