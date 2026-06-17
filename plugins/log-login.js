// LoginPacket — logs credentials sent by the client to the server.

module.exports = {
	packet: "login",

	handle({ username, password, rememberMe }) {
		console.log("[login]: username =", username, "| rememberMe =", rememberMe);
		// Return fields unchanged to pass through
		return { username, password, rememberMe };
	},
};
