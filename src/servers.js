const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');

const app = express();

app.use(
  cors({
    origin: ['https://admin.socket.io'],
    credentials: true,
  })
);

app.use(express.static(`${__dirname}/../public`));

const server = app.listen(9000, () => {
  console.log('http://localhost:9000');
});

const io = socketio(server);

instrument(io, {
  auth: false,
  mode: 'development',
});

module.exports = {
  app,
  io,
};
