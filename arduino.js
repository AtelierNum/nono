const five = require("johnny-five");
const board = new five.Board();

module.exports = {
		led: (on, pin = 13) => {
			const led = new five.Led(pin);
			on ? led.on() : led.off();
		},
	};

