const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');

const PORT = 3000;

const app = express();

app.use(
  cors({
    origin: ['https://admin.socket.io'],
    credentials: true,
  })
);

app.use(express.static(`${__dirname}/../public`));

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
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
