"use strict";
var config = {
    address: '192.168.219.175', // python udp 서버 주소
    port: 9050, // 접속 포트
};
var socket = new java.net.DatagramSocket();
var address = java.net.InetAddress.getByName(config.address);
var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 65535);

var getBytes = function (str) { return new java.lang.String(str).getBytes(); };
var inPacket = new java.net.DatagramPacket(buffer, buffer.length);
var sendMessage = function (event, data) {
    var bytes = getBytes(JSON.stringify({ event: event, data: data }));
    var outPacket = new java.net.DatagramPacket(bytes, bytes.length, address, config.port);    
    socket.send(outPacket);
};
var sendReply = function (session, success, data) {
    var bytes = getBytes(JSON.stringify({ session: session, success: success, data: data }));
    var outPacket = new java.net.DatagramPacket(bytes, bytes.length, address, config.port);
    socket.send(outPacket);
};

var handleMessage = function (msg) {  
    var _a;
    var _b = JSON.parse(decodeURIComponent(msg)), event = _b.event, data = _b.data, session = _b.session;

    switch (event) {
        case 'response':
            Api.replyRoom(data.room, data.rescon);
            break;
        default:
          break;
    }
};

var send = function (msg) {
    sendMessage('chat', {
        room: msg.room,
        content: msg.msg,
        sender: msg.sender,
        isGroupChat: '',
        profileImage: '',
        packageName: '',
    });
};
var response = function (room, msg, sender, isGroupChat, _, imageDB, packageName) 
{ 
  return send(
  { 
    room: room, 
    msg: msg, 
    sender: sender, 
    isGroupChat: '', 
    imageDB: '', 
    packageName: '' }); };
// @ts-ignore
var thread = new java.lang.Thread({
    run: function () {
        while (true) {
          try{
            socket.receive(inPacket);
            handleMessage(String(new java.lang.String(inPacket.getData(), inPacket.getOffset(), inPacket.getLength())));
          } catch(e){
            Log.e(e);
          }
        }
    },
});
var onStartCompile = function () { return thread.interrupt(); };
thread.start();


// 출처 : https://velog.io/@whrod/mebot-kakao1
