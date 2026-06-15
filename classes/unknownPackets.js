const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../unknown-packets.json");
const MAX_SAMPLES = 3;

// unknowns: Map<string, { firstSeen: string, samples: string[] }>
let unknowns = new Map();

try {
	const saved = JSON.parse(fs.readFileSync(FILE, "utf8"));
	if (Array.isArray(saved)) {
		// migrate from old flat-array format
		for (const id of saved) unknowns.set(String(id), { firstSeen: null, samples: [] });
	} else {
		for (const [id, entry] of Object.entries(saved)) unknowns.set(id, entry);
	}
} catch {}

function save() {
	const sorted = [...unknowns.entries()]
		.sort((a, b) => Number(a[0]) - Number(b[0]))
		.reduce((obj, [id, entry]) => { obj[id] = entry; return obj; }, {});
	fs.writeFileSync(FILE, JSON.stringify(sorted, null, 2));
}

function track(id, packet = null) {
	const key = String(id);
	const entry = unknowns.get(key) ?? { firstSeen: new Date().toISOString(), samples: [] };

	let changed = !unknowns.has(key);

	if (packet && entry.samples.length < MAX_SAMPLES) {
		const hex = Buffer.from(packet.buffer).toString("hex");
		if (!entry.samples.includes(hex)) {
			entry.samples.push(hex);
			changed = true;
		}
	}

	if (changed) {
		unknowns.set(key, entry);
		save();
	}
}

module.exports = { track };
