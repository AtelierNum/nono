const quizz = require("./quizz.cjs");

exports.describe = "leave a running quizz";

exports.handler = ({ msg }) => {
	quizz.removePlayer(msg.author);
	msg.react("✅");
};
