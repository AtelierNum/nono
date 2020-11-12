const five = require("johnny-five");
const board = new five.Board();

const ready = async () => await board.on("ready", (e) => {
    console.log('ready ', e)
});

board.on("fail", (e) => {
    console.log('fail ', e )
})

module.exports = {five, board, ready};