const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../../incomplete-packets.json");

let db = {};

if (fs.existsSync(FILE)) {
	try { db = JSON.parse(fs.readFileSync(FILE, "utf8")); } catch {}
}

function record(packetId, name, issue, hex = "") {
	const key = String(packetId);
	const existing = db[key];

	if (existing && existing.issue === issue) {
		existing.count++;
		existing.hex = hex;
	} else {
		db[key] = { name, issue, count: 1, hex };
	}

	fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

module.exports = { record };
