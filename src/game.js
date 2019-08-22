let { init, Sprite, GameLoop, load, setImagePath, imageAssets, SpriteSheet, initPointer, onPointerDown, } = kontra

let { canvas } = init();
initPointer();

let points = 0;
let hits = 3;

var grav = {
  force : .3,
  velocity: 0,
}

function gravity(thing){
  if( thing.y < canvas.height - 16 && thing.y + grav.velocity < canvas.height -16 ){
    grav.velocity += grav.force;
    thing.y += grav.velocity;
  } else if(thing.y + grav.velocity >= canvas.height - 16){
    thing.y = canvas.height -16;
  }
};

function gameOver(){
  console.log("Game Over");
  draw('Game Over', 4, 'red');
}

setImagePath('./img');
load(
  'back.png',
  'gBack.png',
  'mBack.png',
  'floorAnim.png',
  'gFloorAnim.png',
  'mFloorAnim.png',
  'bunAnim.png',
  'batAnim.png',
  'beastAnim.png',
  'heartAnim.png',
  'empAnim.png'
).then(function(assets) {

  // all assets have loaded
  for( var i = 0; i<assets.length; i++){
    console.log(assets[i].src);
  }

  let batSheet = SpriteSheet({
    image: imageAssets['batAnim'],

    frameWidth: 8,
    frameHeight: 8,
    animations: {
      // create a named animation: fly
      fly: {
        frames: '0..1',  // frames 0 through 9
        frameRate: 5
      }
    }
  });

  let beastSheet = SpriteSheet({
    image: imageAssets['beastAnim'],

    frameWidth: 8,
    frameHeight: 8,
    animations: {
      stomp: {
        frames: '0..1',  // frames 0 through 9
        frameRate: 5
      }
    }
  });

  let enemies = [
    Sprite({
      x: 10,
      y: Math.floor( Math.random() * (canvas.height - 32) ) + 16,
      dx: 1.5,
      width: 16,
      height: 16,
      anchor: {x: 0.5, y: 0.5},
      animations: batSheet.animations,
    }),
    Sprite({
      x: 10,
      y: canvas.height - 24,
      dx: 1,
      width: 16,
      height: 16,
      anchor: {x: 0.5, y: 0.5},
      animations: beastSheet.animations,
    })
  ]

  let background = Sprite({
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    image: imageAssets['back']
  });

  let playerSheet = SpriteSheet({
    image: imageAssets['bunAnim'],


    frameWidth: 8,
    frameHeight: 8,
    animations: {
      // create a named animation: walk
      walk: {
        frames: '0..1',  // frames 0 through 9
        frameRate: 5
      }
    }
  });

  let player = Sprite({
    x: canvas.width,
    y: canvas.height - 16,
    width: 16,
    height: 16,
    anchor: {x: 1, y: 1},
    animations: playerSheet.animations,
  });

  let mFloorSheet = SpriteSheet({
    image: imageAssets['mFloorAnim'],
    frameWidth: 8,
    frameHeight: 8,
    animations: {
      walk: {
        frames: '0..1',
        frameRate: 3
      }
    }
  });

  let gFloorSheet = SpriteSheet({
      image: imageAssets['gFloorAnim'],
      frameWidth: 8,
      frameHeight: 8,
      animations: {
        walk: {
          frames: '0..1',
          frameRate: 3
        }
      }
    });

  let floorSheet = SpriteSheet({
    image: imageAssets['floorAnim'],


    frameWidth: 8,
    frameHeight: 8,
    animations: {
      // create a named animation: walk
      walk: {
        frames: '0..1',  // frames 0 through 9
        frameRate: 3
      }
    }

  });

  let floor = [
    Sprite({
      x: 0,
      y: canvas.height,
      width: canvas.width/3,
      height: 16,
      anchor: {x: 0, y: 1},
      animations: floorSheet.animations,

    }),
    Sprite({
      x: canvas.width/3,
      y: canvas.height,
      width: canvas.width/3,
      height: 16,
      anchor: {x: 0, y: 1},
      animations: floorSheet.animations,

    }),
    Sprite({
      x: 2 * canvas.width/3,
      y: canvas.height,
      width: canvas.width/3,
      height: 16,
      anchor: {x: 0, y: 1},
      animations: floorSheet.animations,

    }),
  ];

  let healthSheet = SpriteSheet({
    image: imageAssets['heartAnim'],
    frameWidth: 8,
    frameHeight: 8,
    animations: {
      // create a named animation: walk
        glint: {
        frames: '0..1',  // frames 0 through 9
        frameRate: 3
      }
    }
  });

  let empSheet = SpriteSheet({
    image: imageAssets['empAnim'],
    frameWidth: 8,
    frameHeight: 8,
    animations: {
      // create a named animation: walk
        glint: {
        frames: '0..1',  // frames 0 through 9
        frameRate: 3
      }
    }
  });

  let health = [
    Sprite({
      x: 10,
      y: 5,
      width: 16,
      height: 16,
      anchor: {x: 0, y: 0},
      animations: healthSheet.animations
    }),
      Sprite({
        x: 34,
        y: 5,
        width: 16,
        height: 16,
        anchor: {x: 0, y: 0},
        animations: healthSheet.animations
    }),
      Sprite({
        x: 58,
        y: 5,
        width: 16,
        height: 16,
        anchor: {x: 0, y: 0},
        animations: healthSheet.animations
    }),
  ]

  let loop = GameLoop({  // create the main game loop
    update: function() { // update the game state
      health.forEach( function(life){
        life.update();
      });
      background.update();
      floor.forEach( function(tile){
        tile.update();
      });
      enemies.forEach(function(enemy){
        enemy.update();
        // wrap the sprites position when it reaches
        // the edge of the screen
        if (enemy.x > canvas.width) {
          enemy.x = -20;
          if(enemy.animations.fly){
            enemy.y = Math.floor( Math.random() * (canvas.height - 32) ) + 16;
          }
          points ++;
          // Changes location depending on score
          if(points == 1 && enemy.x < -19) {
            background.image = imageAssets['gBack'];
            floor.forEach( function(tile){
              tile.animations = gFloorSheet.animations;
            });
          } else if( points == 2 && enemy.x < -19) {
            background.image = imageAssets['mBack'];
            floor.forEach( function(tile){
              tile.animations = mFloorSheet.animations;
            });
          }
          console.log('points', points);
        }



        // Bat collision detection

        if( enemy.x - enemy.width/2 < player.x && enemy.x + enemy.width/2 > player.x - player.width ){
          if( enemy.y - enemy.height/2 < player.y && enemy.y + enemy.height/2 > player.y - player.height){
            let life = hits -1;
            health[life].animations = empSheet.animations;
            hits -= 1;
            enemy.x = -20;
            if(enemy.animations === batSheet.animations){
              enemy.y = Math.floor( Math.random() * (canvas.height - 32) ) + 16;
            };
          }
        }
      });
      player.update();

      // Pushes player down like gravity
      gravity(player);

      onPointerDown(function(e, object) {
        // handle pointer down
        if( player.y - grav.velocity > canvas.height -50 ){
          grav.velocity = -8;
          player.y += grav.velocity;
        }
      });

    },
    render: function() { // render the game state
      background.render();
      floor.forEach( function(tile){
        tile.render();
      });
      enemies.forEach(function(enemy){
        enemy.render();
      });
      player.render();
      health.forEach(function(life){
        life.render();
      });
      if(hits === 0){
        loop.stop();
        gameOver();
      }
    }
  });

loop.start();    // start the game
}).catch(function(err) {
  // error loading an asset
  console.log(err);
});
