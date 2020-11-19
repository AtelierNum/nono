require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const yargs = require("yargs");
const fs = require("fs");
const { join } = require("path");

//TODO right now, the system will try to use the arduino whethere it is ready or not, so this needs improvement
// if (process.env.HAS_ARDUINO.toLowerCase() === "true") {
//   const arduino = require("./arduino");
// }

yargs.scriptName("");

//<Kernighan's_Law>
const isJSFile = (str) => str.match(/.+\.js$/gi);
const isDirectory = (str) => !str.match(/.*\..*/gi);
const fsPathToCmdPath = (str) => str.split("/").slice(2).join(" ");
const relativeJoin = (paths) => "./" + join(...paths); //path.join() doesn't keep "./" prefix but we need it
const filenameOf = (str) =>
  str.match(/^.+\./gi).shift().split("").slice(0, -1).join("");

const mountCmdFolder = (path) => {
  fs.readdir(path, (err, files) => {
    if (err) throw err;

    files.forEach((f) => {
      const fRelPath = relativeJoin([path, f]);

      if (isJSFile(f)) {
        const cmdPath = fsPathToCmdPath(path);

				let newCMD = require(fRelPath);
				
				newCMD.command = (newCMD.command && newCMD.command.trim() !== "") ? 
					filenameOf(f) + " " + newCMD.command 
					: filenameOf(f);
        if (cmdPath.trim() !== "")
          newCMD.command = cmdPath + " " + newCMD.command;
        yargs.command(newCMD);
      } else if (isDirectory(f)) mountCmdFolder(fRelPath);
    });
  });
};

mountCmdFolder("./commands");
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
