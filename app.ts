import express = require('express');
import { Macao } from "macao";
const app: express.Application = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const generateActions = (state) => {
  const result = []
  state.board.forEach((rowArray, row) => {
    rowArray.forEach((value, column) => {
      if (value === 0) result.push({ row, column })
    })
  })
  return result
}

const applyAction = (state, action) => {
  const jSONBoard = JSON.stringify(state.board)
  const newBoard = JSON.parse(jSONBoard)
  console.log(`MACAO >>> ${action}`);
  newBoard[action.x][action.y] = state.player * -1
  const newState = {
    board: newBoard,
    player: state.player * -1
  }
  return newState
}


const stateIsTerminal = (state) => {
  if (checkWin(1, state.board, winPatterns) || checkWin(-1, state.board, winPatterns)) {
    return true;
  }

  return false
}

const calculateReward = (state, player) => {
  if (checkWin(player, state.board, winPatterns) && player == 1) {
    return 1;
  }
  if (checkWin(player, state.board, winPatterns) && player == -1) {
    return -1;
  }

  return 0
}


const funcs = {
  generateActions,
  applyAction,
  stateIsTerminal,
  calculateReward
};

const config = {
  duration: 30
};

const macao = new Macao(funcs, config);

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

    // if (checkWin(value, board, winPatterns)) {
    //   io.in(socket.roomId).emit('caroWin', data);
    // }

    var state = {
      board: data.board,
      player: -1
    };
    var endGame = funcs.stateIsTerminal(state)
    //console.log(`MACAO >>> ${aa}`);
    if (!endGame) {
     var action = macao.getAction(state);
      console.log(`MACAO >>> ${action}`);
    }
    data.currentValue = value * -1;
    io.in(socket.roomId).emit('caroValue', data);
  });

  socket.on('caroRestart', () => {
    var data = {
      board: [],
      currentValue: 1
    };
    for (let x = 0; x < 20; x++) {
      data.board[x] = [];
      for (let y = 0; y < 20; y++) {
        data.board[x][y] = 0;
      }
    }

    io.in(socket.roomId).emit('caroRestart', data);
  });

});



function checkWinPatterns(x, y, value, board, winPatterns) {
  ////x->col
  ////y->row
  var result = false;
  for (let i = 0; i < winPatterns.length; i++) {
    let pattern = winPatterns[i];
    let count = 0;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (board[x + col][y + row] == value && pattern[col][row] == 1) count++;
      }
    }

    if (count == 5) {
      result = true;
      break;
    }
  }

  return result;
}

function checkWin(value, board, winPatterns) {
  for (let yCol = 0; yCol < 20 - 5 - 1; yCol++) {
    for (let xRow = 0; xRow < 20 - 5 - 1; xRow++) {
      let check = checkWinPatterns(xRow, yCol, value, board, winPatterns);
      if (check) {
        return true;
      }
    }
  }

  return false;
}

var winPatterns = [
  [[1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1]],

  [[0, 0, 0, 0, 1],
  [0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0],
  [1, 0, 0, 0, 0]],

  [[1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]],
  [[0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]],
  [[0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0]],
  [[0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0]],
  [[0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1]],

  [[1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0]],
  [[0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0]],
  [[0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0]],
  [[0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0]],
  [[0, 0, 0, 0, 1],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 0, 1]]
];