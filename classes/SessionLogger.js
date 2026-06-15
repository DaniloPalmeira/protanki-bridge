const fs = require("fs");
const path = require("path");

const LOGS_DIR = path.join(__dirname, "../logs");

function hexdump(buf) {
	if (!buf || buf.length === 0) return "  (empty)\n";
	const lines = [];
	for (let i = 0; i < buf.length; i += 16) {
		const slice = buf.slice(i, i + 16);
		const offset = i.toString(16).padStart(8, "0");
		const hex = [...slice]
			.map((b) => b.toString(16).padStart(2, "0"))
			.join(" ")
			.padEnd(16 * 3 - 1, " ");
		const ascii = [...slice]
			.map((b) => (b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : "."))
			.join("");
		lines.push(`  ${offset}  ${hex}  |${ascii}|`);
	}
	return lines.join("\n") + "\n";
}

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
		this.#writeLine(`=== Session started at ${now.toISOString()} ===\n`);
		console.log(`[log] session log → ${this.#filePath}`);
	}

	#ts() {
		return new Date().toISOString().replace("T", " ").slice(0, 23);
	}

	#writeLine(line) {
		this.#stream.write(line);
	}

	packet(direction, name, id, payload = null) {
		const payloadBuf = payload
			? (Buffer.isBuffer(payload) ? payload : Buffer.from(payload))
			: null;
		const size = payloadBuf ? payloadBuf.length : 0;

		this.#writeLine(
			`[${this.#ts()}] ${direction}  ${name} (${id})  [${size}B]\n` +
			hexdump(payloadBuf)
		);

		const bucket = this.#stats[direction];
		bucket[name] = (bucket[name] ?? 0) + 1;
	}

	info(msg) {
		this.#writeLine(`[${this.#ts()}] ${msg}\n`);
	}

	#printStats() {
		const format = (direction) => {
			const entries = Object.entries(this.#stats[direction]);
			if (!entries.length) return;
			const sorted = entries.sort((a, b) => b[1] - a[1]);
			const lines = sorted.map(([name, count]) => `  ${count.toString().padStart(5)}x  ${name}`);
			console.log(`\n[stats] ${direction}\n${lines.join("\n")}`);
			this.#writeLine(`--- ${direction} ---\n${lines.join("\n")}\n`);
		};

		console.log("\n=== Packet statistics ===");
		this.#writeLine(`\n=== Packet statistics ===\n`);
		format("server→client");
		format("client→server");
	}

	close() {
		this.#printStats();
		this.#writeLine(`\n=== Session ended at ${new Date().toISOString()} ===\n`);
		this.#stream.end();
	}
}

module.exports = SessionLogger;
