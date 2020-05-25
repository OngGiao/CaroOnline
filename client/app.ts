import "phaser";
import { GameScene } from "./scenes/gameScene";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    backgroundColor: '#efefef',
    scene: [GameScene],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
    // },
    // plugins: {
    //     scene: [{
    //         key: 'rexUI',
    //         plugin: UIPlugin,
    //         mapping: 'rexUI'
    //     }
    //     ]
    // }
};

export class CaroOnlineGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.onload = () => {
    var game = new CaroOnlineGame(config);
};