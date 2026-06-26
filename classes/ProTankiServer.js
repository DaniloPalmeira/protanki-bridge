const ProTankiClient = require("./ProTankiClient");
const ByteArray = require("./ByteArray");
const { packetName } = require("./packets");
const { validate, parse, format } = require("./schemas/index");
const plugins = require("./PluginManager");
const SessionLogger = require("./SessionLogger");
const { SessionRecorder } = require("./SessionRecorder");

let sessionCounter = 0;

class ProTankiServer {
	decrypt_position = 0;
	encrypt_position = 0;

	encryptionLenght = 8;
	decrypt_keys = new Array(8);
	encrypt_keys = new Array(8);
	constructor(data) {
		Object.assign(this, data);

		// Unique id per connection so logs/recordings/console never mix
		// between simultaneous clients. Counter disambiguates within a run,
		// remote port disambiguates across restarts.
		const num = ++sessionCounter;
		this.sessionId = `s${num}-${this.socket.remotePort}`;
		this.tag = `[s${num}]`;

		this.logger = new SessionLogger(this.sessionId);
		this.recorder = new SessionRecorder(this.sessionId);
		this.client = new ProTankiClient(this, this.logger, this.recorder);

		this.rawDataReceived = new ByteArray(Buffer.alloc(0));

		this.logger.info(`Client connected: ${this.socket.remoteAddress}`);
		console.log(this.tag, "Connected with client", this.socket.remoteAddress);

		this.socket.on("data", (data) => this.onDataReceived(data));
		this.socket.on("close", () => this.onConnectionClose());
		this.socket.on("error", () => this.onConnectionClose());
	}

	onConnectionClose() {
		this.client.socket.end();
		this.logger.info(`Client disconnected: ${this.socket.remoteAddress}`);
		this.logger.close();
		this.recorder.close();
		console.log(this.tag, "Disconnected from client", this.socket.remoteAddress);
	}

	gerateCryptKeys(keys) {
		var packet = new ByteArray();

		packet.writeInt(keys.length);
		keys.map((val) => {
			[packet.writeByte(val)];
		});

		this.sendPacket(2001736388, packet, false);

		this.setCrypsKeys(keys);

		return keys;
	}

	setCrypsKeys = async (keys) => {
		var locaoako2 = 0;
		var base = 0;
		while (locaoako2 < keys.length) {
			base ^= keys[locaoako2];
			locaoako2 += 1;
		}
		var locaoako3 = 0;
		while (locaoako3 < this.encryptionLenght) {
			this.encrypt_keys[locaoako3] = base ^ (locaoako3 << 3);
			this.decrypt_keys[locaoako3] = base ^ (locaoako3 << 3) ^ 87;
			locaoako3 += 1;
		}
	};

	decryptPacket(BArray) {
		var loc2 = 0;
		var loc3 = 0;

		var ByteA = new ByteArray(BArray.buffer);

		while (loc2 < BArray.buffer.length) {
			loc3 = ByteA.readByte();

			this.decrypt_keys[this.decrypt_position] =
				loc3 ^ this.decrypt_keys[this.decrypt_position];

			BArray.buffer[loc2] = this.decrypt_keys[this.decrypt_position];

			this.decrypt_position ^= this.decrypt_keys[this.decrypt_position] & 7;

			loc2 += 1;
		}
	}

	encryptPacket(BArray) {
		var loc2 = 0;
		var loc3 = 0;

		var ByteA = new ByteArray(BArray.buffer);

		while (loc2 < BArray.buffer.length) {
			loc3 = ByteA.readByte();

			BArray.buffer[loc2] = loc3 ^ this.encrypt_keys[this.encrypt_position];

			this.encrypt_keys[this.encrypt_position] = loc3;

			this.encrypt_position ^= loc3 & 7;

			loc2 += 1;
		}
	}

	async onDataReceived(data = null) {
		if (data != null) {
			this.rawDataReceived.write(data);
		}

		// Need at least the 4-byte length prefix before we can frame a packet.
		// A TCP segment can split mid-prefix; leave the partial bytes buffered.
		if (this.rawDataReceived.bytesAvailable() < 4) {
			return;
		}

		var rawLen = this.rawDataReceived.readInt();
		var possibleLen = (rawLen & 0x3fffffff) - 4;

		if (this.rawDataReceived.bytesAvailable() >= possibleLen) {
			var _data = new ByteArray(this.rawDataReceived.readBytes(possibleLen));
			this.parsePacket(_data);
			if (this.rawDataReceived.bytesAvailable() > 0) {
				await this.onDataReceived();
			}
		} else {
			this.rawDataReceived.writeIntStart(rawLen);
		}
	}

	async parsePacket(packet) {
		const packetID = packet.readInt();

		this.decryptPacket(packet);

		const name = packetName(packetID, packet);
		const fields = parse(packetID, packet);
		this.logger.packet("client→server", name, packetID, packet.buffer, fields);
		this.recorder.record("client→server", packetID, packet);
		console.log(`${this.tag} → ${name}${fields ? ": " + format(packetID, fields) : ""}`);

		validate(packetID, packet, name, this.tag);

		packet = plugins.run("out", packetID, packet);

		this.client.sendPacket(packetID, packet);
	}

	sendPacket(packetID, packet = new ByteArray(), encryption = true, lenFlags = 0) {
		if (encryption) {
			this.encryptPacket(packet);
		}

		var byteA = new ByteArray()
			.writeUInt((packet.buffer.length + 8) | lenFlags)
			.writeInt(packetID)
			.write(packet.buffer).buffer;

		this.socket.write(byteA);
	}
}

module.exports = ProTankiServer;
