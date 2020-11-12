exports.command = "<first_word> [the_rest..]";

exports.describe =
  "make me reapeat something. Sometimes you just need a friend.";

exports.builder = {
  iterations: {
      default: 1,
      describe: "how many times the call will be repeated",
      alias: 'i',
      type: "number"
  }
}

const wait = 1000;

const spam = (argv, msg) => {
  return setInterval(() => {
    return argv.msg.channel.send(msg);
  }, wait)
}

const stopSpam = (id, i) => {
  setTimeout(() => clearInterval(id), (i * wait) + 100 )
}

exports.handler = (argv) => {
  console.log(argv);
  if (Math.random() <= 0.005) {
    argv.msg.channel.send("No.");
  } else {
    let sentence = argv.first_word.concat(" ", argv.the_rest.join(" "));
    argv.msg.channel.send(sentence);
    
    if (argv.i > 1){
      let idInterval = spam(argv, sentence);
      stopSpam(idInterval, argv.i - 1)
    }
  }
};
