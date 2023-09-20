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
  let player = {};

  socket.on('init', (playerObj, ackCallback) => {
    if (players.length === 0) {
      tickTockInterval = setInterval(() => {
        io.to('game').emit('tick', players);
      }, 33);
    }

    socket.join('game');

    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerObj.playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);

    players.push(player);

    ackCallback(orbs);
  });

  socket.on('tock', (data) => {
    speed = player.playerConfig.speed;
    const xV = (player.playerConfig.xVector = data.xVector);
    const yV = (player.playerConfig.yVector = data.yVector);

    if (
      (player.playerConfig.locX < 5 && xV < 0) ||
      (player.playerConfig.locX > 500 && xV > 0)
    ) {
      player.locY -= speed * yV;
    } else if (
      (player.playerConfig.locY < 5 && yV > 0) ||
      (player.playerConfig.locY > 500 && yV < 0)
    ) {
      player.locX += speed * xV;
    } else {
      player.playerConfig.locX += speed * xV;
      player.playerConfig.locY -= speed * yV;
    }
  });

  socket.on('disconnect', () => {
    if (players.length === 0) {
      clearInterval(tickTockInterval);
    }
  });
});

module.exports = io;
