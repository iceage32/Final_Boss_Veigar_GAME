window.onload = function() {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game');

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
            game.paused = false;
            this.gameover = false;
            //start Arcade Physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //add background to stage
            this.bg = game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg');
            //fix background to camera
            this.bg.fixedToCamera = true;

            //set gravity
            game.physics.arcade.gravity.y = 1000;

            //load tilemap
            this.map = game.add.tilemap('map');
            //set tileset images
            this.map.addTilesetImage('tileset', 'tileset');
            this.map.addTilesetImage('pinetree', 'pine');

            //create objects
            this.map.createFromObjects('pines', 3, 'pine');

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

            //move player forward
            this.player.body.velocity.x = 300;

            //set camera to follow player
            game.camera.follow(this.player);

            //listen for keys
            this.crtlbtn = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        },
        update: function() {
            //handle collision
            game.physics.arcade.collide(this.player, this.layer, function() {
                HecarimGame.collision();
            });
            game.physics.arcade.collide(this.player, game.world, function() {
                console.log('collide');
            });

            //controls
            if(game.input.activePointer.isDown || this.jumpButton.isDown) {
                if(HecarimGame.gameover) {
                    game.state.start('game_hecarim');
                } else {
                    this.player.body.velocity.y = -200;
                }
            }

            //level complete
            if(game.world.width < this.player.x) {
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