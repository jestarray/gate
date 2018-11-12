import { CST } from "../CST";

export class PlayScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.PLAY,
        });
    }
    preload() {
        this.anims.create({
            key: "dazzle",
            frameRate: 10,
            //@ts-ignore
            frames: this.anims.generateFrameNames("daze", {
                prefix: "daze0",
                suffix: ".png",
                start: 0,
                end: 41,
            }),
            repeat: -1,
        });
        this.textures.addSpriteSheetFromAtlas("hooded", { frameHeight: 64, frameWidth: 64, atlas: "characters", frame: "hooded" });
        this.textures.addSpriteSheetFromAtlas("mandy", { frameHeight: 64, frameWidth: 64, atlas: "characters", frame: "mandy" });

        console.log(this.textures.list);

        this.anims.create({
            key: "right",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("hooded", {
                frames: [143, 144, 145, 146, 147, 148, 149, 150, 151]
            })
        });

        this.anims.create({
            key: "left",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 9,
                end: 17
            })
        });
    }
    create() {
        let pimple: Phaser.GameObjects.Sprite = this.add.sprite(100, 100, "daze", "daze015.png");
        pimple.play("dazzle");

        let anna: Phaser.GameObjects.Sprite = this.add.sprite(400, 400, "anna").setScale(2);
        let hooded: Phaser.GameObjects.Sprite = this.add.sprite(200, 200, "hooded").setScale(2).play("right");
        window.hooded = hooded;
        window.anna = anna;
        window.pimple = pimple;

        /* 
      gameobject events:
          animationstart
          animationrepeat
          animationupdate
          animationcomplete
     */
        /*
            pimple.on("animationupdate", ()=> {
                console.log("ahhhhh")
            });
    
            pimple.on("animationrepeat", ()=> {
                console.log("LEVELUP")
            });
            */
    }
}