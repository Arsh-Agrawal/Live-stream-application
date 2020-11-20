const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');

require('dotenv').config({ path: path.join(__dirname, '.env') });
app.use(ignoreFavicon);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.user('/',routes);

const rooms = { }


//sockets

io.on('connection', socket => {
   socket.on('new-user', (room, name) => {
     socket.join(room);
     rooms[room].users[socket.id] = name;
     socket.to(room).broadcast.emit('user-connected', name);
   })
   socket.on('send-chat-message', (room, message) => {
     socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] });
   })
   socket.on('disconnect', () => {
      delete rooms[room].users[socket.id] ;
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id]) ;
   })
})
 
//functions

function ignoreFavicon(req, res, next) {
   if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
       return res.sendStatus(204);
   }
   
   return next();
}

//server

const port = process.env.PORT || 3030;

server.listen(port, err => {
    console.log(err || "listening on port: " + port);
});