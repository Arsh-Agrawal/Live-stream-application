const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');
const bodyParser = require('body-parser');


require('dotenv').config({ path: path.join(__dirname, '.env') });

app.use(ignoreFavicon);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/',routes);



global.rooms = {};
const user_name = {};


//sockets

io.on('connection', socket => {
   socket.on('new-user', (room, name) => {
     socket.join(room);
     user_name[socket] = {name : name , room : room};
     console.log(user_name[socket]);
     socket.to(room).broadcast.emit('user-connected', name);
   })
   socket.on('send-chat-message', (room, message) => {
     socket.to(room).broadcast.emit('chat-message', { message: message, name: user_name[socket] });
   })
   socket.on('disconnect', () => {
      const roomID = user_name[socket].room;
      delete user_name[socket];

      socket.to(roomID).broadcast.emit('user-disconnected', user_name[socket]) ;
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