export function line(context,a,b,width,color='grey'){
	context.strokeStyle = color;
	context.lineWidth = width;
	context.beginPath();
    context.moveTo(a.x,a.y)
    context.lineTo(b.x,b.y)
    context.stroke()
    context.closePath();
}

export function circle(context,center,radius,color='green') {
	context.fillStyle = color;
	context.beginPath();
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
}

export function rectangle(context, center, w, h, color='orange') {
	context.fillStyle = color;
	context.beginPath();
    context.rect(center.x, center.y, w, h);
    context.fill();
    context.closePath();
}