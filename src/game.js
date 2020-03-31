import { renderPlayer, renderBullet } from './renders.js';
import { getMousePos } from './utils.js';
import { line, circle } from './draw.js'

var socket = io();

// get components
var gameArea = document.getElementById('gameArea');
var sendButton = document.getElementById("sendButton");
var chat = document.getElementById("chat")
var chatInputArea = document.getElementById("chatInputArea");
var chatInput = document.getElementById("chatInput");
var canvas = document.getElementById('canvas');
var messages = document.getElementById("messages");
var usernameInput = document.getElementById("usernameInput");
var onEnter = document.getElementById("onEnter");
var classSelector = document.getElementById("classSelector");
var body = document.getElementsByTagName("BODY")[0];
var submitOnEnter = document.getElementById("submitOnEnter");
var deathScreen = document.getElementById("deathScreen");

// set component fields
chat.style.display = "none";
body.onresize = resizeGame;
submitOnEnter.onclick = startGame;

// set general vars
var scale = canvas.width/800;
var context = canvas.getContext('2d');
var movement = {
  up: false,
  down: false,
  left: false,
  right: false,
  facing: 0,
  fire: false
}
var socketid = '';
var client = {};


function resizeGame() {
	// keep constant game size

    var widthToHeight = 4 / 3;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }
    
    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    
    var gameCanvas = document.getElementById('canvas');
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
    scale = gameCanvas.width/800;
}
resizeGame()

function startChat () {
	// reveal chat and add send, load, and submit socket emitters

	chat.style.display = "block";

	function sendMessage(){
		socket.emit('sendMessage',chatInput.value.trim());
		chatInput.value = "";
	}

	chatInput.onkeydown = function(event) {
	    if (event.keyCode == 13) {
	    	if (chatInput.value.trim()!=""){
	        	sendMessage();
	    	} else {
	    		chatIput.value = "";
	    	}
	    }
	}

	socket.on ('loadMessage',function(data){
		let para = document.createElement("p");
		para.className = "message";
		let text = document.createTextNode(data);
		para.appendChild(text);
		messages.prepend(para);
	});
}

function keyToMove() {
	// map keyboard inputs to movement and make movement emitter

	document.addEventListener('keydown', function(event) {
		if(chatInput != document.activeElement){
			switch (event.keyCode) {
			    case 65: // A
			     	movement.left = true;
			     	break;
			    case 87: // W
			     	movement.up = true;
			      	break;
			    case 68: // D
			      	movement.right = true;
			      	break;
			    case 83: // S
			      	movement.down = true;
			      	break;
			}
		}
	});

	document.addEventListener('keyup', function(event) {
	  	switch (event.keyCode) {
		    case 65: // A
		      movement.left = false;
		      break;
		    case 87: // W
		      movement.up = false;
		      break;
		    case 68: // D
		      movement.right = false;
		      break;
		    case 83: // S
		      movement.down = false;
		      break;
	  	}
	});

	document.addEventListener('mousemove', function(e) {
		let point = getMousePos(canvas, e, scale);
        movement.facing = Math.atan(point.y / point.x);
        if (point.x < 0) movement.facing += Math.PI;
    });

    document.addEventListener('mousedown', function(e) {
    	movement.fire = true;
    });

    document.addEventListener('mouseup', function(e) {
    	movement.fire = false;
    });

	setInterval(function() {
	  socket.emit('movement', movement);
	}, 1000 / 60);
}

function addPlayer() {
	// tell server to add new player

	socket.emit('new player',[usernameInput.value,classSelector.value]);

	socket.on('socketid',function(data){
		socketid = data;
		console.log('socketid: '+socketid)
	});
}

function renderGameObjects(gameObjects) {
  	context.clearRect(0, 0, canvas.width, canvas.height);

	var players = gameObjects.players;
	if (players[socketid]) client = players[socketid];
	var bullets = gameObjects.bullets;

	//render bullets
    for (var bullet of bullets) {
    	renderBullet(bullet, client, context, scale)
    }

	//render players
	for (var id in players) {
		renderPlayer(players[id], client, context, scale)
	}
}

function onDeath(data) {
	console.log('client died');
	deathScreen.style.visibility = 'visible';
}

function startGame(){
	// remove start menu ui
	onEnter.parentNode.removeChild(onEnter);

	// add player on server
	addPlayer();

	// setup movement through keyboard inputs
	keyToMove();

	// setup chat
	startChat();

	// render gameObjects recieved from server
	socket.on('state', renderGameObjects);

	// handle death
	socket.on('death', onDeath);
}






