const fs = require("fs");
const path = require("path");

const LOGS_DIR = path.join(__dirname, "../logs");

class SessionLogger {
	#stream   = null;
	#filePath = null;
	#stats    = { "server→client": {}, "client→server": {} };

	constructor() {
		if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

		const now = new Date();
		const pad = (n) => String(n).padStart(2, "0");
		const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;

		this.#filePath = path.join(LOGS_DIR, `${stamp}.ndjson`);
		this.#stream   = fs.createWriteStream(this.#filePath, { flags: "a" });
		this.#write({ type: "session_start", ts: now.toISOString() });
		console.log(`[log] session log → ${this.#filePath}`);
	}

	#write(obj) {
		this.#stream.write(JSON.stringify(obj) + "\n");
	}

	packet(direction, name, id, payload = null) {
		const buf  = payload ? (Buffer.isBuffer(payload) ? payload : Buffer.from(payload)) : null;
		const size = buf?.length ?? 0;

		this.#write({
			type: "packet",
			ts:   new Date().toISOString(),
			dir:  direction,
			name,
			id,
			size,
			hex:  buf?.toString("hex") ?? "",
		});

		const bucket = this.#stats[direction];
		bucket[name] = (bucket[name] ?? 0) + 1;
	}

	info(msg) {
		this.#write({ type: "info", ts: new Date().toISOString(), msg });
	}

	close() {
		const stats = {};
		for (const [dir, bucket] of Object.entries(this.#stats)) {
			stats[dir] = Object.entries(bucket)
				.sort((a, b) => b[1] - a[1])
				.map(([name, count]) => ({ name, count }));
		}

		this.#write({ type: "session_end", ts: new Date().toISOString(), stats });
		this.#stream.end();

		// Print stats to console
		console.log("\n=== Packet statistics ===");
		for (const [dir, entries] of Object.entries(stats)) {
			if (!entries.length) continue;
			console.log(`\n[stats] ${dir}`);
			for (const { name, count } of entries) {
				console.log(`  ${String(count).padStart(5)}x  ${name}`);
			}
		}
	}
}

module.exports = SessionLogger;
