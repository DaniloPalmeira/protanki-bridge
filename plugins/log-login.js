// LoginPacket — logs credentials sent by the client to the server.
// This is an example of a direction: "out" plugin (client → server).

module.exports = {
	packetId: -739684591,
	direction: "out",

	handle(packet, ByteArray) {
		const login = packet.readUTF();
		const password = packet.readUTF();
		const rememberMe = packet.readBoolean();

		console.log("[login]: login =", login, "| rememberMe =", rememberMe);

		// Pass through unchanged
		const out = new ByteArray();
		out.writeUTF(login);
		out.writeUTF(password);
		out.writeBoolean(rememberMe);
		return out;
	},
};
