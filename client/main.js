var socket = io();
var chat;
var nickName;
var publicChat;
var onlineUsers = document.getElementById('onlineUsers');
var syst = document.getElementById('system');

window.onbeforeunload = function () {
	socket.emit('Disconnect', nickName);
}

window.onload = function () {
	$('#nickName').focus();
}

function _send(event) {
	if (event && event.keyCode != 13) {
		return;
	}
	nickName = document.getElementById('nickName').value;
	socket.emit('nickName', nickName);

	$('#msg').focus();
}

socket.on('_connect', function () {
	console.log("**********");
	document.getElementById('container').innerHTML = '<div id="publicChat"></div><input type="text" id="msg" onkeypress="newMsg(event)"><input type="button" id="send" value="send" onclick="newMsg()">';
	publicChat = document.getElementById('publicChat');
});

socket.on('userInUse', function (data) {
	syst.innerHTML = data + " Is Taken !";
});


socket.on('online_users', function (data) {
	console.log(data);
	onlineUsers.innerHTML = '';
	for (var i = 0; i < data.length; i++) {
		onlineUsers.innerHTML += '<p>' + data[i] + '</p>';
	}
});

socket.on('someOneSaid', function (data) {
	console.log('fds');
	var _public = document.getElementById('publicChat');
	_public.innerHTML += 'some One Said :  ' + data + "</br>";
});

socket.on('globalMsg', function (data) {
	var x = document.createElement('div');
	x.innerHTML = '<h2>' + data.user + ' : ' + data.msg + '</h2>';
	publicChat.appendChild(x);
	publicChat.scrollTop = publicChat.scrollHeight - publicChat.clientHeight;
});

function newMsg(event) {
	var msg = document.getElementById('msg');
	if (event && event.keyCode != 13 || msg.value.length == 0) {
		return;
	}

	socket.emit('newMsg', {
		user: nickName,
		msg: msg.value
	})
	msg.value = '';
}
