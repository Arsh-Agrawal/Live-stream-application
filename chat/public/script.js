const socket2 = io('localhost:3030') 
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

if (messageForm != null) {
  const name = prompt('What is your name?')
  appendMessage('You joined')
  // socket.emit('new-user', roomId, name)
  socket2.emit('join-room', ROOMID, name)

  //trigger whenever send in the chat button clicked
  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket2.emit('send-chat-message', message);
    messageInput.value = '';
  })
}

socket2.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket2.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket2.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

//function to append message into the chat container/box.
// Basically it creates new div each time like: "<div><% message %></div>" 
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}