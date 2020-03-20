// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/src', express.static(__dirname + '/src'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'src/index.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});
// Add the WebSocket handlers
io.on('connection', function(socket) {
});

var gameObjects = {
  players:{},
  bullets:[]
};

/* make a test bullet
gameObjects.bullets.push({
  travangle:2,
  x:300,
  y:300
});
*/

rev = 360;
rspeed = 10;
bulletv = 10;
reloadtime = 10;
io.on('connection', function(socket) {

  socket.on('new player', function(data) {
    gameObjects.players[socket.id] = {
      x: 300,
      y: 300,
      gunAngle: 0,
      username: data[0],
      type: data[1],
      reload: 0
    }
    console.log(gameObjects.players[socket.id]);

    io.sockets.emit('loadMessage', gameObjects.players[socket.id].username + ' has joined');
    socket.emit('socketid',socket.id)
  });

  socket.on('movement', function(data) {
    var player = gameObjects.players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
    if (data.rleft) {
      player.gunAngle -= rspeed;
      //console.log('rleft');
    }
    if (data.rright) {
      player.gunAngle += rspeed;
      //console.log('rright');
    };
    player.gunAngle %= rev
    //console.log(player.gunAngle);
    if (player.reload < 0){
      gameObjects.bullets.push({
          travangle:player.gunAngle * Math.PI/180,
          x:player.x,
          y:player.y,
          death: 120
      });
      player.reload = reloadtime;
    } else {
      player.reload -= 1;
    }
  });

  socket.on('sendMessage', function(data){
  	//console.log('['+gameObjects.players[socket.id].username+']: '+data);
  	io.sockets.emit('loadMessage', '['+gameObjects.players[socket.id].username+']: '+data);
  });
});

//update game state
setInterval(function() {
  for (i=0; i<gameObjects.bullets.length; i++){
    bullet = gameObjects.bullets[i];
    bullet.x += bulletv*Math.cos(bullet.travangle);
    bullet.y += bulletv*Math.sin(bullet.travangle);
    bullet.death -= 1;
    if (bullet.death < 0){
      gameObjects.bullets.splice(i,1);
    }
  }
  //console.log(gameObjects.bullets);
}, 1000 / 60);

setInterval(function() {
  io.sockets.emit('state', gameObjects);
}, 1000 / 60);

io.on('connection', function(socket) {
  // other handlers ...
  socket.on('disconnect', function() {
    // remove disconnected player
    delete gameObjects.players[socket.id];
  });
});