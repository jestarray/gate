/** @type {import("../typings/phaser")} */

import { LoadScene } from "./scenes/LoadScene";
import { MenuScene } from "./scenes/MenuScene";
import { PlayScene } from "./scenes/PlayScene";
let game = new Phaser.Game({
    width: 800,
    height: 600,
    scene: [
        LoadScene, MenuScene, PlayScene
    ],
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    }
});
