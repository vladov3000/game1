function updateGameObjects(gameObjects) {
	updateBullets(gameObjects.bullets);
}

function updateBullets(bullets) {
	let i = 0
    for (i = 0; i < bullets.length; i++) {
	    let bullet = bullets[i];
	    bullet.x += bulletv*Math.cos(bullet.travangle);
	    bullet.y += bulletv*Math.sin(bullet.travangle);
	    bullet.death -= 1;

	    if (bullet.death < 0){
	      bullets.splice(i,1);
	    }
  	}
}

exports.updateGameObjects = updateGameObjects;