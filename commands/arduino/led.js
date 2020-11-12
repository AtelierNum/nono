const five = require("johnny-five");
const board = new five.Board();

exports.command = "<state>";

exports.describe = "change the LED state";

exports.builder = {
  state: {
    default: false,
  },
};

exports.handler = function (argv) {
  switch (argv.state) {
    case 'state':
      let sentence = exports.builder.state.default ? "La led est allumée." : "La led est éteinte.";
      argv.msg.channel.send(sentence);
      break;
    case 'on':
      exports.builder.state.default = !exports.builder.state.default;
      argv.msg.channel.send("Et ainsi la lumière éclaira le monde des hommes.");
      return {
        led: (on) => {
          const led = new five.Led(13);
          on ? led.on() : led.off();
        },
      };
      break;
    case 'off':
      exports.builder.state.default = !exports.builder.state.default;
      argv.msg.channel.send("Ainsi revinrent les longues nuits.");
      break;
  }
      console.log(exports.builder)
};
