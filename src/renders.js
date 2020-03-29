import { getRelPos, getImage } from './utils.js'
import { line, circle } from './draw.js'

// Get sprites
var playerSprite = getImage('./src/sprites/player/idle/idle0.png');
var backgroundSprite = getImage('./src/sprites/backgrounds/Demoscr2.png');

export function renderPlayer(player, client, ctx, scale) {
    let relPos = getRelPos(player,client);
    relPos = {
    	x: relPos.x - player.w / 2,
    	y: relPos.y - player.h / 2
    }

    /* Geometry based rendering
	line(context, relPos,{
		x:(relPos.x+player.gunLen*Math.cos(player.gunAngle)),
		y:(relPos.y+player.gunLen*Math.sin(player.gunAngle))
	}, player.gunWidth);

	circle(context, relPos, player.radius, player.type);
	*/

	/* Attempt to scale image manually to preserve crispness
	var canvData = ctx.getImageData(relPos.x, relPos.y, player.w * scale, player.h * scale);
	ctx.drawImage(playerSprite, relPos.x, relPos.y);
	
	var imgData = ctx.getImageData(relPos.x, relPos.y, playerSprite.width, playerSprite.height);
	var pixelWidth = player.w * scale / playerSprite.width

	let i;
	for (i = 0; i < canvData.data.length; i += 1) {
		canvData.data[i] = imgData.data[Math.floor(i / pixelWidth)];
		console.log(canvData.data[i]);     // r
	}

	ctx.putImageData(canvData, relPos.x, relPos.y);*/

	ctx.drawImage(playerSprite, relPos.x, relPos.y, player.w, player.h);
}

export function renderBullet(bullet, client, context, scale) {
    let relPos = getRelPos(bullet, client);
	circle(context, relPos, bullet.radius, 'yellow');
}

export function renderBackground(client, ctx, scale) {
	let relPos = getRelPos({x: 0, y: 0}, client);
	ctx.drawImage(backgroundSprite, relPos.x, relPos.y, 800, 600);
}