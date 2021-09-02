// const arduino = require("../../arduino");

exports.command = "<state>";

exports.describe = "change the LED state";

exports.builder = {
	state: {
		default: false,
	},
};

exports.handler = function (argv) {
	argv.msg.channel.send("For now the arduino is not in service.");
	// if (argv.state === "on") {
	// 	arduino.led(true);
	// } else {
	// 	arduino.led(false);
	// }
};
