window.onload = function() {
    var game = new Phaser.Game(1024, 576, Phaser.WEBGL, 'game');

    var HecarimGame = {
        gameover: false,
        preload: function() {
            //game.load.image('player', 'assets/char.png');
            game.load.image('bg', 'assets/background objects/background.png');
            game.load.image('pine', 'assets/background objects/pinetree.png');
            game.load.image('tileset', 'assets/tilset.png');
            game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.spritesheet('player', 'assets/hecarim.png', 256, 168, 17);
        },
        create: function() {
            this.menubutton = game.add.button(5, 5, 'sona_mainmenubutton', function() {
                window.onblur = null;
                game.state.start('mainmenu');
            }, this, 1, 0, 2, 0);
            this.menubutton.scale.set(0.5);
            //Enable advanced timing
            game.time.advancedTiming = true;
            //set gameover to false
            this.gameover = false;
            //set jump timer to 0
            this.jumpTimer = 0;
            this.jumping = false;
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
            this.player.animations.add('jump', [0,1,2,3], 6, false);
            this.player.animations.add('idle', [4, 5], 2, true);
            this.player.animations.add('run', [6,7,8,9,10,11,12,13,14,15,16], 16, true);
            this.player.animations.play('idle');
            //enable physics for player
            game.physics.enable(this.player, Phaser.Physics.ARCADE);

            //collide to world bounds
            this.player.body.collideWorldBounds = false;

            //set hitbox size
            this.player.body.setSize(64, 128, -6, 20);
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
                if(!this.jumping) this.player.animations.play('run');
                this.player.scale.x = -1;
            } else if(this.cursors.right.isDown) {
                if(this.crtlbtn.isDown) {
                    this.player.body.velocity.x = 400;
                } else {
                    this.player.body.velocity.x = 250;
                }
                if(!this.jumping) this.player.animations.play('run');
                this.player.scale.x = 1;
            } else {
                if(!this.jumping) this.player.animations.play('idle');
            }

            if(!this.jumping && !this.player.body.onFloor()) {
                this.player.animations.play('jump');
                this.jumping = true;
            } else if (this.jumping && this.player.body.onFloor()) {
                this.jumping = false;
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
    var HecarimGame = {
        create: function() {
            this.menubutton = game.add.button(5, 5, 'sona_mainmenubutton', function() {
                window.onblur = null;
                game.state.start('mainmenu');
            }, this, 1, 0, 2, 0);
            this.menubutton.scale.set(0.5);
            var text = game.add.text(game.width/2, game.height/2, "Soon™", { font: "65px Arial", fill: "#ffffff", align: "center" });
            text.anchor.set(0.5);
        }
    };
    var MissFortuneGame = {
        create: function() {
            this.menubutton = game.add.button(5, 5, 'sona_mainmenubutton', function() {
                window.onblur = null;
                game.state.start('mainmenu');
            }, this, 1, 0, 2, 0);
            this.menubutton.scale.set(0.5);
            var text = game.add.text(game.width/2, game.height/2, "Soon™", { font: "65px Arial", fill: "#ffffff", align: "center" });
            text.anchor.set(0.5);
        }
    };
    var SonaGame = {
        create: function() {
            //init arcade physics
            game.physics.startSystem(Phaser.Physics.ARCADE);

            this.buttonDown = {
                'q': false,
                'w': false,
                'e': false,
                'r': false
            };
            this.overlap = {
                'q': false,
                'w': false,
                'e': false,
                'r': false
            };
            this.gameover = false;
            this.nextButtonSpawn = 0;
            this.hearts = 3;
            this.pausetime = 0;

            //set difficulty

            switch(this.difficulty) {
                case 0:
                    this.buttonSpeed = 250;
                    this.maxButtonSpeed = 300;
                    this.buttonInterval = 1000;
                    this.minButtonInterval = 800;
                    this.buttonSpeedIncrement = 1;
                    this.buttonIntervalDecrement = 1;
                    this.oneButtonChance = 85;
                    this.twoButtonChance = 95;
                    this.threeButtonChance = 100;
                    this.fourButtonChance = -1;
                    break;
                case 1:
                    this.buttonSpeed = 300;
                    this.maxButtonSpeed = 350;
                    this.buttonInterval = 800;
                    this.minButtonInterval = 700;
                    this.buttonSpeedIncrement = 1;
                    this.buttonIntervalDecrement = 1;
                    this.oneButtonChance = 75;
                    this.twoButtonChance = 85;
                    this.threeButtonChance = 100;
                    this.fourButtonChance = -1;
                    break;
                case 2:
                    this.buttonSpeed = 350;
                    this.maxButtonSpeed = 350;
                    this.buttonInterval = 700;
                    this.minButtonInterval = 625;
                    this.buttonSpeedIncrement = 2;
                    this.buttonIntervalDecrement = 2;
                    this.oneButtonChance = 70;
                    this.twoButtonChance = 80;
                    this.threeButtonChance = 90;
                    this.fourButtonChance = 100;
                    break;
                case 3:
                    this.buttonSpeed = 450;
                    this.maxButtonSpeed = 550;
                    this.buttonInterval = 625;
                    this.minButtonInterval = 475;
                    this.buttonSpeedIncrement = 3;
                    this.buttonIntervalDecrement = 3;
                    this.oneButtonChance = 60;
                    this.twoButtonChance = 75;
                    this.threeButtonChance = 85;
                    this.fourButtonChance = 100;
                    break;
            }

            //music
            this.sound1 = game.add.audio('sound4', 0.5, false);
            this.sound1.play();

            //button params
            this.buttonSize = 100;
            this.buttonSpacing = 10;
            this.gamestartX = (game.width - (this.buttonSize+this.buttonSpacing)*3)/2;
            this.buttonsY = game.height-(this.buttonSize/2);

            this.bg = game.add.sprite(0,0, 'sona_bg');

            //add score
            this.scoreText = game.add.text(10, game.height-82, "Score: 0", { font: "28px Arial", fill: "#ffffff"});
            this.score = 0;

            this.gamebg = game.add.sprite(this.gamestartX - 60,game.height-720, 'sona_gamebg');

            //buttonq
            this.buttonq = game.add.sprite(this.gamestartX, this.buttonsY, 'sona_button_q');
            this.buttonq.anchor.set(0.5);
            this.buttonq.animations.add('pressed', [1]);
            this.buttonq.animations.add('normal', [0]);
            this.buttonq.animations.play('normal');

            //buttonw
            this.buttonw = game.add.sprite(this.gamestartX+this.buttonSize+this.buttonSpacing, this.buttonsY, 'sona_button_w');
            this.buttonw.anchor.set(0.5);
            this.buttonw.animations.add('pressed', [1]);
            this.buttonw.animations.add('normal', [0]);
            this.buttonw.animations.play('normal');

            //buttone
            this.buttone = game.add.sprite(this.gamestartX+(this.buttonSize+this.buttonSpacing)*2, this.buttonsY, 'sona_button_e');
            this.buttone.anchor.set(0.5);
            this.buttone.animations.add('pressed', [1]);
            this.buttone.animations.add('normal', [0]);
            this.buttone.animations.play('normal');

            //buttonr
            this.buttonr = game.add.sprite(this.gamestartX+(this.buttonSize+this.buttonSpacing)*3, this.buttonsY, 'sona_button_r');
            this.buttonr.anchor.set(0.5);
            this.buttonr.animations.add('pressed', [1]);
            this.buttonr.animations.add('normal', [0]);
            this.buttonr.animations.play('normal');

            //add hitlines for each button
            this.hitBoxes = game.add.group();
            this.hitBoxQ = this.hitBoxes.create(this.gamestartX, this.buttonsY - this.buttonSize, 'sona_hitline');
            this.hitBoxQ.anchor.set(0.5);
            this.hitBoxQ.buttonName = 'q';
            game.physics.enable(this.hitBoxQ, Phaser.Physics.ARCADE);

            this.hitBoxW = this.hitBoxes.create(this.gamestartX+this.buttonSize+this.buttonSpacing, this.buttonsY - this.buttonSize, 'sona_hitline');
            this.hitBoxW.anchor.set(0.5);
            this.hitBoxW.buttonName = 'w';
            game.physics.enable(this.hitBoxW, Phaser.Physics.ARCADE);

            this.hitBoxE = this.hitBoxes.create(this.gamestartX+(this.buttonSize+this.buttonSpacing)*2, this.buttonsY - this.buttonSize, 'sona_hitline');
            this.hitBoxE.anchor.set(0.5);
            this.hitBoxE.buttonName = 'e';
            game.physics.enable(this.hitBoxE, Phaser.Physics.ARCADE);

            this.hitBoxR = this.hitBoxes.create(this.gamestartX+(this.buttonSize+this.buttonSpacing)*3, this.buttonsY - this.buttonSize, 'sona_hitline');
            this.hitBoxR.anchor.set(0.5);
            this.hitBoxR.buttonName = 'r';
            game.physics.enable(this.hitBoxR, Phaser.Physics.ARCADE);

            //creating button group
            this.buttons = game.add.group();

            //adding hearts
            this.heartGroup = game.add.group();
            for(var i = 0; i<this.hearts;i++) {
                this.heartGroup.create(10+(32+10)*i, game.height-10-32, 'sona_heart');
            }

            //adding keys
            this.Qbtn = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            this.Wbtn = game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.Ebtn = game.input.keyboard.addKey(Phaser.Keyboard.E);
            this.Rbtn = game.input.keyboard.addKey(Phaser.Keyboard.R);

            this.Qbtn.onDown.add(function() {
                if(!SonaGame.overlap.q) {
                    SonaGame.loseLife();
                }
            });
            this.Wbtn.onDown.add(function() {
                if(!SonaGame.overlap.w) {
                    SonaGame.loseLife();
                }
            });
            this.Ebtn.onDown.add(function() {
                if(!SonaGame.overlap.e) {
                    SonaGame.loseLife();
                }
            });
            this.Rbtn.onDown.add(function() {
                if(!SonaGame.overlap.r) {
                    SonaGame.loseLife();
                }
            });

            //add global controls
            this.menubutton = game.add.button(5, 5, 'sona_mainmenubutton', function() {
                window.onblur = null;
                game.sound.stopAll();
                game.state.start('mainmenu');
            }, this, 1, 0, 2, 0);
            this.menubutton.scale.set(0.5);

            this.pausebutton = game.add.text(game.width-24, 0, "||", { font: "24px Arial", fill: "#ffffff"});
            this.pausebutton.inputEnabled = true;
            this.pausebutton.input.useHandCursor = true;
            this.pausebutton.events.onInputDown.add(function() {
                this.pause();
            }, this);
            this.mutebutton = game.add.text(game.width-150, 0, "Mute Music", { font: "24px Arial", fill: "#ffffff"});
            this.mutebutton.inputEnabled = true;
            this.mutebutton.input.useHandCursor = true;
            this.mutebutton.events.onInputDown.add(function() {
                if(game.sound.mute) {
                    game.sound.mute = false;
                } else {
                    game.sound.mute = true;
                }
            }, this);

            game.input.onDown.add(function() {
                if(game.paused && !SonaGame.gameover) {
                    SonaGame.unpause();
                }
                if(SonaGame.gameover) {
                    SonaGame.gameOverClick();
                }
            });

            window.onblur = function() {
                SonaGame.pause();
            }
        },
        update: function() {
            if(this.hearts <= 0) this.gameOver();

            if(this.Qbtn.isDown) this.buttonDown.q = true;
            else this.buttonDown.q = false;
            if(this.Wbtn.isDown) this.buttonDown.w = true;
            else this.buttonDown.w = false;
            if(this.Ebtn.isDown) this.buttonDown.e = true;
            else this.buttonDown.e = false;
            if(this.Rbtn.isDown) this.buttonDown.r = true;
            else this.buttonDown.r = false;

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
                this.nextButtonSpawn = game.time.now + this.buttonInterval;
                this.spawnButton();
            }

            game.physics.arcade.overlap(this.buttons, this.hitBoxes, function(button, hitbox) {
                if(button.buttonName == hitbox.buttonName) {
                    if (SonaGame.buttonDown[button.buttonName]) {
                        var score = Math.abs(100 - Math.abs(hitbox.y - Math.round(button.y)));
                        console.log('You hit the button at hitbox y=' + hitbox.y + ' and button y=' + Math.round(button.y) + ' and got score=' + score);
                        SonaGame.score += score;
                        if (SonaGame.buttonSpeed < SonaGame.maxButtonSpeed) {
                            SonaGame.buttonSpeed += SonaGame.buttonSpeedIncrement;
                            console.log('Speeding up by: ' + SonaGame.buttonSpeedIncrement);
                        }
                        if (SonaGame.buttonInterval >= SonaGame.minButtonInterval) {
                            SonaGame.buttonInterval -= SonaGame.buttonIntervalDecrement;
                        }
                        this.buttons.setAll('body.velocity.y', SonaGame.buttonSpeed);
                        button.kill();
                        SonaGame.overlap[button.buttonName] = false;
                    } else if (button.y > hitbox.y + 50) {
                        if (SonaGame.buttonSpeed < SonaGame.maxButtonSpeed) {
                            SonaGame.buttonSpeed += SonaGame.buttonSpeedIncrement;
                            console.log('Speeding up by: ' + SonaGame.buttonSpeedIncrement);
                        }
                        if (SonaGame.buttonInterval >= SonaGame.minButtonInterval) {
                            SonaGame.buttonInterval -= SonaGame.buttonIntervalDecrement;
                        }
                        this.buttons.setAll('body.velocity.y', SonaGame.buttonSpeed);
                        SonaGame.loseLife();
                        button.kill();
                        SonaGame.overlap[button.buttonName] = false;
                    } else {
                        SonaGame.overlap[button.buttonName] = true;
                    }
                }
            }, null, this);

            this.scoreText.text = 'Score: ' + this.score;
        },
        render: function() {

        },
        spawnButton: function() {
            var num = game.rnd.integerInRange(0,100);
            var i2 = 0;

            //num spawned
            if(num <= this.oneButtonChance) {
                i2 = 0;
            } else {
                if(num <= this.twoButtonChance) {
                    i2 = 1;
                }
                else {
                    if(num <= this.threeButtonChance) {
                        i2 = 2;
                    } else {
                        if(num <= this.fourButtonChance) {
                            i2 = 3;
                        }
                    }
                }
            }
            var lanesused = [];
            for(var i = 0; i<=i2; i++) {
                var lane = game.rnd.integerInRange(0, 3);
                while(lanesused.indexOf(lane) != -1) {
                    lane = game.rnd.integerInRange(0, 3);
                }
                lanesused.push(lane);

                var spawnX = this.gamestartX+(this.buttonSize+this.buttonSpacing)*lane;
                var button = this.buttons.create(spawnX, 0, 'sona_star'+lane);
                button.anchor.set(0.5);
                button.alpha = 0.8;
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
                button.body.velocity.y = this.buttonSpeed;
            }
        },
        pause: function() {
            if(!game.paused) {
                this.pausetime = game.time.now;
                game.paused = true;
                this.pausetext = game.add.text(game.world.centerX, game.world.centerY, "Game Paused\nClick anywhere to unpause", { font: "24px Arial", fill: "#ffffff", align: 'center'});
                this.pausetext.anchor.set(0.5);
            }
        },
        unpause: function() {
            if(game.paused) {
                this.pausetext.destroy();
                game.paused = false;
                this.nextButtonSpawn = this.pausetime - this.nextButtonSpawn + game.time.now;
            }
        },
        loseLife: function() {
            this.hearts -= 1;
            for(var i = this.heartGroup.length-1; i>=0; i--) {
                var heart = this.heartGroup.getAt(i);
                if(heart.key != 'sona_heartbroken') {
                    heart.loadTexture('sona_heartbroken');
                    break;
                }
            }
        },
        gameOver: function() {
            this.gameover = true;
            game.paused = true;
            this.gameovertext = game.add.text(game.world.centerX, game.world.centerY, "Game Over\nScore: " + this.score + '\nClick to return to main menu', { font: "24px Arial", fill: "#ffffff", align: 'center'});
            this.gameovertext.anchor.set(0.5);
        },
        gameOverClick: function() {
            game.paused = false;
            window.onblur = null;
            game.sound.stopAll();
            game.state.start('game_sona_difficulty');
        }
    };
    var SonaDifficultySelect = {
        create: function() {
            this.bg = game.add.sprite(0,0, 'sona_bg');
            this.text = game.add.text(game.world.centerX, game.world.height/6, 'Select difficulty:', {font: "24px Arial", fill:'#FFFFFF'});
            this.text.anchor.set(0.5);

            this.menubutton = game.add.button(5, 5, 'sona_mainmenubutton', function() {
                window.onblur = null;
                game.state.start('mainmenu');
            }, this, 1, 0, 2, 0);
            this.menubutton.scale.set(0.5);

            this.easybutton = game.add.button(game.world.centerX-100, game.world.height/6+30, 'sona_difficulty_button_easy', function() {
                SonaGame.difficulty = 0;
                game.state.start('game_sona');
            }, this, 1, 0, 2, 0);
            this.mediumbutton = game.add.button(game.world.centerX-100, game.world.height/6+30+(60+10), 'sona_difficulty_button_medium', function() {
                SonaGame.difficulty = 1;
                game.state.start('game_sona');
            }, this, 1, 0, 2, 0);
            this.hardbutton = game.add.button(game.world.centerX-100, game.world.height/6+30+(60+10)*2, 'sona_difficulty_button_hard', function() {
                SonaGame.difficulty = 2;
                game.state.start('game_sona');
            }, this, 1, 0, 2, 0);
            this.hardcorebutton = game.add.button(game.world.centerX-100, game.world.height/6+30+(60+10)*3, 'sona_difficulty_button_hardcore', function() {
                SonaGame.difficulty = 3;
                game.state.start('game_sona');
            }, this, 1, 0, 2, 0);

        }
    };
    var MainMenu = {
        preload: function() {
            this.loadtext = game.add.text(game.world.centerX, game.world.centerY-45, 'Loading', {font: '24px Arial', fill: '#FFF'});
            this.loadtext.anchor.set(0.5);
            this.loadsprite = game.add.sprite(game.world.centerX, game.world.centerY, 'loadingbar');
            this.loadsprite.anchor.set(0.5);
            game.load.setPreloadSprite(this.loadsprite);

            game.load.image('bg', 'assets/mainmenu/background_full.png');
            game.load.image('cloud1', 'assets/mainmenu/cloud1.png');
            game.load.image('cloud2', 'assets/mainmenu/cloud2.png');
            game.load.image('logo', 'assets/mainmenu/logo.png');
            game.load.spritesheet('heca_button', 'assets/mainmenu/heca_button.PNG', 183, 60);
            game.load.spritesheet('sona_button', 'assets/mainmenu/sona_button.png', 183, 60);
            game.load.spritesheet('mf_button', 'assets/mainmenu/mf_button.png', 183, 60);
            game.load.spritesheet('sona', 'assets/mainmenu/sona_idle.png', 211, 188, 9);
            game.load.spritesheet('hecarim', 'assets/mainmenu/hecarim_idle.png', 211, 188, 4);
            game.load.spritesheet('missfortune', 'assets/mainmenu/miss_fortune_idle.png', 211, 188, 20);

            //sona
            game.load.spritesheet('sona_button_q', 'assets/sona/button_q.png', 100, 100, 2);
            game.load.spritesheet('sona_button_w', 'assets/sona/button_w.png', 100, 100, 2);
            game.load.spritesheet('sona_button_e', 'assets/sona/button_e.png', 100, 100, 2);
            game.load.spritesheet('sona_button_r', 'assets/sona/button_r.png', 100, 100, 2);
            game.load.spritesheet('sona_mainmenubutton', 'assets/sona/main_menu_button.png', 286, 86);
            game.load.image('sona_hitline', 'assets/sona/hitline.png');
            game.load.image('sona_star0', 'assets/sona/sona_star_0.png');
            game.load.image('sona_star1', 'assets/sona/sona_star_1.png');
            game.load.image('sona_star2', 'assets/sona/sona_star_2.png');
            game.load.image('sona_star3', 'assets/sona/sona_star_3.png');
            game.load.image('sona_bg', 'assets/sona/bg.jpg');
            game.load.image('sona_gamebg', 'assets/sona/gamebg.png');
            game.load.image('sona_heart', 'assets/sona/heart.png');
            game.load.image('sona_heartbroken', 'assets/sona/heart_broken.png');

            //sona difficulty
            game.load.spritesheet('sona_difficulty_button_easy', 'assets/sona_difficulty_button_easy.png', 200, 60);
            game.load.spritesheet('sona_difficulty_button_medium', 'assets/sona_difficulty_button_medium.png', 200, 60);
            game.load.spritesheet('sona_difficulty_button_hard', 'assets/sona_difficulty_button_hard.png', 200, 60);
            game.load.spritesheet('sona_difficulty_button_hardcore', 'assets/sona_difficulty_button_hardcore.png', 200, 60);
        },
        create: function() {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //add music
            this.music = game.add.audio('mainmenumusic', 0.5, true);
            this.music.play();

            //add background
            this.bg = game.add.sprite(0,0, 'bg');
            this.bg.scale.x = (game.width)/1280;
            this.bg.scale.y = (game.height)/720;

            //add characters
            var characterY = (game.height*(720-116)/720)-188;
            this.hecarim = game.add.sprite(266, characterY, 'hecarim');
            this.hecarim.animations.add('idle');
            this.hecarim.animations.play('idle', 2, true);

            this.mf = game.add.sprite(470, characterY, 'missfortune');
            this.mf.animations.add('idle');
            this.mf.animations.play('idle', 3, true);

            this.sona = game.add.sprite(650, characterY, 'sona');
            this.sona.animations.add('idle');
            this.sona.animations.play('idle', 3, true);

            //add clouds
            this.cloud1 = game.add.sprite(10, 130, 'cloud1');
            game.physics.enable(this.cloud1, Phaser.Physics.ARCADE);
            this.cloud1.body.setSize(316, 76);
            this.cloud1.body.velocity.x = 50;
            this.cloud2 = game.add.sprite(450, 90, 'cloud2');
            game.physics.enable(this.cloud2, Phaser.Physics.ARCADE);
            this.cloud2.body.setSize(318, 104);
            this.cloud2.body.velocity.x = 50;


            //add game name
            this.logo = game.add.sprite(game.world.centerX, 150, 'logo');
            this.logo.anchor.set(0.5);
            game.physics.enable(this.logo, Phaser.Physics.ARCADE);

            var buttons = game.add.group();

            var firstbuttonX = (game.width - (186+10)*3)/2;
            var buttonY = game.height-78;

            var sonabutton = game.add.button(firstbuttonX+186, buttonY, 'sona_button', function() {
                MainMenu.music.stop();
                game.state.start('game_sona_difficulty');
            }, this, 1, 0, 2, 0);
            /*var hecarimbutton = game.add.button(firstbuttonX + 186 + 10, buttonY, 'heca_button', function() {
                MainMenu.music.stop();
                game.state.start('game_hecarim');
            }, this, 1, 0, 2, 0);
            var missfortunebutton = game.add.button(firstbuttonX + (186 + 10)*2, buttonY, 'mf_button', function() {
                MainMenu.music.stop();
                game.state.start('game_missfortune');
            }, this, 1, 0, 2, 0);*/

            /*buttons.add(hecarimbutton);
            buttons.add(missfortunebutton);*/
            buttons.add(sonabutton);


            this.mutebutton = game.add.text(game.width-150, 0, "Mute Music", { font: "24px Arial", fill: "#ffffff"});
            this.mutebutton.inputEnabled = true;
            this.mutebutton.input.useHandCursor = true;
            this.mutebutton.events.onInputDown.add(function() {
                if(game.sound.mute) {
                    game.sound.mute = false;
                } else {
                    game.sound.mute = true;
                }
            }, this);
        },
        update: function() {
            //cloud respawn
            if(this.cloud1.x > game.width) {
                this.cloud1.x = 0 - this.cloud1.width;
            }
            if(this.cloud2.x > game.width) {
                this.cloud2.x = 0  - this.cloud1.width;
            }
            this.cloud1.body.velocity.y = Math.cos(this.cloud1.x/40)* 5;
            this.cloud2.body.velocity.y = Math.cos(this.cloud2.x/35)* 5;
            this.logo.body.velocity.y = (Math.cos(game.time.now/400) *40)*0.25;
        },
        render: function() {

        }
    };
    var Boot = {
        preload: function() {
            game.load.image('loadingbar', 'assets/loadingbar.png');

            game.load.audio('mainmenumusic', 'assets/sound/sound1.ogg');
            //game.load.audio('sound2', 'assets/sound/sound2.mp3');
            //game.load.audio('sound3', 'assets/sound/sound3.mp3');
            game.load.audio('sound4', 'assets/sound/sound4.ogg');
        },
        create: function() {
            var text = game.add.text(game.width/2, game.height/2, "Decoding audio\nPlease wait...", { font: "48px Arial", fill: "#ffffff", align: "center" });
            text.anchor.set(0.5);
        },
        update: function() {
            if (this.cache.isSoundDecoded('mainmenumusic') && this.cache.isSoundDecoded('sound4'))
            {
                game.state.start('mainmenu');
            }
        }
    };

    game.state.add('game_hecarim', HecarimGame);
    game.state.add('game_missfortune', MissFortuneGame);
    game.state.add('game_sona', SonaGame);
    game.state.add('game_sona_difficulty', SonaDifficultySelect);
    game.state.add('mainmenu', MainMenu);
    game.state.add('boot', Boot);

    game.state.start('boot');

};