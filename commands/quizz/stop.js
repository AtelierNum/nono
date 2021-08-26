const quizz = require("./quizz.cjs");
const nono = require("../../nono");

exports.describe = "stops the quizz";

exports.handler = ({msg}) => {
    if (nono.getAdmins().includes(msg.author.id)) {
        msg.channel.send("that's all for today folks!");
        quizz.stop();
    }else{
        msg.channel.send("permission denied. Try sudo <command>")
    }
}