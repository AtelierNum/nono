const pm2 = require("pm2");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const ps = require("child_process");
const fs = require("fs");
const appRoot = require("app-root-path").toString();

exports.describe = "attempts to upgrade by pulling from the git repo";

exports.handler = async argv => {
	argv.msg.channel.send("attempting auto update");
	try {
		await git.pull({
			fs,
			http,
			dir: appRoot,
			ref: "main",
			singleBranch: true,
			author: {
				name: "nono",
			},
		});
		const yarnMsg = ps.execSync("yarn");
		if(!yarnMsg.toLowerCase().includes("success")){
			throw yarnMsg;
		}
		
		argv.msg.channel.send("pull complete, restarting...");
		await pm2.connect();
		pm2.restart("nono");
	} catch (err) {
		argv.msg.channel.send("```" + err.toString() + "```");
	}
};
