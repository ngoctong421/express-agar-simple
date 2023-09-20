const { io } = require('../servers');
const Orb = require('../classes/Orb');
const PlayerConfig = require('../classes/PlayerConfig');
const PlayerData = require('../classes/PlayerData');
const Player = require('../classes/Player');
const {
  checkForOrbCollisions,
  checkForPlayerCollisions,
} = require('./checkCollisions');

const orbs = [];
const settings = {
  defaultNumberOfOrbs: 5000,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000,
  defaultGenericOrbSize: 5,
};
const players = [];
const playerForUsers = [];
let tickTockInterval;

const initGame = () => {
  for (let i = 0; i < settings.defaultNumberOfOrbs; i++) {
    orbs.push(new Orb(settings));
  }
};

const getLeaderBoard = () => {
  const leaderBoardArray = players.map((curPlayer) => {
    if (curPlayer.playerData) {
      return {
        name: curPlayer.playerData.name,
        score: curPlayer.playerData.score,
      };
    } else {
      return {};
    }
  });

  return leaderBoardArray;
};

initGame();

io.on('connect', (socket) => {
  let player = {};

  socket.on('init', (playerObj, ackCallback) => {
    if (players.length === 0) {
      tickTockInterval = setInterval(() => {
        io.to('game').emit('tick', playerForUsers);
      }, 33);
    }

    socket.join('game');

    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(playerObj.playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);

    players.push(player);
    playerForUsers.push({ playerData });

    ackCallback({ orbs, indexInPlayers: playerForUsers.length - 1 });
  });

  socket.on('tock', (data) => {
    if (!player.playerConfig) {
      return;
    }

    speed = player.playerConfig.speed;
    const xV = (player.playerConfig.xVector = data.xVector);
    const yV = (player.playerConfig.yVector = data.yVector);

    if (
      (player.playerData.locX > 5 && xV < 0) ||
      (player.playerData.locX < settings.worldWidth && xV > 0)
    ) {
      player.playerData.locX += speed * xV;
    }

    if (
      (player.playerData.locY > 5 && yV > 0) ||
      (player.playerData.locY < settings.worldHeight && yV < 0)
    ) {
      player.playerData.locY -= speed * yV;
    }

    const capturedOrbI = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );

    if (capturedOrbI !== null) {
      orbs.splice(capturedOrbI, 1, new Orb(settings));

      const orbData = {
        capturedOrbI,
        newOrb: orbs[capturedOrbI],
      };

      io.to('game').emit('orbSwitch', orbData);
      io.to('game').emit('updateLeaderBoard', getLeaderBoard());
    }

    const absorbData = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      playerForUsers,
      socket.id
    );

    if (absorbData) {
      io.to('game').emit('playerAbsorbed', absorbData);
      io.to('game').emit('updateLeaderBoard', getLeaderBoard());
    }
  });

  socket.on('disconnect', () => {
    for (let i = 0; i < players.length; i++) {
      if ((players[i].socketId = player.socketId)) {
        players.splice(i, 1, {});
        playerForUsers.splice(i, 1, {});
        break;
      }
    }

    if (players.length === 0) {
      clearInterval(tickTockInterval);
    }
  });
});

module.exports = io;
