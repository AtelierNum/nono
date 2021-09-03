const quizz = require("./quizz.cjs");

exports.describe = "create a quizz lobby";

exports.handler = ({ msg }) => {
	if (quizz.isActive()) {
		return;
	}

	if (!quizz.isOpen()) {
		quizz.open(msg.author);
		msg.channel.send(
			"The game is about to start, use `quizz join` to join. The questions will start once " +
				msg.author +
				" use `quizz start`. " +
				msg.author +
				" can also end the quizz via `quizz stop`"
		);
		quizz.addPlayer(msg.author.username);
	}
};
