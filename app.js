// Connect to the WebSocket server
const socket = new WebSocket('ws://localhost:9001');

// Select the messages container
const messagesContainer = document.getElementById('messages');

// Handle incoming messages
socket.onmessage = (event) => {
    const message = JSON.parse(event.data);  // Assuming the server sends JSON data
    displayMessage(message);
};

let messageCount = 0;
const maxMessages = 100;  // Limit to the latest 100 messages

// Function to display message in the UI
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
        ID : <strong>${message.id}</strong>
        <strong>${message.name}</strong> (${message.position})<br>
        <em>${message.email}</em><br>
        Age: ${message.age}, Work Experience: ${message.workExperience} years
    `;
    
    // Prepend the new message
    messagesContainer.prepend(messageElement);
    messageCount++;

    // Remove old messages if the limit is reached
    if (messageCount > maxMessages) {
        messagesContainer.removeChild(messagesContainer.lastChild);
        messageCount--;
    }
}
