import Redis from 'ioredis';

const redisClient = new Redis(); // Connect to Redis

async function consumeMessages() {
  while (true) {
    const message = await redisClient.brpop('messageQueue', 0); // Blocking pop
    console.log('Consumed message:', JSON.parse(message[1])); // Parse and log
  }
}

consumeMessages().catch((err) => {
  console.error('Error consuming messages:', err);
});
