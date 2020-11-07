const path = require('path'),
      express = require('express'),
      app = express(),
      server = require('http').Server(app),
      io = require('socket.io')(server),
      {v4: uuidv4} = require('uuid');

require('dotenv').config({ path: path.join(__dirname, '.env') });

app.use(ignoreFavicon);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));



app.get('/', (req, res) => {
    let roomId = uuidv4();
    res.redirect(`/${roomId}`)
});

app.get("/:room", (req, res) => {
    res.render('../views/room.ejs');
});

users = [];

io.on('connection', function(socket) {
   console.log('A user connected');
   socket.on('setUsername', function(data) {
      console.log(data);
      
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
         socket.emit('userSet', {username: data});
      }
   });
   
   socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })
});

// io.on('connection', socket => {
//     console.log("user connected");
//     socket.on('join-room', (roomId, userId) => {
//         socket.join(roomId);
//         socket.to(roomId).broadcast.emit("User-connected", userId);

//         socket.on("disconnect", () => {
//             socket.to(roomId).broadcast.emit("user-disconnected", userId);
//             console.log("A user disconnected");
//         })


//     });
// })


const port = process.env.PORT || 3030
server.listen(port, err => {
    console.log(err || "listening on port: " + port);
});

function ignoreFavicon(req, res, next) {
   if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
       return res.sendStatus(204);
   }
   
   return next();
}