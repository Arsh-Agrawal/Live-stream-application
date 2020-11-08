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
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }))

const rooms = { }

app.get('/', (req, res) => {
   res.render ('index')
});

// **************************
//        ALL ROUTS
// **************************
app.post('/room', (req, res) => {

   //check for roomId in params to join else make new roomID
   let roomId = req.body.roomId ? req.body.roomId : uuidv4();
   
   //check if the new room ID already exist
   if(req.body.roomId){
      res.redirect(roomId)
   } else {
      if(rooms[roomId] != null){
         console.log("room already exists!!");
         return res.redirect('/')
      }
      //making a new room haveing empty users object
      rooms[roomId] = { users: {} }

      res.redirect(roomId)
   }
})

app.get("/:roomId", (req, res) => {

   //check if the room exists
   if(rooms[req.params.roomId] == null){
      console.log("room does not exist!!");
      return res.redirect('/')
   }

   res.render('room', {roomId: req.params.roomId})
});


// **************************
//   ALL SOCKET CONNECTION 
// **************************
io.on('connection', socket => {
   socket.on('new-user', (room, name) => {
     socket.join(room)
     rooms[room].users[socket.id] = name
     socket.to(room).broadcast.emit('user-connected', name)
   })
   socket.on('send-chat-message', (room, message) => {
     socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
   })
   socket.on('disconnect', () => {
     getUserRooms(socket).forEach(room => {
       socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
       delete rooms[room].users[socket.id]
     })
   })
 })
 

// **************************
//         FUNCTIONS 
// **************************
const getUserRooms = (socket) => {
   // check all the room where the user is part of 
   return Object.entries(rooms).reduce((names, [name, room]) => {
      if(room.users[socket.id] != null) names.push(name)
      return names
   }, [])
}

function ignoreFavicon(req, res, next) {
   if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
       return res.sendStatus(204);
   }
   
   return next();
}


// **************************
//        NODE SERVER 
// **************************
const port = process.env.PORT || 3030
server.listen(port, err => {
    console.log(err || "listening on port: " + port);
});
