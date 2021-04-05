const pm2 = require("pm2");

exports.describe = "restarts the bots entirely";

exports.handler = async argv => {
	await pm2.connect();
	pm2.restart("nono");
};
