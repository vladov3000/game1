var updateUtils = require('./updateUtils');
var objectId = updateUtils.objectId;
var calculateCollisions = updateUtils.calculateCollisions;

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

    if (data.fire && player.reload < 0) {
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

    player.reload -= 1;
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

function onBulletCollision(bullet, obj2) {
	if (obj2.health) {
		bullet.death = -1;
		obj2.health -= 10;
		console.log(`Hit ${obj2.class} down to`, obj2.health);
	}
}