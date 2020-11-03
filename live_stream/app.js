const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//routes for streaming

app.get('/', (req, res) => {
    let roomId = uuidv4();
    res.redirect(`/${roomId}`)
});

app.get('/:rooom', (req, res) => {
    res.render('room', { roomId: req.params.room })
});


//sockets

io.on('connection', socket => {
    socket.on('join room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user disconnected', userID);
        })
    });
})


const port = process.env.PORT || 3000;

server.listen(port, err => {
    console.log(err || "listening on port " + port);
});
