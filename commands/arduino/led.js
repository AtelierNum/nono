const arduino = require("../../arduino");

exports.command = "<state>";

exports.describe = "change the LED state";

exports.builder = {
  state: {
    default: false,
  },
};

exports.handler = function (argv) {
	if(argv.state === "on"){
		arduino.led(true);
		argv.msg.channel.send("Turning led on, master");
	}else{
		arduino.led(false);
		argv.msg.channel.send("Turning led off, master");
	}
};
