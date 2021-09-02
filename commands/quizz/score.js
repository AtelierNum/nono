const quizz = require("./quizz.cjs");

exports.describe = "gives the scores for the current game";

exports.handler = ({ msg }) => {
	msg.channel.send(quizz.getScore());
};
