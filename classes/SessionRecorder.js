const fs = require("fs");
const path = require("path");

const RECORDINGS_DIR = path.join(__dirname, "../recordings");

const DIR_SERVER_TO_CLIENT = 0;
const DIR_CLIENT_TO_SERVER = 1;

class SessionRecorder {
	#stream = null;
	#filePath = null;

	constructor() {
		if (!fs.existsSync(RECORDINGS_DIR))
			fs.mkdirSync(RECORDINGS_DIR, { recursive: true });

		const now = new Date();
		const pad = (n) => String(n).padStart(2, "0");
		const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;

		this.#filePath = path.join(RECORDINGS_DIR, `${stamp}.bin`);
		this.#stream = fs.createWriteStream(this.#filePath);
		console.log(`[rec] recording → ${this.#filePath}`);
	}

	record(direction, packetID, packet) {
		const payload = packet.buffer.slice(packet.position);
		const dirByte = direction === "server→client" ? DIR_SERVER_TO_CLIENT : DIR_CLIENT_TO_SERVER;

		const header = Buffer.allocUnsafe(1 + 8 + 4 + 4);
		let offset = 0;
		header.writeUInt8(dirByte, offset); offset += 1;
		header.writeBigUInt64BE(BigInt(Date.now()), offset); offset += 8;
		header.writeInt32BE(packetID, offset); offset += 4;
		header.writeUInt32BE(payload.length, offset);

		this.#stream.write(header);
		if (payload.length > 0) this.#stream.write(payload);
	}

	close() {
		this.#stream.end();
	}

	get filePath() {
		return this.#filePath;
	}
}

module.exports = { SessionRecorder, DIR_SERVER_TO_CLIENT, DIR_CLIENT_TO_SERVER };
