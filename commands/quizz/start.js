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
	if (quizz.passiveListener) {
		msg.channel.send("There is already a quizz playing.");
	}

	quizz.start(msg.channel, ft);
};
