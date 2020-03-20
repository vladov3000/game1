var hash = require('object-hash');
var updateUtils = require('./updateUtils');
var circleCollision = updateUtils.circleCollision;
var calculateCollisions = updateUtils.calculateCollisions;

exports.updateGameObjects = function (gameObjects) {
	calculateCollisions(gameObjects);
	updateBullets(gameObjects);
}

function updateBullets(gameObjects) {
	let bullets = gameObjects.bullets;
    for (i = 0; i < bullets.length; i++) {
	    let bullet = bullets[i];

	    // move bullet
	    bullet.x += bulletv*Math.cos(bullet.travangle);
	    bullet.y += bulletv*Math.sin(bullet.travangle);

	    // handle collisions
	    /*for (id in gameObjects.players) {
	    	if (circleCollision(gameObjects.players[id], bullet)) {
	    		gameObjects.players[id].health -= 10;
	    		bullets.splice(i,1);
	    	}
	    }*/

	    // update bullet timer
	    bullet.death -= 1;
	    if (bullet.death < 0){
	      bullets.splice(i,1);
	    }
  	}
}