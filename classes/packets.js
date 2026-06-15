const PACKETS = {
	2001736388: "ReceiveHashPacket",
	"-1715719586": "InitExternalModelPacket",
	321971701: "InitModelPacket",
	"-1797047325": "LoadDependenciesPacket",
	"-555602629": "PingPacket",
	"-1864333717": "SetLangPacket",
	1484572481: "PongPacket",
	"-82304134": "DependenciesLoadedPacket",
	"-1376947245": "NextTipPacket",
};

function packetName(id) {
	return PACKETS[id] ?? `UNKNOWN(${id})`;
}

module.exports = { PACKETS, packetName };
