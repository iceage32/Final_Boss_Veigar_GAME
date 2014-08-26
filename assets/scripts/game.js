window.onload = function() {
    var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'game');

    var HecarimGame = {
        gameover: false,
        preload: function() {
            //game.load.image('player', 'assets/char.png');
            game.load.image('bg', 'assets/background objects/background.png');
            game.load.image('pine', 'assets/background objects/pinetree.png');
            game.load.image('tileset', 'assets/tilset.png');
            game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.spritesheet('player', 'assets/hecarim_run.png', 200, 190, 12);
        },
        create: function() {
            //Enable advanced timing
            game.time.advancedTiming = true;
            //set gameover to false
            this.gameover = false;
            //set jump timer to 0
            this.jumpTimer = 0;
            //start Arcade Physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //add background to stage
            var myBitmap = game.add.bitmapData(game.width, game.height);

            var grd = myBitmap.context.createLinearGradient(0,0,0,600);
            grd.addColorStop(0,"#232357");
            grd.addColorStop(1,"#8d70e6");
            myBitmap.context.fillStyle = grd;
            myBitmap.context.fillRect(0,0,game.width,game.height);

            this.bg = game.add.tileSprite(0, 0, game.width, game.height, myBitmap);
            //fix background to camera
            this.bg.fixedToCamera = true;

            //set gravity
            game.physics.arcade.gravity.y = 300;

            //load tilemap
            this.map = game.add.tilemap('map');
            //set tileset images
            this.map.addTilesetImage('tilset', 'tileset');
            this.map.addTilesetImage('pinetree', 'pine');

            //create objects
            this.map.createFromObjects('pines', 1, 'pine');

            //create tile layer
            this.layer = this.map.createLayer('layer1');

            //add collision to every tile
            this.map.setCollisionByExclusion([]);

            //resize layer to world size
            this.layer.resizeWorld();

            //add a player
            this.player = game.add.sprite(80, game.world.centerY, 'player');
            this.player.animations.add('run');
            this.player.animations.play('run', 20, true);
            //enable physics for player
            game.physics.enable(this.player, Phaser.Physics.ARCADE);

            //collide to world bounds
            this.player.body.collideWorldBounds = false;

            //set hitbox size
            this.player.body.setSize(200, 190, 0, 0);

            //anchor player to center
            this.player.anchor.set(0.5);

            this.player.body.gravity.y = 1000;

            //Add drag to player
            //this.player.body.drag.set(450);

            //set camera to follow player
            game.camera.follow(this.player);

            //add fps counter
            this.fpsText= game.add.text(5, 5, "0 FPS", { font: "28px Arial", fill: "#ffffff"});
            this.fpsText.fixedToCamera = true;

            //listen for keys
            this.crtlbtn = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.cursors = game.input.keyboard.createCursorKeys();

            //handle collision
            game.physics.arcade.collide(this.player, this.layer, function(e) {
                //HecarimGame.collision();
            }, null, this);
        },
        update: function() {
            //handle collision
            game.physics.arcade.collide(this.player, this.layer, function(e) {
                //HecarimGame.collision();
            }, null, this);

            //reset player velocity
            this.player.body.velocity.x = 0;

            //controls
            if((game.input.activePointer.isDown || this.jumpButton.isDown || this.cursors.up.isDown)) {
                if(HecarimGame.gameover) {
                    game.state.start('game_hecarim');
                } else if(this.player.body.onFloor()) {
                    this.player.body.velocity.y = -600;
                }
            }
            if(this.cursors.left.isDown) {
                if(this.crtlbtn.isDown) {
                    this.player.body.velocity.x = -400;
                } else {
                    this.player.body.velocity.x = -250;
                }
                this.player.scale.x = -1;
            } else if(this.cursors.right.isDown) {
                if(this.crtlbtn.isDown) {
                    this.player.body.velocity.x = 400;
                } else {
                    this.player.body.velocity.x = 250;
                }
                this.player.scale.x = 1;
            }

            //level complete
            if(game.world.width < this.player.x || game.world.height < this.player.y) {
                this.level_complete();
            }

            //set fps
            this.fpsText.text = game.time.fps + ' FPS';
        },
        render: function() {

        },
        collision: function() {
            var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
            var text = game.add.text(game.width/2, game.height/2, "Game Over\nClick to try again", style);
            text.fixedToCamera = true;
            text.anchor.set(0.5);

            this.player.body.velocity.x = 0;
            this.gameover = true;
        },
        level_complete: function() {
            var text = game.add.text(game.width/2, game.height/2, "Congratulations\nYou finished the level\nClick to try again", { font: "65px Arial", fill: "#ffffff", align: "center" });
            text.fixedToCamera = true;
            text.anchor.set(0.5);

            this.player.body.velocity.x = 0;
            this.player.destroy();
            this.gameover = true;
        }
    };

    game.state.add('game_hecarim', HecarimGame);

    game.state.start('game_hecarim');

};