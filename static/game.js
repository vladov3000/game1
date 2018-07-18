var socket = io();
var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
document.addEventListener('keydown', function(event) {
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

socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var sendButton = document.getElementById("sendButton");
var chatInputArea = document.getElementById("chatInputArea");
var chatInput = document.getElementById("chatInput");
var canvas = document.getElementById('canvas');
var scale = canvas.width/800;
var messages = document.getElementById("messages");

function sendMessage(){
	socket.emit('sendMessage',chatInput.value);
	chatInput.value = "";
}

chatInput.onkeydown = function(event) {
    if (event.keyCode == 13) {
        sendMessage();
    }
}

socket.on ('loadMessage',function(data){
	console.log(data)
	var para = document.createElement("p");
	para.className = "message";
	var text = document.createTextNode(data);
	para.appendChild(text);
	messages.prepend(para);
});

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

var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x*scale, player.y*scale, 10*scale, 0, 2 * Math.PI);
    context.fill();
  }
});





