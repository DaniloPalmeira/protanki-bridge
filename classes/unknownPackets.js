const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../unknown-packets.json");

let unknowns = new Set();

try {
	const saved = JSON.parse(fs.readFileSync(FILE, "utf8"));
	unknowns = new Set(saved);
} catch {}

function track(id) {
	const key = String(id);
	if (unknowns.has(key)) return;
	unknowns.add(key);
	fs.writeFileSync(
		FILE,
		JSON.stringify([...unknowns].sort((a, b) => Number(a) - Number(b)), null, 2)
	);
}

module.exports = { track };
