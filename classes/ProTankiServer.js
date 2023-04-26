const ProTankiClient = require("./ProTankiClient");
const ByteArray = require("./ByteArray");

class ProTankiServer {
	decrypt_position = 0;
	encrypt_position = 0;

	encryptionLenght = 8;
	decrypt_keys = new Array(8);
	encrypt_keys = new Array(8);
	constructor(data) {
		Object.assign(this, data);

		this.client = new ProTankiClient(this);

		this.rawDataReceived = new ByteArray(Buffer.alloc(0));

		console.log("Connected with client", this.socket.remoteAddress);

		this.socket.on("data", (data) => this.onDataReceived(data));
		this.socket.on("close", () => this.onConnectionClose());
		this.socket.on("error", () => this.onConnectionClose());
	}

	onConnectionClose() {
		this.client.socket.end();
		console.log("Disconnected from client", this.socket.remoteAddress);
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

		var possibleLen = this.rawDataReceived.readInt() - 4;

		if (this.rawDataReceived.bytesAvailable() >= possibleLen) {
			var _data = new ByteArray(this.rawDataReceived.readBytes(possibleLen));
			this.parsePacket(_data);
			if (this.rawDataReceived.bytesAvailable() > 0) {
				await this.onDataReceived();
			}
		} else {
			this.rawDataReceived.writeIntStart(possibleLen + 4);
		}
	}

	async parsePacket(packet) {
		const packetID = packet.readInt();

		this.decryptPacket(packet);

		console.log("[client-local]:", packetID);

		// Here you make changes to the package received by your game before sending it to protanki

		this.client.sendPacket(packetID, packet);
	}

	sendPacket(packetID, packet = new ByteArray(), encryption = true) {
		console.log("[local-client]:", packetID);
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

module.exports = ProTankiServer;
