const router = require("express").Router();
const {v4: uuidv4} = require('uuid');

//need to access rooms variable

router.get('/', (req, res) => {
   let roomId = uuidv4();
   return res.redirect(`/${roomId}`);
 });

 
 router.get("/:room", (req, res) => {
 
    //check if the room exists
   let num_users = global.num_users;
   let roomId = req.params.room;
   
   if( (roomId in num_users) ){
      return res.render('room', { roomId: roomId, userCreatedRoom: '0'})
   }
   else{
         return res.render('room', { roomId: roomId, userCreatedRoom: '1'})
   }
  
});


module.exports = router;