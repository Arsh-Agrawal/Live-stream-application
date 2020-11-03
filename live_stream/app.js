const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.set("view options", {layout: false});

//sokcets connection

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(response);

const port = process.env.PORT || 3000;

server.listen(port, err => {
    console.log(err || 'Listening on port ' + port);
});


// users = [];
// connections = [];

// io.sockets.on('connection', function(socket){
// 	//new connection

// 	connections.push(socket);
// 	console.log('Connected: %s sockets connected', connections.length );

// 	//disconnect
// 	socket.on('disconnect',function(data)
// 	{
// 		// if(socket.username) return;
// 		users.splice(users.indexOf(socket.username),1);
// 		updateUsernames();
// 		connections.splice(connections.indexOf(socket),1);
// 		console.log('Disconnected: %s sockets connected', connections.length);
// 	});

// 	// send messages
// 	socket.on('send message', function(data){
// 	    console.log(data);
// 		io.sockets.emit('new_message', {msg:data, user: socket.username});
// 	});

// 	//new user
// 	socket.on('new user',function(data,callback){
// 		callback(true);
// 		socket.username = data;
// 		users.push(socket.username);
// 		updateUsernames();
// 	});

// 	socket.on('show_chat',function(data,callback)
// 	{
// 		callback(true);
// 		console.log(data);
// 	});

// 	function updateUsernames(){
// 		io.sockets.emit('get_users',users);
// 	}

// });