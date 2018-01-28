var socket = io();
var chat;
var nickName;
var publicChat;
var onlineUsers;
var syst = document.getElementById('system');
var Message;
var message_side = 'left';
var count = -1;

var favicon = new Favico({
	bgColor: '#5CB85C',
	animation: 'popFade'
});


window.onbeforeunload = function () {
	socket.emit('Disconnect', nickName);
}

window.onload = function () {
	document.getElementById('online_template').style.display = 'none';
	$('#nickName').focus();
}



var isActive = true;
$(window).focus(function () {
	isActive = true;
	count = 0;
	favicon.badge(0);
	changeTitle();
});
$(window).blur(function () {
	isActive = false;
	count = -1;
	changeTitle();
});


function changeTitle() {
	if (isActive) {
		return;
	}

	count++;
	favicon.badge(count);
}

function _send(event) {
	if (event && event.keyCode != 13) {
		return;
	}
	nickName = document.getElementById('nickName').value;
	socket.emit('nickName', nickName);
	console.log(nickName);

	$('#msg').focus();
}

function newMsg(event) {
	var msg = document.getElementById('message_input');
	if (event && event.keyCode != 13 || msg.value.length == 0) {
		return;
	}

	socket.emit('newMsg', {
		user: nickName,
		msg: msg.value
	})
	msg.value = '';
}



socket.on('_connect', function () {
	document.getElementById('container').innerHTML = '';
	document.body.innerHTML += '<div class="chat_window"><div class="top_menu"><div class="buttons"><div class="button close"></div><div class="button minimize"></div><div class="button maximize"></div></div><div class="title">Chat</div></div><ul class="messages"></ul><div class="bottom_wrapper clearfix"><div class="message_input_wrapper"><input id="message_input" class="message_input" onkeypress="newMsg(event)" placeholder="Type your message" /></div><div class="send_message"><div class="icon"></div><div class="text" onclick="newMsg()">Send</div></div></div></div>'

	publicChat = document.getElementsByClassName('messages')[0];

	var onlin = $($('.online_template').clone().html());

	document.getElementById('online_template').innerHTML = '';

	$('.chat_window').append(onlin);

	onlineUsers = document.getElementById('onlineUsers');

	$('#message_input').focus();
});

socket.on('userInUse', function (data) {
	syst.innerHTML = data + " Is Taken !";
});

socket.on('online_users', function (data) {
	onlineUsers.innerHTML = '';
	for (var i = 0; i < data.length; i++) {
		onlineUsers.innerHTML += '<p>' + data[i][0] + '</p>' + '<hr>';
	}
});

socket.on('globalMsg', function (data) {

	var message = new Message({
		text: '<b>' + data.user + '</b>' + ': ' + data.msg,
		message_side: data.user == nickName ? 'right' : 'left'
	});
	message.draw();

	publicChat.scrollTop = publicChat.scrollHeight - publicChat.clientHeight;

	changeTitle();
});



/****************************************************************/


// Message Template
Message = function (arg) {
	this.text = arg.text, this.message_side = arg.message_side;
	this.draw = function (_this) {
		return function () {
			var $message;
			$message = $($('.message_template').clone().html());
			$message.addClass(_this.message_side).find('.text').html(_this.text);
			$('.messages').append($message);
			return setTimeout(function () {
				return $message.addClass('appeared');
			}, 0);
		};
	}(this);
	return this;
};



socket.emit('test');
