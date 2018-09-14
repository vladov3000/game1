var socket = io();

var sendButton = document.getElementById("sendButton");
var chat = document.getElementById("chat")
var chatInputArea = document.getElementById("chatInputArea");
var chatInput = document.getElementById("chatInput");
var canvas = document.getElementById('canvas');
var scale = canvas.width/800;
var messages = document.getElementById("messages");
var usernameInput = document.getElementById("usernameInput");
var onEnter = document.getElementById("onEnter");
var classSelector = document.getElementById("classSelector");

var movement = {
  up: false,
  down: false,
  left: false,
  right: false,
  rright: false,
  rleft: false,
}
var socketid = '';
var center = {
	x:400,
	y:300
}
rev=360;
gunLen=25;

chat.style.display = "none";

function resizeGame() {
    var gameArea = document.getElementById('gameArea');
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

function startGame(){
	//console.log(username);

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
			    case 81: //Q
			    	movement.rleft = true;
			    	break;
			    case 69: //E
			    	movement.rright = true;
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
		    case 81: //Q
		    	movement.rleft = false;
		    case 69: //E
			    movement.rright = false;
	  	}
	});

	socket.emit('new player',[usernameInput.value,classSelector.value]);

	socket.on('socketid',function(data){
		socketid = data;
		console.log('socketid: '+socketid)
	});

	onEnter.parentNode.removeChild(onEnter);

	setInterval(function() {
	  socket.emit('movement', movement);
	}, 1000 / 60);

	chat.style.display = "block";

	function sendMessage(){
		socket.emit('sendMessage',chatInput.value.trim());
		chatInput.value = "";
	}

	chatInput.onkeydown = function(event) {
	    if (event.keyCode == 13) {
	    	console.log(chatInput.value.trim())
	    	if (chatInput.value.trim()!=""){
	        	sendMessage();
	    	} else {
	    		chatIput.value = "";
	    	}
	    }
	}

	socket.on ('loadMessage',function(data){
		//console.log(data);
		var para = document.createElement("p");
		para.className = "message";
		var text = document.createTextNode(data);
		para.appendChild(text);
		messages.prepend(para);
	});

	function line(context,a,b,width,color='grey'){
		context.strokeStyle = color;
		context.lineWidth = width;
		context.beginPath();
	    context.moveTo(a.x,a.y)
	    context.lineTo(b.x,b.y)
	    context.stroke()
	    context.closePath();
	}

	function circle(context,center,radius,color='green') {
		context.beginPath();
	    context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	    context.fill();
	    context.closePath();
	}

	var context = canvas.getContext('2d');
	socket.on('state', function(players) {
	  context.clearRect(0, 0, canvas.width, canvas.height);
	  context.fillStyle = 'green';
	  var client = players[socketid]
	  for (var id in players) {
		    var player = players[id];
		    rgAngle = player.gunAngle/rev*2*Math.PI;
		    absLoc = {
		    	x:player.x-client.x+center.x,
		    	y:player.y-client.y+center.y
		    }

		    line(context,
		    	{x:(absLoc.x)*scale,
		    	y:(absLoc.y)*scale
		    },{x:(absLoc.x+gunLen*Math.cos(rgAngle))*scale,
		    	y:(absLoc.y+gunLen*Math.sin(rgAngle))*scale
		    }, 10*scale);


		    circle(context,
		    	{x:(absLoc.x)*scale,
		    	y:(absLoc.y)*scale
		    },10*scale);
	    }
	});
}






