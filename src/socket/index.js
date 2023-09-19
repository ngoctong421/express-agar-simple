const { io } = require('../servers');
const Orb = require('../classes/Orb');

const orbs = [];

const initGame = () => {
  for (let i = 0; i < 500; i++) {
    orbs.push(new Orb());
  }
};

initGame();

io.on('connect', (socket) => {
  socket.emit('init', { orbs });
});

module.exports = io;
