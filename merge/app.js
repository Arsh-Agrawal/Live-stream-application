const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const app = express();
const axios = require('axios');

const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');

require('dotenv').config({ path: path.join(__dirname, '.env') });

app.use(ignoreFavicon);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res) => {
    let roomId = uuidv4();
    return res.redirect(`/${roomId}`);
 });

 app.get('/:room',(req,res) => {
    let roomId = req.params.room;

    axios.get('localhost:3000/users')
        .then(num_users =>{
            console.log(num_users);

            if( (roomId in num_users) ){
                return res.render('room', { roomId: roomId, userCreatedRoom: '0'})
            }
            else{
                return res.render('room', { roomId: roomId, userCreatedRoom: '1'})
            }
        })
        .catch(err =>{
            console.log(err);
        });

});

 const port = process.env.PORT || 4000;

server.listen(port, err => {
    console.log(err || "listening on port " + port);
});



function ignoreFavicon(req, res, next) {
    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
        return res.sendStatus(204);
    }
    
    return next();
}
