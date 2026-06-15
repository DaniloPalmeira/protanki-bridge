const fs = require("fs");
const path = require("path");
const ByteArray = require("./ByteArray");

const PLUGINS_DIR = path.join(__dirname, "../plugins");

class PluginManager {
	// plugins[direction][packetId] = [fn, ...]
	// direction: 'in'  = server → client
	//            'out' = client → server
	#plugins = { in: {}, out: {} };

	constructor() {
		this.#loadAll();
		this.#watch();
	}

	#loadAll() {
		this.#plugins = { in: {}, out: {} };
		if (!fs.existsSync(PLUGINS_DIR)) return;

		for (const file of fs.readdirSync(PLUGINS_DIR)) {
			if (file.endsWith(".js")) this.#loadFile(file);
		}
	}

	#loadFile(file) {
		const fullPath = path.join(PLUGINS_DIR, file);
		try {
			delete require.cache[require.resolve(fullPath)];
			const plugin = require(fullPath);

			this.#validate(plugin, file);

			const direction = plugin.direction ?? "in";
			const ids = Array.isArray(plugin.packetId)
				? plugin.packetId
				: [plugin.packetId];

			for (const id of ids) {
				if (!this.#plugins[direction][id]) {
					this.#plugins[direction][id] = [];
				}
				this.#plugins[direction][id].push(plugin.handle);
			}
			console.log(`[plugin] loaded ${file} → ${direction} [${ids.join(", ")}]`);
		} catch (e) {
			console.error(`[plugin] failed to load ${file}: ${e.message}`);
		}
	}

	#validate(plugin, file) {
		if (plugin.packetId === undefined)
			throw new Error(`missing 'packetId' in ${file}`);
		if (typeof plugin.handle !== "function")
			throw new Error(`missing 'handle' function in ${file}`);
		if (plugin.direction && !["in", "out"].includes(plugin.direction))
			throw new Error(`invalid direction '${plugin.direction}' in ${file} (use "in" or "out")`);
	}

	#watch() {
		if (!fs.existsSync(PLUGINS_DIR)) return;

		let debounce = null;
		fs.watch(PLUGINS_DIR, (_, file) => {
			if (!file?.endsWith(".js")) return;
			clearTimeout(debounce);
			debounce = setTimeout(() => {
				console.log(`[plugin] change detected in ${file}, reloading all plugins...`);
				this.#loadAll();
			}, 100);
		});
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
