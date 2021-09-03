const quizz = require("./quizz.cjs");
const nono = require("../../nono");

let passiveListener = null;
const nonoAttentionSpan = 300000; // 300000 => 5min

let timer = null;

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
	if (Boolean(passiveListener)) {
		msg.channel.send("There is already a quizz playing.");
		return;
	}
	if (!quizz.isOpen()) {
		msg.channel.send("There is no lobby to start from. Try `quizz init`");
		return;
	}

	quizz.onQuestionChange(q => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			msg.send("alright, looks like everyone left, the quizz is canceled");
			nono.freePassiveListener(passiveListener);
			quizz.stop();
		}, nonoAttentionSpan);

		let questionLabel = q.question;

		if (q.type === "choice") {
			questionLabel = `${q.question} \n`;
			q.choices.forEach((c, i) => {
				questionLabel += `${i + 1}:	${c} \n`;
			});
		}

		msg.channel.send(questionLabel);
	});

	quizz.onDone(winner => {
		//https://knowyourmeme.com/memes/a-winner-is-you
		msg.channel.send("a winner is " + winner + "!");
		nono.freePassiveListener(passiveListener);
		quizz.stop();
		clearTimeout(timer);
	});

	quizz
		.start(ft, msg.author)
		.then(() => {
			passiveListener = nono.registerPassiveListener(ctx => {
				if (ctx.msg.content.includes("quizz")) {
					return;
				}

				if (quizz.evalAnswer(ctx.msg.content, ctx.msg.author.username)) {
					ctx.msg.react("✅");
				} else {
					ctx.msg.react("❌");
				}
			});
		})
		.catch(e => {
			msg.channel.send(e);
		});
};
