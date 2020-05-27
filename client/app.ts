import "phaser";
import { GameScene } from "./scenes/gameScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 600,
    height: 650,    
    backgroundColor: '#efefef',
    scene: [GameScene],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    }    
};

export class CaroOnlineGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.onload = () => {
    var game = new CaroOnlineGame(config);
};