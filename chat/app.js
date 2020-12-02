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

global.num_users = {};


//ALL NEW
io.on('connection', socket => {
   console.log('connected');
   socket.on('join-room', (room, name) => {
      console.log("joined");
      // console.log(name + ' joined to room id: '+ room);
      // console.log(roomId+" "+ userId);
      if(!(room in global.num_users)){
         global.num_users[room] = 1;
      }
      else{
         global.num_users[room]++;
      }
      socket.join(room);
      socket.to(room).broadcast.emit('user-connected', name);

      socket.on('send-chat-message', message => {
         console.log(message);
         socket.to(room).broadcast.emit('chat-message', { message: message, name: name });
      });

      socket.on('disconnect', () => {
         global.num_users[room]--;
         if(global.num_users[room] == 0){
            delete global.num_users[room];
         }
         socket.to(room).broadcast.emit('user-disconnected', name);
      });
   });
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
   console.log(err || "listening on port " + port);
});