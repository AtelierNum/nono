const arduino = require("./index");

exports.command = "<state>";

exports.describe = "change the LED state";

exports.builder = {
  state: {
    default: false,
  },
};

exports.handler = async function (argv) {
  if (argv.state == 'state'){
    console.log(`Sur une échelle de 1 à 12, de 1 à 4 la led est éteinte. 
    De 4 à 7 elle est allumée. C'est seulement de 8 à 9 qu'elle est psychologiquement en train de s'allumer. 
    Mais de 9 à 11, elle est plutôt en train de s'éteindre ! Et ce n'est qu'à 12 qu'elle est ni éteinte ni allumée !`)
  } else {
    
    const led = new arduino.five.Led(13);
    argv.state == 'on' ? led.on() : led.off();
  }
};
