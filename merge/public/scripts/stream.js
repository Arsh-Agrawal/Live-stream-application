// const url = 'localhost:3000/'+ROOM_ID;
// console.log(url);

const socket = io('/localhost:3000');
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})


//user is the new user and my refers to yourself

//not to access everyones cam only the ones who joined
const peers = {};

console.log('trainer = ' + TRAINER);

if (TRAINER == "1") {
  console.log('in trainer');
  const myVideo = document.createElement('video')
  myVideo.muted = true
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    addVideoStream(myVideo, stream)


    socket.on('user-connected', userId => {
      sendTrainerStream(userId, stream)
    })
  }).catch(err =>{
      console.log(err);
      //show a pop asking to provide camera acess
  })
}
else {
  console.log('not in trainer');
  const userVideo = document.createElement('video');
  userVideo.muted = true;
  acceptStream(userVideo);
}


socket.on('user-disconnected', userId => {
  if (peers[userId]) {
    peers[userId].close();
    delete peers[userId];
  }
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})


//code change required
function sendTrainerStream(userId, stream) {
  const call = myPeer.call(userId, stream) //sending our A/V stream to user

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

function acceptStream(video) {
  myPeer.on('call', call => {
    call.answer();
    call.on('stream',stream =>{
      addVideoStream(video, stream);
    })
  })
}