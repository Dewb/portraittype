var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 80;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/'));

io.on('connection', function (socket) {

  socket.on('typing', function (data) {
    console.log(JSON.stringify(data));
    socket.broadcast.emit('typing', data);
  });

  socket.on('finish', function () {
    socket.broadcast.emit('finish');
  });

  socket.on('disconnect', function () {
  });
});
