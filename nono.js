const pathResolve = require("path").resolve;
const fs = require("fs");

const UUIDfactory = {
	uuid: 0,
	getUUID: () => {
		this.uuid += 1;
		return this.uuid;
	},
};

const passiveListeners = {};
const admins = JSON.parse(fs.readFileSync(pathResolve(__dirname, "data", "admins.json"), "utf-8"))
	.admins;

module.exports = {
	getAdmins: () => {
		return admins;
	},

	registerPassiveListener: cb => {
		const newListenerID = UUIDfactory.getUUID;
		passiveListeners[newListenerID] = cb;
		return newListenerID;
	},

	freePassiveListener: id => {
		console.dir(`avant ${passiveListeners}`);
		delete passiveListeners[id];
		console.dir(`apres ${passiveListeners}`);
	},

	execPassiveListeners: params => {
		Object.values(passiveListeners).forEach(func => func(params));
	},
};
