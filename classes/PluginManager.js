const fs = require("fs");
const path = require("path");
const ByteArray = require("./ByteArray");
const { lookupAlias, getSchema, parse, serialize } = require("./schemas/index");

const PLUGINS_DIR = path.join(__dirname, "../plugins");

class PluginManager {
	// plugins[direction][packetId] = [{ handle, schemaMode }, ...]
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

			let id, direction, schemaMode;

			if (plugin.packet !== undefined) {
				// schema mode: resolve alias → id + direction
				const entry = lookupAlias(plugin.packet);
				if (!entry) throw new Error(`unknown packet alias "${plugin.packet}" in ${file}`);
				if (!entry.schema.fields.length)
					throw new Error(`packet alias "${plugin.packet}" has no fields defined in schema — use packetId for raw mode`);
				id = entry.id;
				direction = plugin.direction ?? entry.schema.direction;
				schemaMode = true;
			} else {
				// raw mode: packetId provided directly
				id = plugin.packetId;
				direction = plugin.direction ?? "in";
				schemaMode = false;
			}

			const ids = Array.isArray(id) ? id : [id];

			for (const pid of ids) {
				if (!this.#plugins[direction][pid]) this.#plugins[direction][pid] = [];
				this.#plugins[direction][pid].push({ handle: plugin.handle, schemaMode });
			}

			console.log(`[plugin] loaded ${file} → ${direction} [${ids.join(", ")}]${schemaMode ? " (schema mode)" : ""}`);
		} catch (e) {
			console.error(`[plugin] failed to load ${file}: ${e.message}`);
		}
	}

	#validate(plugin, file) {
		const hasAlias = plugin.packet !== undefined;
		const hasId    = plugin.packetId !== undefined;

		if (!hasAlias && !hasId)
			throw new Error(`missing 'packet' (alias) or 'packetId' in ${file}`);
		if (hasAlias && hasId)
			throw new Error(`use either 'packet' or 'packetId', not both, in ${file}`);
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

	// Returns a (possibly modified) ByteArray, or the original if no plugin matched.
	run(direction, packetId, packet) {
		const handlers = this.#plugins[direction]?.[packetId];
		if (!handlers) return packet;

		for (const { handle, schemaMode } of handlers) {
			if (schemaMode) {
				packet = this.#runSchemaMode(handle, packetId, packet);
			} else {
				const result = handle(new ByteArray(packet.buffer), ByteArray);
				if (result instanceof ByteArray) packet = result;
			}
		}
		return packet;
	}

	#runSchemaMode(handle, packetId, packet) {
		const fields = parse(packetId, packet);
		const result = handle(fields);

		// plain object → re-serialize using schema
		if (result && typeof result === "object" && !(result instanceof ByteArray)) {
			return serialize(packetId, result);
		}
		if (result instanceof ByteArray) return result;

		// null/undefined → pass through original
		return packet;
	}
}

module.exports = new PluginManager();
