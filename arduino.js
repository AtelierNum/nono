const five = require("johnny-five");
const board = new five.Board();

module.exports = {
	
	tone: (play, pinTone = 8) => {
		const piezo = new five.Piezo(pinTone);
		if (play) {
			piezo.play({
				// song is composed by a string of notes
				// a default beat is set, and the default octave is used
				// any invalid note is read as "no note"
				song: "C D F D A - A A A A G G G G - - C D F D G - G G G G F F F F - -",
				beats: 1 / 4,
				tempo: 100
			})
		}
	},

	led: (on, pinLED = 13) => {
		const led = new five.Led(pinLED);
		on ? led.on() : led.off();
	}




}




