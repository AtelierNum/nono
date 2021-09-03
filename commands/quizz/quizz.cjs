const fs = require("fs").promises;
const path = require("path");
const levenshteinEditDistance = require("fast-levenshtein");

const questionFilePath = path.resolve(__dirname, "..", "..", "data", "quizz_questions.json");
const leaderboardFilePath = path.resolve(__dirname, "..", "..", "data", "quizz_leaderboard.json");

const minPlayerCount = 2;

let participants = {};
let tries = {};
let questions = null;
let currentQuestion = {};
let isActive = false;
let isOpen = false;
let gameAdmin = "";
let onQuestionChangeCb = () => {};
let onDoneCb = () => {};

let ft;

const changeQuestion = () => {
	const randIndex = Math.floor(Math.random() * questions.length);
	currentQuestion = questions[randIndex];
	tries = {};
	onQuestionChangeCb(currentQuestion);
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

module.exports = {
	start: async (firstTo, author) => {
		if (Object.keys(participants).length < minPlayerCount) {
			throw "not enough players, we need atleast " + minPlayerCount;
		}

		if (author.id != gameAdmin.id) {
			throw "only the admin of the lobby can start";
		}

		ft = firstTo;

		if (questions == null) {
			const questionFile = await fs.readFile(questionFilePath, "utf-8");
			questions = JSON.parse(questionFile).questions;
		}

		changeQuestion();
		isOpen = false;
		isActive = true;
	},

	stop: () => {
		isActive = false;
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
		return isActive;
	},

	open: gAdmin => {
		isOpen = true;
		gameAdmin = gAdmin;
	},

	isOpen: () => {
		return isOpen;
	},

	getGameAdmin: () => {
		return gameAdmin;
	},

	onQuestionChange: callback => {
		onQuestionChangeCb = callback;
	},

	evalAnswer: (answer, authorName) => {
		const isCorrect = evalAnswer(answer, currentQuestion);
		if (!isCorrect) {
			tries[authorName] = true;
			if (Object.keys(tries).length >= Object.keys(participants).length) {
				changeQuestion();
			}
		} else {
			participants[authorName] += 1;

			if (participants[authorName] >= ft) {
				onDoneCb(authorName);

				fs.readFile(leaderboardFilePath, "utf-8").then(leaderboardStr => {
					let leaderboard = JSON.parse(leaderboardStr).leaderboard;
					if (!leaderboard[authorName]) {
						leaderboard[authorName] = ft;
					} else {
						leaderboard[authorName] += ft;
					}
					fs.writeFile(leaderboardFilePath, JSON.stringify({ leaderboard }));
				});
			} else {
				changeQuestion();
			}
		}
		return isCorrect;
	},

	onDone: callback => {
		onDoneCb = callback;
	},
};
