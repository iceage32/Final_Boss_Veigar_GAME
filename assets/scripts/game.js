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
            game.load.spritesheet('player', 'assets/idle_6_run_12.png', 262, 180, 18);
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

            var grd = myBitmap.context.createLinearGradient(0,0,0,game.height);
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
            //this.map.createFromObjects('pines', 1, 'pine');

            //create tile layer
            this.layer = this.map.createLayer('layer1');

            //add collision to every tile
            this.map.setCollisionByExclusion([0]);

            //resize layer to world size
            this.layer.resizeWorld();

            //add a player
            this.player = game.add.sprite(80, game.world.height-512, 'player');
            //add animations
            this.player.animations.add('run', [6,7,8,9,10,11,12,13,14,15], 16, true);
            this.player.animations.add('idle', [0,1,2,3,4,5], 4, true);
            this.player.animations.play('idle');
            //enable physics for player
            game.physics.enable(this.player, Phaser.Physics.ARCADE);

            //collide to world bounds
            this.player.body.collideWorldBounds = false;

            //set hitbox size
            this.player.body.setSize(64, 180, -6, 0);
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
                    this.player.animations.play('run');
                } else {
                    this.player.body.velocity.x = -250;
                    this.player.animations.play('run');
                }
                this.player.animations.play('run');
                this.player.scale.x = -1;
            } else if(this.cursors.right.isDown) {
                if(this.crtlbtn.isDown) {
                    this.player.body.velocity.x = 400;
                    this.player.animations.play('run');
                } else {
                    this.player.body.velocity.x = 250;
                    this.player.animations.play('run');
                }
                this.player.scale.x = 1;
            } else {
                this.player.animations.play('idle');
            }

            //level complete
            if(game.world.width < this.player.x || game.world.height < this.player.y) {
                this.level_complete();
            }

            //set fps
            this.fpsText.text = game.time.fps + ' FPS';
        },
        render: function() {
            game.debug.body(this.player);
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

    var MissFortuneGame = {
        preload: function() {

        },
        create: function() {
            var text = game.add.text(game.width/2, game.height/2, "Miss Fortune Game", { font: "65px Arial", fill: "#ffffff", align: "center" });
            text.anchor.set(0.5);
        },
        update: function() {

        },
        render: function() {

        }
    };


    var SonaGame = {
        'buttonDown': {
            'q': false,
            'w': false,
            'e': false,
            'r': false
        },
        nextButtonSpawn: 0,
        preload: function() {
            game.load.spritesheet('button_q', 'assets/sona/button_q.png', 100, 100, 2);
            game.load.spritesheet('button_w', 'assets/sona/button_w.png', 100, 100, 2);
            game.load.spritesheet('button_e', 'assets/sona/button_e.png', 100, 100, 2);
            game.load.spritesheet('button_r', 'assets/sona/button_r.png', 100, 100, 2);
            game.load.image('hitline', 'assets/sona/hitline.png');
            game.load.image('item', 'assets/sona/item.png');
        },
        create: function() {
            //init arcade physics
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //add score
            this.scoreText = game.add.text(0, 0, "Score: 0", { font: "28px Arial", fill: "#ffffff"});
            this.score = 0;

            //button params
            this.buttonSize = 100;
            this.buttonSpacing = 10;
            this.gamestartX = (game.width - (this.buttonSize+this.buttonSpacing)*3)/2;
            this.buttonsY = game.height-(this.buttonSize/2);

            //buttonq
            this.buttonq = game.add.sprite(this.gamestartX, this.buttonsY, 'button_q');
            this.buttonq.anchor.set(0.5);
            this.buttonq.animations.add('pressed', [1]);
            this.buttonq.animations.add('normal', [0]);
            this.buttonq.animations.play('normal');

            //buttonw
            this.buttonw = game.add.sprite(this.gamestartX+this.buttonSize+this.buttonSpacing, this.buttonsY, 'button_w');
            this.buttonw.anchor.set(0.5);
            this.buttonw.animations.add('pressed', [1]);
            this.buttonw.animations.add('normal', [0]);
            this.buttonw.animations.play('normal');

            //buttone
            this.buttone = game.add.sprite(this.gamestartX+(this.buttonSize+this.buttonSpacing)*2, this.buttonsY, 'button_e');
            this.buttone.anchor.set(0.5);
            this.buttone.animations.add('pressed', [1]);
            this.buttone.animations.add('normal', [0]);
            this.buttone.animations.play('normal');

            //buttonr
            this.buttonr = game.add.sprite(this.gamestartX+(this.buttonSize+this.buttonSpacing)*3, this.buttonsY, 'button_r');
            this.buttonr.anchor.set(0.5);
            this.buttonr.animations.add('pressed', [1]);
            this.buttonr.animations.add('normal', [0]);
            this.buttonr.animations.play('normal');

            //add hitlines for each button
            this.hitBoxes = game.add.group();
            this.hitBoxQ = this.hitBoxes.create(this.gamestartX, this.buttonsY - this.buttonSize, 'hitline');
            this.hitBoxQ.anchor.set(0.5);
            this.hitBoxQ.buttonName = 'q';
            game.physics.enable(this.hitBoxQ, Phaser.Physics.ARCADE);

            this.hitBoxW = this.hitBoxes.create(this.gamestartX+this.buttonSize+this.buttonSpacing, this.buttonsY - this.buttonSize, 'hitline');
            this.hitBoxW.anchor.set(0.5);
            this.hitBoxW.buttonName = 'w';
            game.physics.enable(this.hitBoxW, Phaser.Physics.ARCADE);

            this.hitBoxE = this.hitBoxes.create(this.gamestartX+(this.buttonSize+this.buttonSpacing)*2, this.buttonsY - this.buttonSize, 'hitline');
            this.hitBoxE.anchor.set(0.5);
            this.hitBoxE.buttonName = 'e';
            game.physics.enable(this.hitBoxE, Phaser.Physics.ARCADE);

            this.hitBoxR = this.hitBoxes.create(this.gamestartX+(this.buttonSize+this.buttonSpacing)*3, this.buttonsY - this.buttonSize, 'hitline');
            this.hitBoxR.anchor.set(0.5);
            this.hitBoxR.buttonName = 'r';
            game.physics.enable(this.hitBoxR, Phaser.Physics.ARCADE);

            //creating button group
            this.buttons = game.add.group();

            //adding keys
            this.Qbtn = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            this.Wbtn = game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.Ebtn = game.input.keyboard.addKey(Phaser.Keyboard.E);
            this.Rbtn = game.input.keyboard.addKey(Phaser.Keyboard.R);
        },
        update: function() {
            if(this.Qbtn.isDown) {
                this.buttonDown.q = true;
            } else {
                this.buttonDown.q = false;
            }
            if(this.Wbtn.isDown) {
                this.buttonDown.w = true;
            } else {
                this.buttonDown.w = false;
            }
            if(this.Ebtn.isDown) {
                this.buttonDown.e = true;
            } else {
                this.buttonDown.e = false;
            }
            if(this.Rbtn.isDown) {
                this.buttonDown.r = true;
            } else {
                this.buttonDown.r = false;
            }

            //play animation if down
            if(this.buttonDown.q) {
                this.buttonq.animations.play('pressed');
            } else {
                this.buttonq.animations.play('normal');
            }
            if(this.buttonDown.w) {
                this.buttonw.animations.play('pressed');
            } else {
                this.buttonw.animations.play('normal');
            }
            if(this.buttonDown.e) {
                this.buttone.animations.play('pressed');
            } else {
                this.buttone.animations.play('normal');
            }
            if(this.buttonDown.r) {
                this.buttonr.animations.play('pressed');
            } else {
                this.buttonr.animations.play('normal');
            }

            //spawn button
            if(game.time.now >= this.nextButtonSpawn) {
                this.nextButtonSpawn = game.time.now + 3000;
                this.spawnButton();
            }

            game.physics.arcade.overlap(this.buttons, this.hitBoxes, function(button, hitbox) {
                if(button.buttonName == hitbox.buttonName && SonaGame.buttonDown[button.buttonName]) {
                    console.log('You hit the button at hitbox y=' + hitbox.y + ' and button y=' + button.y);
                    SonaGame.score += Math.round(50-Math.abs(hitbox.y - button.y));
                    button.kill();
                } else if(button.y > hitbox.y+50){
                    SonaGame.score -= 50;
                    button.kill();
                }
            }, null, this);

            this.scoreText.text = 'Score: ' + this.score;
        },
        render: function() {

        },
        spawnButton: function() {
            var lane = game.rnd.integerInRange(0, 3);
            var spawnX = this.gamestartX+(this.buttonSize+this.buttonSpacing)*lane;
            var button = this.buttons.create(spawnX, 0, 'item');
            button.anchor.set(0.5);
            switch(lane) {
                case 0:
                    button.buttonName = 'q';
                    break;
                case 1:
                    button.buttonName = 'w';
                    break;
                case 2:
                    button.buttonName = 'e';
                    break;
                case 3:
                    button.buttonName = 'r';
                    break;
            }
            game.physics.enable(button, Phaser.Physics.ARCADE);
            button.body.setSize(100,100,0,0);
            button.body.velocity.y = 100;

        }
    };

    var MainMenu = {
        preload: function() {
            game.load.spritesheet('button', 'assets/btn_sprite.png', 256, 96);
        },
        create: function() {
            game.stage.backgroundColor = '#182d3b';
            var text = game.add.text(game.width/2, game.height/4, "Final Boss Veigar Game", { font: "65px Arial", fill: "#ffffff", align: "center" });
            text.anchor.set(0.5);

            var buttons = game.add.group();

            var firstbuttonX = (game.width - (256+10)*3)/2;
            var buttonY = ((game.height/4)*3)-48;

            var hecarimbutton = game.add.button(firstbuttonX, buttonY, 'button', function() {
                game.state.start('game_hecarim');
            }, this, 1, 0, 2, 0);
            //hecarimbutton.anchor.set(0.5);
            var missfortunebutton = game.add.button(firstbuttonX + 256 + 10, buttonY, 'button', function() {
                game.state.start('game_missfortune');
            }, this, 1, 0, 2, 0);
            //missfortunebutton.anchor.set(0.5);
            var sonabutton = game.add.button(firstbuttonX + (256 + 10)*2, buttonY, 'button', function() {
                game.state.start('game_sona');
            }, this, 1, 0, 2, 0);
            //sonabutton.anchor.set(0.5);

            buttons.add(hecarimbutton);
            buttons.add(missfortunebutton);
            buttons.add(sonabutton);
        },
        update: function() {

        },
        render: function() {

        }
    };

    game.state.add('game_hecarim', HecarimGame);
    game.state.add('game_missfortune', MissFortuneGame);
    game.state.add('game_sona', SonaGame);
    game.state.add('mainmenu', MainMenu);

    game.state.start('mainmenu');

};