const socket = io('http://localhost:3000')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: 'http://localhost:3000',
    port: '3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {

    addVideoStream(myVideo, stream);
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
    })
    
})



myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', () => {
        addVideoStream(video, stream)
    })
    call.on('close', () => {
        video.remove()
    })
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}