const net = require("net");

const ProTankiServer = require("./classes/ProTankiServer");
const handleConnection = (socket) => {
	new ProTankiServer({
		socket,
	});
};

const __ports = [443];
for (const port of __ports) {
	let serverRun = net.createServer(handleConnection, () => {
		console.log("Connected with client");
	});
	serverRun.listen(port);
	console.log("Servidor iniciado na porta:", port);
}
