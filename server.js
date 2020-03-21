// Local imports
var updateGameObjects = require('./updates.js').updateGameObjects

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

// Init Game Objects
var gameObjects = {
  players:{},
  bullets:[]
};

// game vars
gunLen = 25;
bulletv = 10;
reloadtime = 20;

io.on('connection', function(socket) {

  socket.on('new player', function(data) {
    gameObjects.players[socket.id] = {
      class: 'destroyable/player',
      // position fields
      x: 300,
      y: 300,
      radius: 10,
      // player fields
      gunAngle: 0,
      gunLen: 25,
      gunWidth: 10,
      username: data[0],
      type: data[1],
      reload: 0,
      // destroyable fields
      health: 100
    }
    console.log(gameObjects.players[socket.id]);

    io.sockets.emit('loadMessage', gameObjects.players[socket.id].username + ' has joined');
    socket.emit('socketid', socket.id);
  });

  socket.on('movement', function(data) {
    let player = gameObjects.players[socket.id] || {};

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

    player.gunAngle = data.facing;

    if (data.fire && player.reload < 0) {
      gameObjects.bullets.push({
          class: 'bullet',
          // position fields
          x: player.x + gunLen*Math.cos(player.gunAngle),
          y: player.y + gunLen*Math.sin(player.gunAngle),
          radius: 5,
          // bullet fields
          travangle: player.gunAngle,
          death: 120
      });
      player.reload = reloadtime + 1;
    }

    player.reload -= 1;
  });

  socket.on('sendMessage', function(data){
  	console.log('['+gameObjects.players[socket.id].username+']: '+data);
  	io.sockets.emit('loadMessage', '['+gameObjects.players[socket.id].username+']: '+data);
  });

  socket.on('disconnect', function() {
    // remove disconnected player
    delete gameObjects.players[socket.id];
  });
});



//update game state
setInterval(function() {
  updateGameObjects(gameObjects);

  // handle player death
  for (socketid of Object.keys(gameObjects.players)) {
    if (gameObjects.players[socketid].health <= 0) {
      io.to(socketid).emit('death', '');
      delete gameObjects.players[socketid];
    }
  }
}, 1000 / 60);

// send information to clients
setInterval(function() {
  io.sockets.emit('state', gameObjects);
}, 1000 / 60);
