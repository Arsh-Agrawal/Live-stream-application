const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');

app.use(ignoreFavicon);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//routes for streaming
const num_users = {}

app.get('/', (req, res) => {
    let roomId = uuidv4();
    return res.redirect(`/${roomId}`);
});

app.get('/:room', (req, res) => {

    let roomId = req.params.room;

    if( (roomId in num_users) ){
        return res.render('room', { roomId: req.params.room, userCreatedRoom: '0'})
    }
    else{
        return res.render('room', { roomId: req.params.room, userCreatedRoom: '1'})
    }
    
});


//sockets

//bug to resolve
    //if the creater of the room leaves then the streaming needs to be closed
    //need to be tested

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        
        if(!(roomId in num_users)){
            num_users[roomId] = 1;
        }
        else{
            num_users[roomId]++;
        }
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            num_users[roomId]--;
            if(num_users[roomId] == 0){
                delete num_users[roomId];
            }
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        })

    });
})


const port = process.env.PORT || 3000;

server.listen(port, err => {
    console.log(err || "listening on port " + port);
});

function ignoreFavicon(req, res, next) {
    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
        return res.sendStatus(204);
    }
    
    return next();
}
