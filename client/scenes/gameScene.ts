import "phaser";
var io = require('socket.io-client')

var boxY = 20;
var boxX = 20;
var box = 30;

export class GameScene extends Phaser.Scene {
    private board: integer[][];
    private socket = null;
    private yourValue = 0;
    private currentValue = 1;
    constructor() {
        super({
            key: "GameScene"
        });
    }
    init(): void {
        var urlParams = new URLSearchParams(window.location.search);
        var roomId = urlParams.get('roomId');

        if (roomId == null) {
            roomId = Phaser.Math.RND.uuid();
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?roomId=' + roomId;
            window.history.pushState({ path: newurl }, '', newurl);
        }

        this.socket = io(window.location.protocol + "//" + window.location.host, { query: `roomId=${roomId}` });

        this.socket.on('setValue', (data) => {
            this.yourValue = data.value;
            console.log(data);
        })

        this.socket.on('caroValue', (data) => {
            this.board = data.board;
            this.currentValue = data.currentValue;
            var x = data.x;
            var y = data.y;
            var value = data.value;
            var img = 'xCaro';
            if (value == -1) {
                img = 'oCaro';
            }
            var caro = this.add.image(x * box, y * box, img).setOrigin(0, 0);
            caro.displayHeight = box;
            caro.displayWidth = box;
        })
    }
    preload(): void {
        this.load.image('xCaro', '/assets/xCaro.png');
        this.load.image('oCaro', '/assets/oCaro.png');
    }

    create(): void {
        var grid = this.add.grid(0, 0, boxX * box, boxY * box, box, box, 0xd1d1c9).setOrigin(0, 0);
        grid.setInteractive().on('pointerdown', this.cellClick.bind(this));

        this.board = [];
        for (let x = 0; x < boxX; x++) {
            this.board[x] = [];
            for (let y = 0; y < boxY; y++) {
                this.board[x][y] = 0;
            }
        }
    }
    update(): void {

    }
    //private i = 1;
    cellClick(pointer): void {
        var xCell = Math.floor(pointer.downX / box);
        var yCell = Math.floor(pointer.downY / box);

        if (this.currentValue == this.yourValue) {
            this.socket.emit('caroValue', { board: this.board, x: xCell, y: yCell, value: this.yourValue });
        }






        // var value = 1;
        // var img = 'xCaro';
        // if (this.i % 2 == 0) {
        //     img = 'oCaro';
        //     value = -1;
        // }
        // this.board[xCell][yCell] = value;
        // var caro = this.add.image(xCell * box, yCell * box, img).setOrigin(0, 0);
        // caro.displayHeight = box;
        // caro.displayWidth = box;
        // this.i++;
        // if (this.checkWin(value, this.board, this.winPatterns)) {
        //     alert("Win");
        // }
    }



    checkWinPatterns(x, y, value, board, winPatterns) {
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

    checkWin(value, board, winPatterns) {
        for (let yCol = 0; yCol < boxY - 5 - 1; yCol++) {
            for (let xRow = 0; xRow < boxX - 5 - 1; xRow++) {
                let check = this.checkWinPatterns(xRow, yCol, value, board, winPatterns);
                if (check) {
                    return true;
                }
            }
        }

        return false;
    }

    private winPatterns = [
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
};
