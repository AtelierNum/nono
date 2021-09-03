const fs = require("fs").promises;
const path = require("path");
const nono = require("../../nono");
const levenshteinEditDistance = require("fast-levenshtein");

const questionFilePath = path.resolve(__dirname, "..", "..", "data", "quizz_questions.json");
const leaderboardFilePath = path.resolve(__dirname, "..", "..", "data", "quizz_leaderboard.json");

let passiveListener = null;
let participants = {};
let tries = {};
let questions = null;
let currentQuestion = {};
let isOpen = false;
let gameAdmin = "";

let timeout = null;
const timeBeforeQuit = 300000; // 300000 => 5min
let ft;

const getRandomQuestion = questions => {
	const randIndex = Math.floor(Math.random() * questions.length);
	return questions[randIndex];
};

const askQuestion = (question, channel) => {
	channel.send(question.question);
	if (question.type === "choice") {
		let choices = ``;
		question.choices.forEach((c, i) => {
			choices += `${i + 1}:	${c} \n`;
		});
		channel.send(choices);
	}
};

const handleTimeout = (nono, quizzPassiveListener, channel) => {
	nono.freePassiveListener(quizzPassiveListener);
	channel.send("alright, looks like everyone left, the quizz is canceled.");
};

const evalAnswer = (answer, question) => {
	const goodAnswer = question.answer;
	switch (question.type) {
		case "choice":
			return goodAnswer == answer;
		case "string":
			return (
				levenshteinEditDistance.get(answer.toLowerCase(), goodAnswer.toLowerCase()) <=
				goodAnswer.length * 0.25
			);
		case "number":
			return (
				answer > goodAnswer - goodAnswer * 0.001 && answer < goodAnswer + goodAnswer * 0.001
			);
	}
};

const routine = ctx => {
	clearTimeout(timeout);
	timeout = setTimeout(
		() => handleTimeout(nono, quizzPassiveListener, ctx.msg.channel),
		timeBeforeQuit
	);
	const message = ctx.msg;

	if (tries[message.author]) {
		return;
	}

	if (!evalAnswer(message.content, currentQuestion)) {
		message.react("❌");
		tries[message.author] = true;
		console.log(Object.keys(tries).length, Object.keys(tries).length);
		if (Object.keys(tries).length >= Object.keys(participants).length) {
			message.channel.send("Y'all are wrong, next one:");
			currentQuestion = getRandomQuestion(questions);
			askQuestion(currentQuestion, message.channel);
			tries = {};
		}
	} else {
		message.react("✅");
		const authorName = message.author.username;

		participants[authorName] += 1;

		if (participants[authorName] >= ft) {
			//https://knowyourmeme.com/memes/a-winner-is-you
			ctx.msg.channel.send("a winner is " + authorName + "!");

			fs.readFile(leaderboardFilePath, "utf-8").then(leaderboardStr => {
				let leaderboard = JSON.parse(leaderboardStr).leaderboard;
				if (!leaderboard[authorName]) {
					leaderboard[authorName] = ft;
				} else {
					leaderboard[authorName] += ft;
				}
				fs.writeFile(leaderboardFilePath, JSON.stringify({ leaderboard }));
			});

			nono.freePassiveListener(quizzPassiveListener);
		} else {
			currentQuestion = getRandomQuestion(questions);
			askQuestion(currentQuestion, message.channel);
		}
	}
};

module.exports = {
	start: async (channel, firstTo, author) => {
		if (Object.keys(participants).length < 2) {
			throw "not enough players";
		}

		if (author.id != gameAdmin.id) {
			throw "only the admin of the lobby can start";
		}

		ft = firstTo;

		if (questions == null) {
			const questionFile = await fs.readFile(questionFilePath, "utf-8");
			questions = JSON.parse(questionFile).questions;
		}

		currentQuestion = getRandomQuestion(questions);
		askQuestion(currentQuestion, channel);
		clearTimeout(timeout);
		timeout = setTimeout(() => handleTimeout(nono, passiveListener, msg.channel), timeBeforeQuit);
		passiveListener = nono.registerPassiveListener(routine);
		isOpen = false;
	},

	stop: () => {
		if (passiveListener) {
			nono.freePassiveListener(passiveListener);
		}
	},

	getScore: () => {
		return JSON.stringify(participants);
	},

	getLeaderboard: async () => {
		//In case you really need to know, yes, I am compensating --Zhakk'Harn
		//prettier-ignore
		return Object.entries(JSON.parse(await fs.readFile(leaderboardFilePath,"utf-8")).leaderboard).sort((a,b) => b[1] - a[1]).map(e => e.join(" : ")).join("\n");
	},

	addPlayer: username => {
		if (typeof participants[username] !== "undefined") {
			return false;
		}

		participants[username] = 0;
		return true;
	},

	removePlayer: username => {
		if (participants[username]) {
			delete participants[username];

			if (Object.keys(participants).length < 2) {
				this.stop();
			}

			return true;
		}
		return false;
	},

	isActive: () => {
		return Boolean(passiveListener);
	},

	open: gAdmin => {
		isOpen = true;
		gameAdmin = gAdmin;
		timeout = setTimeout(() => {
			isOpen = false;
			participants = {};
		}, timeBeforeQuit);
	},

	isOpen: () => {
		return isOpen;
	},

	getGameAdmin: () => {
		return gameAdmin;
	},
};
