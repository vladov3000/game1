import { getRelPos } from './utils.js'
import { line, circle, rectangle } from './draw.js'

// Define sprites
var playerSprite = new Image();
playerSprite.src = './src/sprites/space_shooter_assets/PNG/playerShip1_orange.png';

export function renderPlayer(player, client, ctx, scale) {
    let absLoc = getRelPos(player,client)

    /* Circle render
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
	}, player.radius*scale, player.type);*/

	//ctx.translate(-client.x, -client.y);
	//ctx.rotate(player.gunAngle);
	ctx.scale(player.radius * 2 / playerSprite.width, player.radius * 2 / playerSprite.height);

	ctx.drawImage(playerSprite, player.x, player.y);

	ctx.scale(playerSprite.width / (2 * player.radius), playerSprite.height / (2 * player.radius));
	//ctx.rotate(-player.gunAngle);
	//ctx.translate(client.x, client.y);
}

export function renderBullet(bullet, client, context, scale) {
    let absLoc = getRelPos(bullet, client);
	circle(context,
    	{x:(absLoc.x),
    	y:(absLoc.y)
    },bullet.radius,'yellow');
}

export function renderEnemy(enemy, client, context, scale) {
	let absLoc = getRelPos(enemy, client);
	rectangle(context,
		{x:(absLoc.x),
    	y:(absLoc.y)},
    	enemy.width,
    	enemy.height)
}