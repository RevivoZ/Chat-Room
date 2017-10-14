var socket = io();
var chat;
var nickName;
var publicChat;

window.onload = function(){
  $('#nickName').focus();
}
function _send(event){
  if (event== null || event.keyCode == 13){
  nickName = document.getElementById('nickName').value;
  document.body.innerHTML = '<input type="text" id="msg" onkeypress="newMsg(event)"><input type="button" id="send" value="send" onclick="newMsg()"><div id="publicChat"></div>';
  publicChat = document.getElementById('publicChat');
 socket.emit('nickName' , nickName );
  socket.emit('newMsg' , {user : nickName , msg : ' Is In'})
  $('#msg').focus();
}
}


socket.on('someOneSaid' , function (data){
  console.log('fds');
  var _public = document.getElementById('publicChat');
  _public.innerHTML += 'some One Said :  ' + data +"</br>";
})
socket.on('globalMsg' , function (data){
  var x = document.createElement('div');
  x.innerHTML = '<h2>' + data.user + ' : ' + data.msg + '</h2>';
  publicChat.appendChild(x);
})

function newMsg(event){
  var msg = document.getElementById('msg');
  if(msg.value != '' && event.keyCode == 13){
  socket.emit('newMsg' , {user : nickName , msg : msg.value})
  msg.value = '';
};
}
