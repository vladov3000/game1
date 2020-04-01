exports.onBulletCollision = function (bullet, obj2) {
	if (obj2.health) {
		bullet.death = -1;
		obj2.health -= 10;
		console.log(`Hit ${obj2.class} down to`, obj2.health);
	}
}