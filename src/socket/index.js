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

const initGame = () => {
  for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
    orbs.push(new Orb(settings));
  }
};

initGame();

io.on('connect', (socket) => {
  const playerConfig = new PlayerConfig(settings);
  const playerData = new PlayerData('Tom', settings);
  const player = new Player(socket.id, playerConfig, playerData);

  socket.emit('init', { orbs });
});

module.exports = io;
