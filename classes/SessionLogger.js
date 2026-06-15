const fs = require("fs");
const path = require("path");

const LOGS_DIR = path.join(__dirname, "../logs");

class SessionLogger {
	#stream = null;
	#filePath = null;

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
	}

	info(msg) {
		this.#write(msg);
	}

	close() {
		this.#write(`=== Session ended at ${new Date().toISOString()} ===`);
		this.#stream.end();
	}
}

module.exports = SessionLogger;
