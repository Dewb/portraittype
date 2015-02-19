var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 9999;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/'));

io.on('connection', function (socket) {

  socket.on('new message', function (data) {
    socket.broadcast.emit('new message', {
      message: data
    });
  });

  socket.on('disconnect', function () {
  });
});
