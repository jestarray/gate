import { CST } from "../CST";
import { CharacterSprite } from "../CharacterSprite";
import { Sprite } from "../Sprite";

export class PlayScene extends Phaser.Scene {
    anna!: Phaser.Physics.Arcade.Sprite;
    hooded!: Phaser.Physics.Arcade.Sprite;
    keyboard!: { [index: string]: Phaser.Input.Keyboard.Key };
    assassins!: Phaser.Physics.Arcade.Group;
    fireAttacks!: Phaser.Physics.Arcade.Group;
    player!: Phaser.GameObjects.Container;
    constructor() {
        super({
            key: CST.SCENES.PLAY,
        });
    }
    preload() {
        this.anims.create({
            key: "left",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 9,
                end: 17
            })
        });
        this.anims.create({
            key: "down",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 18,
                end: 26
            })
        });
        this.anims.create({
            key: "up",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 0,
                end: 8
            })
        });
        this.anims.create({
            key: "right",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("anna", {
                start: 27,
                end: 35
            })
        });

        this.anims.create({
            key: "blaze",
            duration: 50,
            frames: this.anims.generateFrameNames("daze", {
                prefix: "fire0",
                suffix: ".png",
                end: 55
            }),
            showOnStart: true,
            hideOnComplete: true
        });
        this.textures.addSpriteSheetFromAtlas("hooded", { frameHeight: 64, frameWidth: 64, atlas: "characters", frame: "hooded" })
        this.textures.addSpriteSheetFromAtlas("mandy", { frameHeight: 64, frameWidth: 64, atlas: "characters", frame: "mandy" });

        this.load.image("terrain", "./assets/image/terrain_atlas.png");
        this.load.image("items", "./assets/image/items.png");

        this.load.tilemapTiledJSON("mappy", "./assets/maps/mappy.json");


        this.anims.create({
            key: "mandyswordleft",
            frameRate: 5,
            frames: this.anims.generateFrameNumbers("mandy", {
                start: 169,
                end: 174
            })
        });

        this.anims.create({
            key: "sword_left",
            frameRate: 5,
            frames: this.anims.generateFrameNumbers("rapier", {
                start: 6,
                end: 11
            }),
            showOnStart: true,
            hideOnComplete: true
        });

    }
    create() {
        this.player = this.add.container(200, 200, [this.add.sprite(0, 0, "mandy", 26), this.add.sprite(0,0, "rapier").setVisible(false)]).setDepth(1).setScale(2);
        window.player = this.player;
        
        this.input.keyboard.on("keydown-F", ()=>{
            this.player.list[0].play("mandyswordleft");
            this.player.list[1].play("sword_left");

        })
        
        this.anna = new CharacterSprite(this, 400, 400, "anna", 26);
        this.hooded = this.physics.add.sprite(200, 200, "hooded", 26).setScale(2).setImmovable(true);
        this.fireAttacks = this.physics.add.group();
        this.assassins = this.physics.add.group({ immovable: true });
        this.assassins.add(this.hooded);
        //this.physics.add.existing() manual add 
        window.hooded = this.hooded;
        window.anna = this.anna;

        //set smaller hitbox
        this.anna.setSize(40, 50).setOffset(10, 10);
        this.anna.setCollideWorldBounds(true);
        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");
        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown) { //is clicking
                let fire = this.add.sprite(pointer.worldX, pointer.worldY, "daze", "fire00.png").play("blaze");
                this.fireAttacks.add(fire);
                fire.on("animationcomplete", () => {
                    fire.destroy();
                })
            }
        });

        this.physics.world.addCollider(this.anna, this.assassins, (anna: CharacterSprite, hooded: Phaser.Physics.Arcade.Sprite) => {
            anna.hp--;
            if(anna.hp <= 0){
                anna.destroy();
            }
            hooded.destroy();
        });

        this.physics.world.addCollider(this.fireAttacks, this.assassins, (fireAttacks: Phaser.Physics.Arcade.Sprite, hooded: Phaser.Physics.Arcade.Sprite) => {
            fireAttacks.destroy();
            hooded.destroy();

            let x = 0;
            let y = 0;
            switch (Phaser.Math.Between(0, 1)) {
                case 0: x = Phaser.Math.Between(0, this.game.renderer.width);
                    break;
                case 1: y = Phaser.Math.Between(0, this.game.renderer.height);
            }
            for (let i = 0; i < 2; i++) { //spawn 2
                this.assassins.add(this.physics.add.sprite(x, y, "hooded", 26).setScale(2).setImmovable(true));
            }
        });

        let mappy = this.add.tilemap("mappy");

        let terrain = mappy.addTilesetImage("terrain_atlas", "terrain");
        let itemset = mappy.addTilesetImage("items");

        //layers
        let botLayer = mappy.createStaticLayer("bot", [terrain], 0, 0).setDepth(-1);
        let topLayer = mappy.createStaticLayer("top", [terrain], 0, 0);

        //map collisions
        this.physics.add.collider(this.anna, topLayer);
            //by tile property
        topLayer.setCollisionByProperty({collides:true});

            //by tile index
        topLayer.setCollision([269,270,271,301,302,303,333,334,335])

        //map events
            //by location
        topLayer.setTileLocationCallback(10, 8, 1, 1, ()=>{
            alert("the sword calls to you!!!!");

            //@ts-ignore
            topLayer.setTileLocationCallback(10, 8, 1, 1, null)
        });

            //by index
        topLayer.setTileIndexCallback([272,273,274, 304,305,306, 336,337,338], ()=>{
            console.log("STOP STEPPING ON LAVA >:(")
        });

        //INTERACTIVE ITEMS FROM OBJECT LAYER
        let items = mappy.createFromObjects("pickup", 1114, {key: CST.SPRITE.CAT}).map((sprite: Phaser.GameObjects.Sprite)=>{
            sprite.setScale(2);
            sprite.setInteractive();
        });

        this.input.on("gameobjectdown", (pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.Sprite)=> {
            obj.destroy();
        });

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer)=>{

            //pixel position to tile position
            let tile = mappy.getTileAt(mappy.worldToTileX(pointer.x), mappy.worldToTileY(pointer.y));

            if(tile){
                console.log(tile);
            }
        });

        this.cameras.main.startFollow(this.anna);
        this.physics.world.setBounds(0,0, mappy.widthInPixels, mappy.heightInPixels);

        //draw debug render hitboxes

        topLayer.renderDebug(this.add.graphics(),{
            tileColor: null, //non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles,
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        })
    }
    update(time: number, delta: number) { //delta 16.666 @ 60fps

        for (let i = 0; i < this.assassins.getChildren().length; i++) {
            this.physics.accelerateToObject(this.assassins.getChildren()[i], this.anna);

        }

        if (this.anna.active === true) {
            if (this.keyboard.D.isDown === true) {
                this.anna.setVelocityX(128);

            }

            if (this.keyboard.W.isDown === true) {
                this.anna.setVelocityY(-128);
            }

            if (this.keyboard.S.isDown === true) {
                this.anna.setVelocityY(128);
            }

            if (this.keyboard.A.isDown === true) {
                this.anna.setVelocityX(-128);
            }
            if (this.keyboard.A.isUp && this.keyboard.D.isUp) { //not moving on X axis
                this.anna.setVelocityX(0);
            }
            if (this.keyboard.W.isUp && this.keyboard.S.isUp) { //not pressing y movement
                this.anna.setVelocityY(0);
            }

            if (this.anna.body.velocity.x > 0) { //moving right
                this.anna.play("right", true);
            } else if (this.anna.body.velocity.x < 0) { //moving left
                this.anna.anims.playReverse("left", true);
            } else if (this.anna.body.velocity.y < 0) { //moving up
                this.anna.play("up", true);
            } else if (this.anna.body.velocity.y > 0) { //moving down
                this.anna.play("down", true);
            }
        }

    }
}