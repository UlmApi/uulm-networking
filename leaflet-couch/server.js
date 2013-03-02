var express = require('express');
var io = require('socket.io');

var app = express();
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

var server = require('http').createServer(app);
io = io.listen(server);


io.sockets.on('connection', function (socket) {
	socket.emit('connection');

/*
	socket.on('pull', function (data){
		socket.emit('push', [{
			day: "Fri", 
			name: "Fri", 
			lat: 48.40783887047417,
			lon: 9.987516403198242
		}]);
	});
*/
});


server.listen(process.env.PORT || 3000, function() {
	console.log('Listening on port ' + server.address().port);
});
