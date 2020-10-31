exports.command = "<first_word> [the_rest..]";

exports.describe =
  "make me reapeat something. Sometimes you just need a friend.";

exports.handler = (argv) => {
  console.log(argv);
  if (Math.random() <= 0.005) {
    argv.msg.channel.send("No.");
  } else {
    argv.msg.channel.send(argv.first_word.concat(" ", argv.the_rest.join(" ")));
  }
};
