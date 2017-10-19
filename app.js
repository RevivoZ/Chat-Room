var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv, {});
var users = [];
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
serv.listen(2000);

console.log('server Started');


io.sockets.on('connection', function (socket) {
	console.log('new user');

	socket.on('nickName', function (data) {
		for (i = 0; i < users.length; i++) {
			if (users[i][0] == data) {
				socket.emit('userInUse', data);
				return;
			}
		}
		users.push([data, socket.id]);
		console.log(users);
		socket.emit('_connect');

		io.sockets.emit('globalMsg', {
			user: data,
			msg: ' Is Connected !'
		})

		io.sockets.emit('online_users', users);
		console.log(socket.name + ' Is Connected !');
	})

	socket.on('newMsg', function (data) {
		console.log('new Mgs from ' + data.user + '<br>' + 'and the msg is : ' + data.msg);
		io.sockets.emit('globalMsg', data)
	})

	socket.on('userSaid', function (data) {
		console.log(' someOneSaid ' + data.value);
		io.sockets.emit('someOneSaid', data.value);
	})

	socket.on('Disconnect', function (data) {
		for (i = 0; i < users.length; i++) {
			if (users[i][0] == data) {
				io.sockets.emit('online_users', users);
				io.sockets.emit('globalMsg', {
					user: users[i][0],
					msg: ' Is Disconnected !'
				})
				users.splice(i, 1);
			}

		}

	})

});
