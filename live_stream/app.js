const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');


app.use(ignoreFavicon);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/',routes);



global.num_users = {};
// global.num_users["arsh"] = 5;

//sockets

//bug to resolve
    //if the creater of the room leaves then the streaming needs to be closed
    //need to be tested

io.on('connection', socket => {
    console.log('connected');
    socket.on('join-room', (roomId, userId) => {
        console.log('joined');
        // console.log(roomId+" "+ userId);
        if(!(roomId in global.num_users)){
            global.num_users[roomId] = 1;
        }
        else{
            global.num_users[roomId]++;
        }
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            global.num_users[roomId]--;
            if(global.num_users[roomId] == 0){
                delete global.num_users[roomId];
            }
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });

    });

})


//server

const port = process.env.PORT || 3000;

server.listen(port, err => {
    console.log(err || "listening on port " + port);
});


//middleware functions

function ignoreFavicon(req, res, next) {
    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
        return res.sendStatus(204);
    }
    
    return next();
}
