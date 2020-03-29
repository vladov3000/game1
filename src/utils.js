export var center = {
	x:400,
	y:300
}

export function getRelPos(object, client) {
	return {x:object.x-client.x+center.x,
    		y:object.y-client.y+center.y};

}

export function getMousePos(canvas, evt, scale) {
	// get mouse position on canvas relative to center

	var rect = canvas.getBoundingClientRect(), // abs. size of element
	scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
	scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

	return {
		x: (evt.clientX - rect.left) * scaleX - center.x * scale,   
		y: (evt.clientY - rect.top) * scaleY - center.y * scale
	}
}

export function getImage(path) {
	let img = new Image();
	img.src = path;
	return img;
}