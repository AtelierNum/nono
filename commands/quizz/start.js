const quizz = require("./quizz.cjs");

exports.describe = "starts the quizz";

exports.builder = yargs => {
	yargs.options({
		ft: {
			alias: "first-to",
			describe: "the number of good answers needed to win.",
			type: "number",
			default: 5,
		},
	});
};

exports.handler = ({ msg, ft }) => {
	if (quizz.isActive()) {
		msg.channel.send("There is already a quizz playing.");
		return;
	}
	if (!quizz.isOpen()) {
		msg.channel.send("There is no lobby to start from. Try `quizz init`");
		return;
	}

	quizz
		.start(msg.channel, ft, msg.author)
		.then(() => {})
		.catch(e => {
			msg.channel.send(e);
		});
};
