const arduino = require("../../arduino");

exports.command = "<state>";

exports.describe = "play a nice melody";

exports.builder = {
  state: {
    play: false,
  },
};

exports.handler = function (argv) {
	if(argv.state === "play"){
		arduino.tone(true);
		argv.msg.channel.send("héhé ;)");
	}
};
