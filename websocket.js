import { WebSocketServer,WebSocket } from "ws"; // Correct import for ES Modules
import { createRandomData } from "./dataGenerator.js";
import Redis from "ioredis";

// Redis client for queuing messages
const redisClient = new Redis();

// Messages per second
const messagesPerSecond = 15000; // Target rate
const batchSize = 1000; // Number of messages per batch
const batchInterval = 1000 / (messagesPerSecond / batchSize); // Interval in ms
let messageCount = 0; // To track messages sent per second

// WebSocket Server
export function startWebSocketServer() {
  const port = 9001; // Port for the WebSocket server
  const wss = new WebSocketServer({ port });

  console.log(`WebSocket server running on ws://localhost:${port}`);

  // Handle new WebSocket connections
  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on('message', (message) => {
      console.log('Received message:', message);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
    });
  });

  // Generate random JSON data and push to Redis
  setInterval(() => {
    for (let i = 0; i < batchSize; i++) {
      const data = createRandomData(); // Generate random data

      // Push to Redis list (message queue)
      redisClient.rpush('messageQueue', JSON.stringify(data));

      // Send to connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
          messageCount++; // Increment counter
        }
      });
    }
  }, batchInterval);

  // Monitor messages per second
  setInterval(() => {
    // console.log(`Messages per second: ${messageCount}`);
    messageCount = 0; // Reset counter every second
  }, 1000);

  // redisClient.llen('messageQueue', (err, length) => {
  //   if (err) {
  //     console.error('Error checking Redis queue length:', err);
  //   } else {
  //     console.log(`Current queue length: ${length}`);
  //   }
  // });
  
  // // Fetch the first 10 items in the queue
  // redisClient.lrange('messageQueue', 0, 9, (err, messages) => {
  //   if (err) {
  //     console.error('Error fetching Redis queue items:', err);
  //   } else {
  //     console.log('First 10 messages in queue:', messages.map(msg => JSON.parse(msg)));
  //   }
  // });
}

// Error handling for Redis client
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});


// import uWS from 'uWebSockets.js'; // not in  NPM registry, installed from https://github.com/uNetworking/uWebSockets.js
// import { createRandomData } from './dataGenerator.js';
// import Redis from 'ioredis'; // Redis client for Node.js.

// const redisClient = new Redis(); // Connect to Redis

// export function startWebSocketServer() {
//   const port = 9001 + process.pid % 1000; // Assign unique port for each worker
//   const app = uWS.App();

//   app.ws('/*', {
//     open: (ws) => {
//       console.log('Connection opened');
//     },
//     message: (ws, message) => {
//       ws.send('Echo: ' + Buffer.from(message).toString());
//     },
//   });

//   setInterval(() => {
//     const data = createRandomData();
//     redisClient.lpush('messages', JSON.stringify(data)); // Push data to Redis
//   }, 10); // 10ms interval to generate messages

//   app.listen(port, (token) => {
//     if (token) {
//       console.log(`WebSocket server running on port ${port}`);
//     } else {
//       console.error('Failed to start server');
//     }
//   });
// }
