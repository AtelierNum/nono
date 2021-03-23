require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const yargs = require("yargs");
const fs = require("fs").promises;
const { join } = require("path");

//TODO right now, the system will try to use the arduino whethere it is ready or not, so this needs improvement
// if (process.env.HAS_ARDUINO.toLowerCase() === "true") {
//   const arduino = require("./arduino");
// }

yargs.scriptName("").help().wrap(60);

//TODO this needs simplification, but it works
//yeah, I know it's the receipe for it to stay like this forever
//<Kernighan's_Law>
const isJSFile = (str) => str.match(/.+\.js$/gi);
const isDirectory = (str) => !str.match(/.*\..*/gi);
const relativeJoin = (paths) => "./" + join(...paths); //path.join() doesn't keep "./" prefix but we need it
const filenameOf = (str) =>
	str.match(/^.+\./gi).shift().split("").slice(0, -1).join("");

const buildCommands = async (path, node) => {
	const files = await fs.readdir(path);

	files.forEach((file) => {
		const fRelPath = relativeJoin([path, file]);
		if (isJSFile(file)) {
			let newCMD = require(fRelPath);

			newCMD.command =
				newCMD.command && newCMD.command.trim() !== ""
					? filenameOf(file) + " " + newCMD.command
					: filenameOf(file);

			newCMD.type = "cmd";
			node.commands.push(newCMD);
		} else if (isDirectory(file)) {
			let newDir = {
				name: file,
				type: "dir",
				commands: [],
			};

			node.commands.push(newDir);

			buildCommands(fRelPath, newDir);
		}
	});
};

const appendCmdNode = (commands, yargs) => {
	commands.forEach((cmd) => {
		switch (cmd.type) {
			case "cmd":
				yargs.command(cmd);
				break;
			case "dir":
				yargs.command({
					command: cmd.name + " <subcommand>",
					desc: "commands relative to " + cmd.name,
					builder: (yargs) => {
						appendCmdNode(cmd.commands, yargs);
						return yargs;
					},
				});
				break;
			default:
				throw "invalid node type in command tree";
		}
	});
};

let commandTree = {
	name: "",
	commands: [],
};

buildCommands("./commands", commandTree).then(() => {
	appendCmdNode(commandTree.commands, yargs);
});
//</Kernighan's_Law>

client.on("ready", () => {
	client.on("message", (msg) => {
		if (
			msg.author == client.user ||
			msg.channel.name != process.env.INPUT_CHANNEL
		) {
			return;
		}

		yargs.parse(msg.content, { msg: msg }, (err, argv, output) => {
			if (output) msg.channel.send("```" + output + "```");
		});
	});
});

client.login(process.env.DISCORD_BOT_TOKEN);
