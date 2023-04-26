const net = require("node:net");
const ByteArray = require("./ByteArray");

class ProTankiClient {
	rawDataReceived = new ByteArray();

	keys = [];

	decrypt_position = 0;
	encrypt_position = 0;

	encryptionLenght = 8;
	decrypt_keys = new Array(8);
	encrypt_keys = new Array(8);

	constructor(server) {
		this.server = server;

		this.socket = net.createConnection(
			{ host: "146.59.110.195", port: 1337 },
			() => {
				console.log("Connected to game server");
			}
		);
		this.socket.on("data", (data) => {
			this.onDataReceived(data);
		});
		this.socket.on("end", () => {
			this.server.socket.end();
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

		var possibleLen = this.rawDataReceived.readInt() - 4;

		if (this.rawDataReceived.bytesAvailable() >= possibleLen) {
			var _data = new ByteArray(this.rawDataReceived.readBytes(possibleLen));
			this.parsePacket(_data);
			if (this.rawDataReceived.bytesAvailable() > 0) {
				await this.onDataReceived();
			}
		} else {
			this.rawDataReceived.writeIntStart(possibleLen + 4);
			console.log(
				"Pacote imcompleto",
				possibleLen - 4,
				this.rawDataReceived.bytesAvailable(),
				this.rawDataReceived
			);
		}
	}

	parsePacket(packet) {
		const packetID = packet.readInt();
		console.log("[protanki-local]:", packetID);

		if (packetID == 2001736388) {
			this.readReceivedKeys(packet);
		} else {
			this.decryptPacket(packet);

			// Here you make changes to the packet received by protanki before sending it to your game

			// In this example you disable autobalance
			if (packetID == 546722394) {
				const _packet = new ByteArray();
				_packet.write(packet.buffer);
				const showBattleObj = _packet.readObject();
				if ("autoBalance" in showBattleObj) {
					showBattleObj.autoBalance = false;
				}
				packet = new ByteArray();
				packet.writeObject(showBattleObj);
			}

			this.server.sendPacket(packetID, packet);
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
		console.log("[local-protanki]:", packetID);
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
