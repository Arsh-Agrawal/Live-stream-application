const router = require("express").Router();
const {v4: uuidv4} = require('uuid');

//need to access rooms variable

router.get('/', (req, res) => {
    res.render ('index');
 });
 
 router.post('/room', (req, res) => {
 
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
 });
 
 router.get("/:roomId", (req, res) => {
 
    //check if the room exists
    if(rooms[req.params.roomId] == null){
       console.log("room does not exist!!");
       return res.redirect('/')
    }
 
    res.render('room', {roomId: req.params.roomId})
});


module.exports = router;