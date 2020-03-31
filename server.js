// Local imports
var updates = require('./updates.js');
var updateGameObjects = updates.updateGameObjects;
var updatePlayer = updates.updatePlayer;


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

// 
function sendMessageToClients(author, text) {
  console.log(`[${author}]: ${text}`);
  io.sockets.emit('loadMessage', `[${author}]: ${text}`);
}

io.on('connection', function(socket) {

  socket.on('new player', function(data) {
    gameObjects.players[socket.id] = {
      class: 'player',
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
    // update player state based on their movement
    updatePlayer(data, socket.id, gameObjects);
  });

  socket.on('sendMessage', function(data){
    sendMessageToClients(gameObjects.players[socket.id].username, data);
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
      sendMessageToClients('Server', `${gameObjects.players[socketid].username} has died`)
      delete gameObjects.players[socketid];
    }
  }
}, 1000 / 60);

// send information to clients
setInterval(function() {
  io.sockets.emit('state', gameObjects);
}, 1000 / 60);
