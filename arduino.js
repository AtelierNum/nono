const five = require("johnny-five");
const board = new five.Board();

// module.exports = async () => {
//   await board.on("ready");
//     const led = new five.Led(13);
//     client.on("message", (msg) => {
//       if (msg.content === "led on") led.on();
//       else if (msg.content === "led off") led.off();
//     });
//   }

//   if (onReady && typeof onReady === "function") {
//     onReady();
//   }

//   return {
//     led: (on) => {
//       const led = new five.Led(13);
//       on ? led.on() : led.off();
//     },
//   };
// };

module.exports = async () => {
  await board.on("ready");

  return {
    led: (on) => {
      const led = new five.Led(13);
      on ? led.on() : led.off();
    },
  };
};
