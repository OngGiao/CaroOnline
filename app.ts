import express = require('express');

const app: express.Application = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


io.on('connection', (socket) => {
  var roomId = socket.handshake.query.roomId;
  socket.roomId = roomId;
  socket.join(roomId);


  var room = io.sockets.adapter.rooms[roomId];
  var caroValue = 1;
  if (room.length > 1) {
    caroValue = -1;
  }
  console.log(room);
  socket.emit('setValue', { value: caroValue });

  socket.on('caroValue', (data) => {
    var board = data.board;
    var x = data.x;
    var y = data.y;
    var value = data.value;

    if (board[x][y] != 0) {
      return;
    }
    data.board[x][y] = value;
    data.currentValue = value * -1;
    io.in(socket.roomId).emit('caroValue', data);
  });

});