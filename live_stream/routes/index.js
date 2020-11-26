const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');


//need to access num_users from sockets in app.js



router.get('/', (req, res) => {
    let roomId = uuidv4();
    return res.redirect(`/${roomId}`);
});

router.get('/users',(req,res) =>{
    console.log("asked users");
    let num_users = global.num_users;
    res.send({
        "num_users" : num_users 
    });
});

router.get('/:room', (req, res) => {
    let num_users = global.num_users;
    let roomId = req.params.room;
    console.log('here');

    if( (roomId in num_users) ){
        return res.render('room', { roomId: roomId, userCreatedRoom: '0'})
    }
    else{
        return res.render('room', { roomId: roomId, userCreatedRoom: '1'})
    }
    
});


module.exports = router;