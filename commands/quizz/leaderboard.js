const quizz = require("./quizz.cjs");

exports.describe = "gives the accumulated points";

exports.handler = async ({ msg }) => {
	msg.channel.send(await quizz.getLeaderboard());
};
