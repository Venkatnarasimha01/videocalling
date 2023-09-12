const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messages = document.getElementById('messages');

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
    ],
};

const peerConnection = new RTCPeerConnection(configuration);

// Code for setting up the local camera stream
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        localVideo.srcObject = stream;
        peerConnection.addStream(stream);
    })
    .catch(error => console.error('getUserMedia error:', error));

// Code for creating a data channel and setting up event listeners
const dataChannel = peerConnection.createDataChannel('chat');

dataChannel.onopen = event => {
    console.log('Data Channel opened.');
};

dataChannel.onmessage = event => {
    const message = event.data;
    displayMessage('Remote: ' + message);
};

// Code for creating an offer
peerConnection.createOffer()
    .then(offer => peerConnection.setLocalDescription(offer))
    .then(() => {
        // Send the offer to a signaling server
        // (This part would require a server implementation)
    })
    .catch(error => console.error('Error creating offer:', error));

// Handle incoming messages
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    displayMessage('You: ' + message);
    dataChannel.send(message);
    messageInput.value = '';
});

// Display messages in the chat container
function displayMessage(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
}
