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

    private xWin = 0;
    private oWin = 0;
    private xWinText;
    private oWinText;
    private pauseGame = false;
    private caroValues = [];
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
            /////3.0
            var caro = this.add.image(x * box, y * box + 50, img).setOrigin(0, 0);
            caro.displayHeight = box;
            caro.displayWidth = box;
            this.caroValues.push(caro);
        })

        this.socket.on('caroWin', (data) => {
            this.pauseGame = true;
            if (data.value == 1) {
                this.xWin = this.xWin + 1;
                alert("X win!");
            }
            else {
                this.oWin = this.oWin + 1;
                alert("O win!");
            }
        })

        this.socket.on('caroRestart', (data) => {
            this.pauseGame = false;
            this.currentValue = data.currentValue;
            this.board = data.board;
            for (let i = 0; i < this.caroValues.length; i++) {
                this.caroValues[i].destroy();
            }
            this.caroValues = [];
        })
    }
    preload(): void {
        this.load.image('xCaro', '/assets/xCaro.png');
        this.load.image('oCaro', '/assets/oCaro.png');
    }

    create(): void {
        /////3.0
        var grid = this.add.grid(0, 50, boxX * box, boxY * box, box, box, 0xd1d1c9).setOrigin(0, 0);
        grid.setInteractive().on('pointerdown', this.cellClick.bind(this));

        this.add.image(box, 10, 'xCaro').setOrigin(0, 0).setDisplaySize(box, box);
        this.xWinText = this.add.text(box + 30, 1, this.xWin.toString(), {
            font: "45px Arial",
            fill: "#000"
        });
        this.add.image(box * 4, 10, 'oCaro').setOrigin(0, 0).setDisplaySize(box, box);
        this.oWinText = this.add.text(box * 4 + 30, 1, this.oWin.toString(), {
            font: "45px Arial",
            fill: "#000"
        });

        this.board = [];
        for (let x = 0; x < boxX; x++) {
            this.board[x] = [];
            for (let y = 0; y < boxY; y++) {
                this.board[x][y] = 0;
            }
        }

        const restartButton = this.add.text(box * 10, 20, 'Chơi lại', { fill: '#0645AD' });
        restartButton.setInteractive({ cursor: 'pointer' });        
        restartButton.on('pointerdown', () => {
            this.socket.emit('caroRestart');
        });

    }
    update(): void {
        this.xWinText.text = this.xWin;
        this.oWinText.text = this.oWin;
    }
    //private i = 1;
    cellClick(pointer): void {
        if (this.pauseGame) {
            return;
        }

        var xCell = Math.floor(pointer.downX / box);
        /////3.0
        var yCell = Math.floor((pointer.downY - 50) / box);

        //if (this.currentValue == this.yourValue) {
            this.socket.emit('caroValue', { board: this.board, x: xCell, y: yCell, value: this.yourValue });
        //}
    }
};
