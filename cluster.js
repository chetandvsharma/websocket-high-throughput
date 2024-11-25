import cluster from "cluster";
import os from "os";
import { startWebSocketServer } from "./websocket.js";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited`);
  });
} else {
  console.log(`Worker ${process.pid} starting WebSocket server`);
  startWebSocketServer();
}

// import cluster from 'cluster';
// import os from 'os';
// import { startWebSocketServer } from './websocket.js';

// if (cluster.isPrimary) {
//   const numCPUs = os.cpus().length;
//   console.log(`Master ${process.pid} is running`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker) => {
//     console.log(`Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });
// } else {
//   console.log(`Worker ${process.pid} started`);
//   startWebSocketServer();
// }
