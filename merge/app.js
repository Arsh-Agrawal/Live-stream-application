const express = require("express"),
      app = express(),
      path = require('path'),
      server = require('http').Server(app),
      {v4: uuidv4} = require('uuid');
 
app.use(ignoreFavicon);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
      
//routes for streaming
const num_users = {}

app.get('/', (req, res) => {
    let roomId = uuidv4();
    return res.redirect(`/${roomId}`);
})

app.get('/:room', (req, res) => {

    let roomId = req.params.room;

    if( (roomId in num_users) ){
        return res.render('room', { roomId: roomId, userCreatedRoom: '0'})
    }
    else{
        return res.render('room', { roomId: roomId, userCreatedRoom: '1'})
    }
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
