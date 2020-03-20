var center = {
	x:400,
	y:300
}

export function getAbsLoc(object, client) {
	return {x:object.x-client.x+center.x,
    		y:object.y-client.y+center.y};

}