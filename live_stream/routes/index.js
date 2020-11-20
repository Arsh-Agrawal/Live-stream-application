const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');


//need to access num_users from sockets in app.js

router.get('/', (req, res) => {
    let roomId = uuidv4();
    return res.redirect(`/${roomId}`);
});

router.get('/users',() =>{
    return num_users;
})

router.get('/:room', (req, res) => {

    let roomId = req.params.room;

    if( (roomId in num_users) ){
        return res.render('room', { roomId: req.params.room, userCreatedRoom: '0'})
    }
    else{
        return res.render('room', { roomId: req.params.room, userCreatedRoom: '1'})
    }
    
});


module.exports = router;