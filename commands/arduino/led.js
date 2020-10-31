exports.command = "<state>";

exports.describe = "change the LED state";

exports.builder = {
  state: {
    default: false,
  },
};

exports.handler = function (argv) {
  console.log("joour");
};
