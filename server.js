// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});
// Add the WebSocket handlers
io.on('connection', function(socket) {
});

var players = {};
rev = 360;
rspeed = 10;
io.on('connection', function(socket) {

  socket.on('new player', function(data) {
    players[socket.id] = {
      x: 300,
      y: 300,
      gunAngle: 0,
      username: data[0],
      type: data[1]
    };
    console.log(players[socket.id]);

    io.sockets.emit('loadMessage', players[socket.id].username+' has joined');
    socket.emit('socketid',socket.id)
  });

  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
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
  });

  socket.on('sendMessage', function(data){
  	//console.log('['+players[socket.id].username+']: '+data);
  	io.sockets.emit('loadMessage', '['+players[socket.id].username+']: '+data);
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

io.on('connection', function(socket) {
  // other handlers ...
  socket.on('disconnect', function() {
    // remove disconnected player
    delete players[socket.id];
  });
});