import { CST } from "../CST";
import { MenuScene } from "./MenuScene";
export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LOAD
        })
    }
    init(){

    }
    preload(){
        // change screen resolution to: 800x600

        //load image, spritesheet, sound
    
        this.load.image("title_bg", "./assets/title_bg.jpg");

        this.load.image("options_button", "./assets/options_button.png");

        this.load.image("play_button", "./assets/play_button.png");

        this.load.image("logo", "./assets/logo.png");

        this.load.spritesheet("cat", "./assets/cat.png", {
            frameHeight: 32,
            frameWidth: 32
        });

        this.load.audio("title_music", "./assets/shuinvy-childhood.mp3");

        //create loading bar

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        })

        /*
        Loader Events:
            complete - when done loading everything
            progress - loader number progress in decimal
        */

        //simulate large load
        /*
        for(let i = 0; i < 100; i++){
            this.load.spritesheet("cat" + i, "./assets/cat.png", {
                frameHeight: 32,
                frameWidth: 32
            });        
        }*/

        this.load.on("progress", (percent)=>{
            loadingBar.fillRect(this.game.renderer.width / 2, 0, 50, this.game.renderer.height * percent);
            console.log(percent);
        })
    
        this.load.on("complete", ()=>{
            //this.scene.start(CST.SCENES.MENU, "hello from LoadScene");
        })

    }
    create(){

        this.scene.start(CST.SCENES.MENU, "hello from LoadScene");
    }
}