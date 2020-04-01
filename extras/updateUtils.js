function flattenGameObjects (gameObjects) {
	let output = Object.values(gameObjects.players);
	for (key of Object.keys(gameObjects)) {
		if (key != "players")
		if (Object.keys(gameObjects[key]).length > 0) output = output.concat(gameObjects[key]);
	}
	return output
}

// copied from https://stackoverflow.com/questions/1997661/unique-object-identifier-in-javascript
var __next_objid = 1;
function objectId(obj) {
    if (obj==null) return null;
    if (obj.__obj_id==null) obj.__obj_id=__next_objid++;
    return obj.__obj_id;
}
exports.objectId = objectId;

exports.calculateCollisions = function (gameObjects) {
	var flatGameObjects = flattenGameObjects(gameObjects);
	var collisions = {};
	
	for (obj1 of flatGameObjects) {
		for (obj2 of flatGameObjects) {
			if (objectId(obj1) == objectId(obj2)) continue;
			
			if (obj1.x && obj1.x && obj1.radius && obj2.x && obj2.y && obj2.radius) {
				if (circleCollision(obj1, obj2)) {
					key1 = objectId(obj1);

					if (!collisions[key1]) collisions[key1] = [];
					collisions[key1].push(obj2);
				}
			}
		}
	}

	return collisions;
}

function circleCollision (c1, c2) {
	return Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2) <= Math.pow(c1.radius + c2.radius, 2);
}