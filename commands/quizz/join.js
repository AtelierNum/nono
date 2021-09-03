const quizz = require("./quizz.cjs");

exports.describe = "join a starting game";

exports.handler = ({ msg }) => {
	if (quizz.isOpen()) {
		if (quizz.addPlayer(msg.author.username)) {
			msg.react("✅");
		}
	}
};
