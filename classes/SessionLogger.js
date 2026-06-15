const fs = require("fs");
const path = require("path");

const LOGS_DIR = path.join(__dirname, "../logs");

class SessionLogger {
	#stream = null;
	#filePath = null;
	// stats[direction][name] = count
	#stats = { "server→client": {}, "client→server": {} };

	constructor() {
		if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

		const now = new Date();
		const pad = (n) => String(n).padStart(2, "0");
		const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;

		this.#filePath = path.join(LOGS_DIR, `${stamp}.txt`);
		this.#stream = fs.createWriteStream(this.#filePath, { flags: "a" });
		this.#write(`=== Session started at ${now.toISOString()} ===`);
		console.log(`[log] session log → ${this.#filePath}`);
	}

	#write(line) {
		const ts = new Date().toISOString().replace("T", " ").slice(0, 23);
		this.#stream.write(`[${ts}] ${line}\n`);
	}

	packet(direction, name, id) {
		this.#write(`${direction} ${name} (${id})`);
		const bucket = this.#stats[direction];
		bucket[name] = (bucket[name] ?? 0) + 1;
	}

	info(msg) {
		this.#write(msg);
	}

	#printStats() {
		const format = (direction) => {
			const entries = Object.entries(this.#stats[direction]);
			if (!entries.length) return;
			const sorted = entries.sort((a, b) => b[1] - a[1]);
			const lines = sorted.map(([name, count]) => `  ${count.toString().padStart(5)}x  ${name}`);
			console.log(`\n[stats] ${direction}\n${lines.join("\n")}`);
			this.#write(`--- ${direction} ---`);
			for (const line of lines) this.#write(line.trim());
		};

		console.log("\n=== Packet statistics ===");
		this.#write("=== Packet statistics ===");
		format("server→client");
		format("client→server");
	}

	close() {
		this.#printStats();
		this.#write(`=== Session ended at ${new Date().toISOString()} ===`);
		this.#stream.end();
	}
}

module.exports = SessionLogger;
