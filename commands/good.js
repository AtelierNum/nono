exports.handler = ({msg}) => {
    if(msg.content.includes("good bot")){
        msg.react("❤️");
    }
}