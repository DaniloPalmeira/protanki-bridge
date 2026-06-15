// ShowBattleInfoPacket
// Disables autobalance in every battle info packet sent to the client.

module.exports = {
	packetId: 546722394,
	direction: "in",

	handle(packet, ByteArray) {
		const battle = JSON.parse(packet.readUTF());

		if ("autoBalance" in battle) {
			battle.autoBalance = false;
		}

		const out = new ByteArray();
		out.writeUTF(JSON.stringify(battle));
		return out;
	},
};
