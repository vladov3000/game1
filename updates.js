var updateUtils = require('./updateUtils');
var objectId = updateUtils.objectId;
var calculateCollisions = updateUtils.calculateCollisions;

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
	if (obj2.class.includes("destroyable")) {
		bullet.death = -1;
		obj2.health -= 10;
		console.log("Hit player down to", obj2.health);
	}
}