window.onload = function() {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

    function preload () {
        game.load.image('char', 'assets/char.png');
        game.load.image('charmf', 'assets/charmf.png');
        game.load.image('block', 'assets/block.png');
        game.load.image('barrel', 'assets/barrel.png');
        game.load.image('bg', 'assets/background objects/background.png');
        game.load.image('pine', 'assets/background objects/pinetree.png');
        game.load.image('tileset', 'assets/tilset.png');
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    }

    var player;
    var facing = 'left';
    var jumpTimer = 0;
    var cursors;
    var jumpButton;
    var crtlbtn;
    var bg;
    var map;
    var layer;

    function create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        bg = game.add.tileSprite(0, 0, game.width, game.height, 'bg');
        bg.fixedToCamera = true;

        game.physics.arcade.gravity.y = 400;

        /*for(var i = 0; i<1000; i++) {
            var sprite = game.add.sprite(game.rnd.realInRange(0, game.width - 168), game.rnd.realInRange(0, game.height - 280), 'pine');
            scale = game.rnd.realInRange(0.5, 1.5);
            sprite.scale.x = scale;
            sprite.scale.y = scale;
        }*/

        map = game.add.tilemap('map');
        map.addTilesetImage('tileset', 'tileset');
        map.addTilesetImage('pinetree', 'pine');

        map.createFromObjects('pines', 3, 'pine');

        layer = map.createLayer('layer1');

        map.setCollisionByExclusion([]);

        layer.resizeWorld();

        player = game.add.sprite(110, 96, 'char');
        game.physics.enable(player, Phaser.Physics.ARCADE);

        player.body.bounce.y = 0.1;
        player.body.collideWorldBounds = true;
        player.body.setSize(60, 71, 15, 15);

        player.anchor.set(0.5);

        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);


        cursors = game.input.keyboard.createCursorKeys();
        crtlbtn = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    }

    function update() {
        game.physics.arcade.collide(player, layer);

        player.body.velocity.x = 0;

        /*if (cursors.up.isDown)
        {
            player.body.velocity.y = -200;
        }
        else if (cursors.down.isDown)
        {
            player.body.velocity.y = 200;
        }*/

        if (cursors.left.isDown)
        {
            if(crtlbtn.isDown) {
                player.body.velocity.x = -700;
            } else {
                player.body.velocity.x = -200;
            }
            player.scale.x = -1;
        }
        if (cursors.right.isDown)
        {
            if(crtlbtn.isDown) {
                player.body.velocity.x = 700;
            } else {
                player.body.velocity.x = 200;
            }
            player.scale.x = 1;
        }


        if (jumpButton.isDown && player.body.onFloor())
        {
            player.body.velocity.y = -400;
        }

    }

    function render () {
        /*game.debug.text(game.time.physicsElapsed, 32, 32);
        game.debug.body(player);
        game.debug.bodyInfo(player, 16, 24);
*/
    }

};