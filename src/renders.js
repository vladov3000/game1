import { getAbsLoc } from './utils.js'
import { line, circle } from './draw.js'

export function renderPlayer(player, client, context, scale) {
    let absLoc = getAbsLoc(player,client)

	line(context,{
		x:(absLoc.x)*scale,
		y:(absLoc.y)*scale
	},{
		x:(absLoc.x+player.gunLen*Math.cos(player.gunAngle))*scale,
		y:(absLoc.y+player.gunLen*Math.sin(player.gunAngle))*scale
	}, player.gunWidth*scale);

	circle(context,{
		x:(absLoc.x)*scale,
		y:(absLoc.y)*scale
	}, player.radius*scale, player.type);
}

export function renderBullet(bullet, client, context, scale) {
    let absLoc = getAbsLoc(bullet, client);
	circle(context,
    	{x:(absLoc.x)*scale,
    	y:(absLoc.y)*scale
    },bullet.radius*scale,'yellow');
}