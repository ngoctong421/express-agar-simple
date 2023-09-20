const { io } = require('../servers');
const Orb = require('../classes/Orb');
const PlayerConfig = require('../classes/PlayerConfig');
const PlayerData = require('../classes/PlayerData');
const Player = require('../classes/Player');

const orbs = [];
const settings = {
  defaultNumberOfOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
  defaultGenericOrbSize: 5,
};
const players = [];
let tickTockInterval;

const initGame = () => {
  for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
    orbs.push(new Orb(settings));
  }
};

initGame();

io.on('connect', (socket) => {
  socket.on('init', (playerObj, ackCallback) => {
    if (players.length === 0) {
      tickTockInterval = setInterval(() => {
        io.to('game').emit('tick', players);
      }, 33);
    }

    socket.join('game');

    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerObj.playerName, settings);
    const player = new Player(socket.id, playerConfig, playerData);

    players.push(player);

    ackCallback(orbs);
  });

  socket.on('disconnect', () => {
    if (players.length === 0) {
      clearInterval(tickTockInterval);
    }
  });
});

module.exports = io;
