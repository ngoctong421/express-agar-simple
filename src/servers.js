const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static(`${__dirname}/../public`));

const server = app.listen(9000, () => {
  console.log('http://localhost:9000');
});

const io = socketio(server);

module.exports = {
  app,
  io,
};
