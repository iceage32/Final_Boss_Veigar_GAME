window.onload = function() {
    var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'game');

    var HecarimGame = {
        gameover: false,
        preload: function() {
            game.load.image('player', 'assets/char.png');
            game.load.image('bg', 'assets/background objects/background.png');
            game.load.image('pine', 'assets/background objects/pinetree.png');
            game.load.image('tileset', 'assets/tilset.png');
            game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        },
        create: function() {
            //set gameover to false
            this.gameover = false;
            //set jump timer to 0
            this.jumpTimer = 0;
            //start Arcade Physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //add background to stage
            this.bg = game.add.tileSprite(0, 0, game.width, game.height, 'bg');
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
            //enable physics for player
            game.physics.enable(this.player, Phaser.Physics.ARCADE);

            //collide to world bounds
            this.player.body.collideWorldBounds = false;

            //set hitbox size
            this.player.body.setSize(60, 71, 15, 15);

            //anchor player to center
            this.player.anchor.set(0.5);

            this.player.body.gravity.y = 1000;

            //set camera to follow player
            game.camera.follow(this.player);

            //listen for keys
            this.crtlbtn = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.cursors = game.input.keyboard.createCursorKeys();
        },
        update: function() {
            //handle collision
            game.physics.arcade.collide(this.player, this.layer, function(e) {
                //HecarimGame.collision();
            });

            //controls
            this.player.body.velocity.x = 0;
            if((game.input.activePointer.isDown || this.jumpButton.isDown)) {
                if(HecarimGame.gameover) {
                    game.state.start('game_hecarim');
                } else if(this.player.body.onFloor()) {
                    this.player.body.velocity.y = -600;
                }
            }
            if(this.cursors.left.isDown) {
                this.player.body.velocity.x = -250;
                this.player.scale.x = -1;
            } else if(this.cursors.right.isDown) {
                this.player.body.velocity.x = 250;
                this.player.scale.x = 1;
            }

            //level complete
            if(game.world.width < this.player.x || game.world.height < this.player.y) {
                this.level_complete();
            }
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
            var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
            var text = game.add.text(game.width/2, game.height/2, "Congratulations\nYou finished the level\nClick to try again", style);
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