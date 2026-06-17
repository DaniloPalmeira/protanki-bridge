const net = require("node:net");
const ByteArray = require("./ByteArray");
const { packetName } = require("./packets");
const { validate } = require("./schemas/index");
const plugins = require("./PluginManager");

class ProTankiClient {
	rawDataReceived = new ByteArray();

	keys = [];

	decrypt_position = 0;
	encrypt_position = 0;

	encryptionLenght = 8;
	decrypt_keys = new Array(8);
	encrypt_keys = new Array(8);

	constructor(server, logger, recorder) {
		this.server = server;
		this.logger = logger;
		this.recorder = recorder;

		this.socket = net.createConnection(
			{ host: "194.67.196.216", port: 25565 },
			() => {
				this.logger.info("Connected to game server");
				console.log("Connected to game server");
			}
		);
		this.socket.on("data", (data) => {
			this.onDataReceived(data);
		});
		this.socket.on("end", () => {
			this.server.socket.end();
			this.logger.info("Disconnected from game server");
			console.log("Disconnected from game server");
		});
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
			this.encrypt_keys[locaoako3] = base ^ (locaoako3 << 3) ^ 87;
			this.decrypt_keys[locaoako3] = base ^ (locaoako3 << 3);
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

		var rawLen = this.rawDataReceived.readInt();
		var lenFlags = rawLen & 0xc0000000;
		var possibleLen = (rawLen & 0x3fffffff) - 4;

		if (this.rawDataReceived.bytesAvailable() >= possibleLen) {
			var _data = new ByteArray(this.rawDataReceived.readBytes(possibleLen));
			this.parsePacket(_data, lenFlags);
			if (this.rawDataReceived.bytesAvailable() > 0) {
				await this.onDataReceived();
			}
		} else {
			this.rawDataReceived.writeIntStart(rawLen);
			console.log(
				"Pacote imcompleto",
				possibleLen,
				this.rawDataReceived.bytesAvailable()
			);
		}
	}

	parsePacket(packet, lenFlags = 0) {
		const packetID = packet.readInt();
		const name = packetName(packetID, packet);

		if (packetID == 2001736388) {
			this.logger.packet("server→client", name, packetID, packet.buffer);
			this.recorder.record("server→client", packetID, packet);
			console.log("[protanki-local]:", name, packetID);
			this.readReceivedKeys(packet);
		} else {
			this.decryptPacket(packet);
			this.logger.packet("server→client", name, packetID, packet.buffer);
			this.recorder.record("server→client", packetID, packet);
			console.log("[protanki-local]:", name, packetID);

			validate(packetID, packet, name);

			packet = plugins.run("in", packetID, packet);

			this.server.sendPacket(packetID, packet, true, lenFlags);
		}
	}

	readReceivedKeys(packet) {
		let kLen = packet.readInt();
		while (kLen > 0) {
			this.keys.push(packet.readByte());
			kLen--;
		}

		this.server.gerateCryptKeys(this.keys);
		this.setCrypsKeys(this.keys);
	}

	sendPacket(packetID, packet = new ByteArray(), encryption = true) {
		const name = packetName(packetID);
		console.log("[local-protanki]:", name, packetID);
		this.logger.packet("client→server", name, packetID, packet.buffer);
		if (encryption) {
			this.encryptPacket(packet);
		}

		var byteA = new ByteArray()
			.writeInt(packet.buffer.length + 8)
			.writeInt(packetID)
			.write(packet.buffer).buffer;

		this.socket.write(byteA);
	}
}
module.exports = ProTankiClient;
