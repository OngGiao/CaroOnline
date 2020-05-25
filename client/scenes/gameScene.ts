import "phaser";

var boxY = 20;
var boxX = 20;
var box = 30;

export class GameScene extends Phaser.Scene {
    private board: integer[][];
    constructor() {
        super({
            key: "GameScene"
        });
    }
    init(): void {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?param=hi';
        window.history.pushState({path:newurl},'',newurl);
    }
    preload(): void {
        this.load.image('xCaro', '/assets/xCaro.png');
        this.load.image('oCaro', '/assets/oCaro.png');
    }
    // testMessageBox() {
    //     //call this line of code when you want to show the message box
    //     //message, width and height
    //     this.showMessageBox("HELLO THERE! Put Some Text Here!", game.width * .7, game.height * .5);
    // }
    create(): void {
        // var dialog = (<any>this).rexUI.add.dialog({
        
        //     // Space
        //     space: {
        //         left: 0,
        //         right: 0,
        //         top: 0,
        //         bottom: 0,
        
        //         title: 0,
        //         titleLeft: 0,
        //         titleRight: 0,
        //         content: 0,
        //         contentLeft: 0,
        //         contentRight: 0,
        //         description: 0,
        //         descriptionLeft: 0,
        //         descriptionRight: 0,
        //         choices: 0,
        //         choicesLeft: 0,
        //         choicesRight: 0,
        //         actionsLeft: 0,
        //         actionsRight: 0,
        
        //         toolbarItem: 0,
        //         leftToolbarItem: 0,
        //         choice: 0,
        //         action: 0,
        //     },
        
        //     expand: {
        //         title: true,
        //         content: true,
        //         description: true,
        //         choices: true,
        //         actions: false,
        //     },
        
        //     align: {
        //         title: 'center',
        //         content: 'center',
        //         description: 'center',
        //         choices: 'center',
        //         actions: 'center',
        //     },
        
        //     click: {
        //         mode: 'pointerup',
        //         clickInterval: 100
        //     }
        
        //     // name: '',
        //     // draggable: false
        // });
        // debugger;
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
    private i = 1;
    cellClick(pointer): void {
        var xCell = Math.floor(pointer.downX / box);
        var yCell = Math.floor(pointer.downY / box);
        console.log(xCell + "," + yCell)

        if (this.board[xCell][yCell] != 0) {
            return;
        }

        var value = 1;
        var img = 'xCaro';
        if (this.i % 2 == 0) {
            img = 'oCaro';
            value = -1;
        }
        this.board[xCell][yCell] = value;
        var caro = this.add.image(xCell * box, yCell * box, img).setOrigin(0, 0);
        caro.displayHeight = box;
        caro.displayWidth = box;
        this.i++;
        if (this.checkWin(value, this.board, this.winPatterns)) {
            alert("Win");
        }
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
