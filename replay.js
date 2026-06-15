#!/usr/bin/env node
// Usage: node replay.js <recording.bin>

const fs = require("fs");
const path = require("path");
const { packetName } = require("./classes/packets");
const { DIR_SERVER_TO_CLIENT } = require("./classes/SessionRecorder");

const file = process.argv[2];
if (!file) {
	console.error("Usage: node replay.js <recording.bin>");
	process.exit(1);
}

const buf = fs.readFileSync(path.resolve(file));
let offset = 0;
let index = 0;
let startMs = null;

while (offset < buf.length) {
	if (buf.length - offset < 1 + 8 + 4 + 4) break;

	const dir = buf.readUInt8(offset); offset += 1;
	const tsMs = Number(buf.readBigUInt64BE(offset)); offset += 8;
	const packetID = buf.readInt32BE(offset); offset += 4;
	const payloadLen = buf.readUInt32BE(offset); offset += 4;

	if (buf.length - offset < payloadLen) break;
	const payload = buf.slice(offset, offset + payloadLen); offset += payloadLen;

	if (startMs === null) startMs = tsMs;
	const elapsed = ((tsMs - startMs) / 1000).toFixed(3);

	const direction = dir === DIR_SERVER_TO_CLIENT ? "server→client" : "client→server";
	const name = packetName(packetID);
	const hexSnippet = payload.length > 0
		? payload.slice(0, 16).toString("hex") + (payload.length > 16 ? "…" : "")
		: "(empty)";

	console.log(`[${String(++index).padStart(4)}] +${elapsed}s  ${direction.padEnd(15)}  ${name.padEnd(40)} id=${packetID}  payload=${payload.length}B  ${hexSnippet}`);
}

console.log(`\nTotal: ${index} packets`);
