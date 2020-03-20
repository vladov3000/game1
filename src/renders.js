import { getAbsLoc } from './utils.js'
import { line, circle } from './draw.js'

var gunLen = 25

export function renderPlayer(player, client, context, scale) {
	let rgAngle = player.gunAngle/360*2*Math.PI;
    let absLoc = getAbsLoc(player,client)

	line(context,{
		x:(absLoc.x)*scale,
		y:(absLoc.y)*scale
	},{
		x:(absLoc.x+gunLen*Math.cos(rgAngle))*scale,
		y:(absLoc.y+gunLen*Math.sin(rgAngle))*scale
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