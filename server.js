var express = require('express');  
var app = express();
var http = require('http').Server(app);
var socketIo = require('socket.io');
var io = socketIo(http);

var userArr = [];
var userObj = { username:"", ip:"", port:"" };

var port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log('Server listening at port %d', port);
});

//app.use(express.static(__dirname + '/node_modules')); 
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/init', function (req, res) {
  res.sendFile(__dirname + '/views/init.html');
});

app.get('/recv', function (req, res) {
  res.sendFile(__dirname + '/views/recv.html');
});


//Allow Cross Domain Requests
//io.set('transports', [ 'websocket' ]);

//ENABLE CORS
//app.all('/', function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  next();
// });

//io.set('origins', 'https://cpinheir-webrtc-init.glitch.me/:*');

io.on('connection', function (socket) {
  //io.sockets.emit('broadcast message', { broadcast: 'msg' });
  console.log("CLIENT CONNECTED");
  console.log('New connection from ' + socket.request.connection.remoteAddress + ':' + socket.request.connection.remotePort);
  
  //socket.emit('allusers', { users: userArr });
    
  socket.on('register', function (data) {
    userArr.push({ username: data.username, ip:socket.request.connection.remoteAddress, port:socket.request.connection.remotePort });
    io.sockets.emit('allusers', { users: userArr });
  });
  
  socket.on('initcall', function (data) { 
    //broadcast init sigstring, because not sure how to send to a specific client. only specific recv user will act on it.
    io.sockets.emit('initsigstr', { inituser: data.inituser, recvuser: data.recvuser, sigstr: data.sigstr });
  });
  
  socket.on('acceptcall', function (data) { 
    //broadcast recv sigstring, because not sure how to send to a specific client. only specific init user will act on it.
    io.sockets.emit('recvsigstr', { inituser: data.inituser, recvuser: data.recvuser, sigstr: data.sigstr });
  });
  
  socket.on('disconnect', function () {
    console.log("CLIENT DISCONNECTED");
    console.log('New connection from ' + socket.request.connection.remoteAddress + ':' + socket.request.connection.remotePort);
  });
  
});

////


// listen for requests :)
//app.listen(8080);
