let { init, Sprite, GameLoop, load, setImagePath, imageAssets, SpriteSheet, initPointer, onPointerDown, } = kontra

let { canvas } = init();
initPointer();

function jump(){
  var j = [
    'C6 e',
  ];
  var ac = typeof AudioContext !== 'undefined' ? new AudioContext : new webkitAudioContext;
  // set the playback tempo (120 beats per minute)
  var tempo = 120;

  j = new TinyMusic.Sequence( ac, tempo, j );
  j.loop = false;
  j.smoothing = .1;
  j.play();
}

function ost(scene){
  var playing = [
        'C5 h',
        'D5 q',
        'E5 q',
        'D5 q',
        'C5 q',
        'B4 q',
        'C5 q',
        'D5 h',
        'E5 q',
        'D5 q',
        'E5 q',
        'F5 q',
        'E5 e',
        'D5 e',

  ];
  var end = [
    '-   e',
    'D5  e',
    'E5  e',
    'D5  e',
    'Cb4 e',
    'C5  e',
    'B4  e',
    'Gb4 e',

    'D4  e',
    'C4  e',
    'Fb4 e',
    'E4  e',
    'G4  e',
    'F4  e',
    'E4  q',

    '-   e',
    'D5  e',
    'E5  e',
    'D5  e',
    'Cb4 e',
    'C5  e',
    'B4  e',
    'Gb4 e',

    'D4  e',
    'C4  e',
    'Fb4 e',
    'E4  e',
    'G4  e',
    'F4  e',
    'E4  q'

  ];
  if(scene == 'game'){
    // create a new Web Audio API context
    var ac = typeof AudioContext !== 'undefined' ? new AudioContext : new webkitAudioContext;
    // set the playback tempo (120 beats per minute)
    var tempo = 120;

    sequence1 = new TinyMusic.Sequence( ac, tempo, playing );
    sequence1.loop = true;
    sequence1.smoothing = .1;
    sequence1.play();
  } else if(scene == 'end'){
    sequence1.stop();
    // create a new Web Audio API context
    var ac = typeof AudioContext !== 'undefined' ? new AudioContext : new webkitAudioContext;

    // set the playback tempo (120 beats per minute)
    var tempo = 120;
    end = new TinyMusic.Sequence( ac, tempo, end );
    end.loop = true;
    end.smoothing = .1;
    end.play();
  }
}

let start = false;
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
  draw('Game Over', 4, 'red', 50, 100);
  draw('Points ' + points.toString(), 4, 'red', 65, 150);
  draw('Click to try again', 2, 'black', 55, 200);
}

function end(){
  draw('A game made', 1.5, 'purple', 10, 10);
  draw('by jAlvarez', 1.5, 'purple', 15, 20);
}

function begin(){
  draw('Meadow', 4, 'yellow', 70, 100);
  draw('click to start', 2, 'orange', 75, 220);
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
  'empAnim.png',
  'oScene.png',
  'eScene.png'
).then(function(assets) {

  // all assets have loaded

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
      y: Math.floor( Math.random() * (canvas.height - 50) ) + 16,
      dx: 2,
      width: 16,
      height: 16,
      anchor: {x: 0.5, y: 0.5},
      animations: batSheet.animations,
    }),
    Sprite({
      x: 30,
      y: Math.floor( Math.random() * (canvas.height - 50) ) + 16,
      dx: 2.5,
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
      if( !start ){
        background.image = imageAssets['oScene'];
        begin();
      } else {
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
              enemy.y = Math.floor( Math.random() * (canvas.height - 50) ) + 16;
            }
            points ++;
            // Changes location depending on score
            if(points == 10 && enemy.x < -19) {
              background.image = imageAssets['gBack'];
              floor.forEach( function(tile){
                tile.animations = gFloorSheet.animations;
              });
            } else if( points == 20 && enemy.x < -19) {
              background.image = imageAssets['mBack'];
              floor.forEach( function(tile){
                tile.animations = mFloorSheet.animations;
              });
            } else if( points == 30 && enemy.x < -19) {
              background.image = imageAssets['eScene'];
              end();
              player.width = 0;
              enemies.forEach(function(en){
                en.width = 0;
                en.dx = 0;
              })
              floor.forEach( function(tile){
                tile.width = 0;
                tile.height = 0; //line not nessesary
              });
              health.forEach(function(life){
                life.width = 0;
                life.height = 0; //line not nessesary
              });
            }
            console.log('points', points); //line not nessesary
          }



          // Bat collision detection

          if( enemy.x - enemy.width/2 < player.x && enemy.x + enemy.width/2 > player.x - player.width ){
            if( enemy.y - enemy.height/2 < player.y && enemy.y + enemy.height/2 > player.y - player.height){
              let life = hits -1;
              health[life].animations = empSheet.animations;
              hits -= 1;
              enemy.x = -20;
              if(enemy.animations.fly ){
                enemy.y = Math.floor( Math.random() * (canvas.height - 50) ) + 16;
              } else {
                enemy.dx = Math.floor( Math.random() * 1.5) + 1;
              };
            }
          }
        });
        player.update();

        // Pushes player down like gravity
        gravity(player);
      }

      onPointerDown(function(e, object) {
        // Starts game
        if(!start){
          start = true;
          background.image = imageAssets['back'];
          ost('game');
        }
        // Restart after dying
        if(hits === 0){
          hits = 3;
          points = 0;
          background.image = imageAssets['back'];
          floor.forEach(function(tile){
            tile.animations = floorSheet.animations;
          });
          loop.start();
          health.forEach(function(life){
            life.animations = healthSheet.animations;
          });
        }

        // gravity logic
        if( player.y - grav.velocity > canvas.height -50 ){
          grav.velocity = -8;
          player.y += grav.velocity;
          jump();
        }
      });


    },
    render: function() { // render the game state
      if(!start){
        background.render();
        begin();
      } else {
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
          enemies.forEach(function(enemy){
            enemy.x = -20;
          });
          gameOver();
        } else if(points==30){
          end();
          ost('end');
          loop.stop();
        }
      }
    }
  });

loop.start();    // start the game
}).catch(function(err) {

});
