import { getAbsLoc } from './utils.js'
import { line, circle } from './draw.js'

var gunLen = 25

export function renderPlayer(player, client, context, scale) {
    let absLoc = getAbsLoc(player,client)

	line(context,{
		x:(absLoc.x)*scale,
		y:(absLoc.y)*scale
	},{
		x:(absLoc.x+gunLen*Math.cos(player.gunAngle))*scale,
		y:(absLoc.y+gunLen*Math.sin(player.gunAngle))*scale
	}, 10*scale);

	circle(context,{
		x:(absLoc.x)*scale,
		y:(absLoc.y)*scale
	}, 10*scale, player.type);
}

export function renderBullet(bullet, client, context, scale) {
    let absLoc = getAbsLoc(bullet, client);
	circle(context,
    	{x:(absLoc.x)*scale,
    	y:(absLoc.y)*scale
    },5*scale,'yellow');
}