// Imports
var updateUtils = require('./updateUtils');
var objectId = updateUtils.objectId;
var calculateCollisions = updateUtils.calculateCollisions;

var collisions = require('./collisions.js');
onBulletCollision = collisions.onBulletCollision;

// Update funcs
exports.updatePlayer = function (data, socketid, gameObjects) {
	let player = gameObjects.players[socketid] || {};

    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }

    player.gunAngle = data.facing;

    if (data.fire && player.reload <= 0 && !player.spectator) {
      gameObjects.bullets.push({
          class: 'bullet',
          // position fields
          x: player.x + gunLen*Math.cos(player.gunAngle),
          y: player.y + gunLen*Math.sin(player.gunAngle),
          radius: 5,
          // bullet fields
          travangle: player.gunAngle,
          death: 120
      });
      player.reload = reloadtime + 1;
    }

    if (--player.reload < 0) player.reload = 0;
}

exports.updateGameObjects = function (gameObjects) {
	collisions = calculateCollisions(gameObjects);
	updateBullets(gameObjects, collisions);
}

function updateBullets(gameObjects, collisions) {
	let bullets = gameObjects.bullets;
    for (i = 0; i < bullets.length; i++) {
	    let bullet = bullets[i];

	    // move bullet
	    bullet.x += bulletv*Math.cos(bullet.travangle);
	    bullet.y += bulletv*Math.sin(bullet.travangle);

	    // handle collisions
	    if (collisions[objectId(bullet)]) {
	    	for (obj of collisions[objectId(bullet)]) {
	    		onBulletCollision(bullet, obj)
	    	}
	    }

	    // update bullet timer
	    bullet.death -= 1;
	    if (bullet.death < 0){
	      bullets.splice(i,1);
	    }
  	}
}