const socket = io.connect('http://localhost:9000');

const init = async () => {
  const initData = await socket.emitWithAck('init', {
    playerName: player.name,
  });

  setInterval(async () => {
    socket.emit('tock', {
      xVector: player.xVector ? player.xVector : 0.1,
      yVector: player.yVector ? player.yVector : 0.1,
    });
  }, 33);

  orbs = initData.orbs;
  player.indexInPlayers = initData.indexInPlayers;

  draw();
};

socket.on('tick', (playersArr) => {
  players = playersArr;

  if (players[player.indexInPlayers].playerData) {
    player.locX = players[player.indexInPlayers].playerData.locX;
    player.locY = players[player.indexInPlayers].playerData.locY;
  }
});

socket.on('orbSwitch', (orbData) => {
  orbs.splice(orbData.capturedOrbI, 1, orbData.newOrb);
});

socket.on('playerAbsorbed', (absorbData) => {
  const gameMessage = document.querySelector('#game-message');

  gameMessage.innerHTML = `${absorbData.absorbed} was absorbed by ${absorbData.absorbedBy}`;
  gameMessage.style.opacity = 1;
  window.setTimeout(() => {
    gameMessage.style.opacity = 0;
  }, 2000);
});

socket.on('updateLeaderBoard', (leaderBoardArr) => {
  leaderBoardArr.sort((a, b) => b.score - a.score);

  const leaderBoard = document.querySelector('.leader-board');

  leaderBoard.innerHTML = '';

  leaderBoardArr.forEach((p) => {
    if (!p.name) {
      return;
    }

    leaderBoard.innerHTML += `
      <li class="leaderboard-player">${p.name} - ${p.score}</li>
    `;
  });
});
