const fs = require("fs");
const path = require("path");
const ByteArray = require("./ByteArray");

class PluginManager {
	// plugins[direction][packetId] = [fn, ...]
	// direction: 'in'  = server → client
	//            'out' = client → server
	#plugins = { in: {}, out: {} };

	constructor() {
		this.#load();
	}

	#load() {
		const dir = path.join(__dirname, "../plugins");
		if (!fs.existsSync(dir)) return;

		for (const file of fs.readdirSync(dir)) {
			if (!file.endsWith(".js")) continue;
			try {
				const plugin = require(path.join(dir, file));
				const direction = plugin.direction ?? "in";
				const ids = Array.isArray(plugin.packetId)
					? plugin.packetId
					: [plugin.packetId];

				for (const id of ids) {
					if (!this.#plugins[direction][id]) {
						this.#plugins[direction][id] = [];
					}
					this.#plugins[direction][id].push(plugin.handle);
					console.log(`[plugin] loaded ${file} → ${direction} ${id}`);
				}
			} catch (e) {
				console.error(`[plugin] failed to load ${file}:`, e.message);
			}
		}
	}

	// Returns a new ByteArray (possibly modified), or the original if no plugin matched.
	run(direction, packetId, packet) {
		const handlers = this.#plugins[direction]?.[packetId];
		if (!handlers) return packet;

		for (const handle of handlers) {
			const result = handle(new ByteArray(packet.buffer), ByteArray);
			if (result instanceof ByteArray) packet = result;
		}
		return packet;
	}
}

module.exports = PluginManager;
