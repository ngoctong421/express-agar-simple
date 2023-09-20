const socket = io.connect('http://localhost:9000');

const init = async () => {
  const initOrbs = await socket.emitWithAck('init', {
    playerName: player.name,
  });

  setInterval(() => {
    socket.emit('tock', {
      xVector: player.xVector,
      yVector: player.yVector,
    });
  }, 33);

  orbs = initOrbs;

  draw();
};

socket.on('tick', (playersArr) => {
  players = playersArr;
});
