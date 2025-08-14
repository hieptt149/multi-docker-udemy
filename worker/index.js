import keys from "./keys.js";
import { createClient } from "redis";

const redisClient = createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
});
await redisClient.connect();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

(async () => {
  const redisPublisher = redisClient.duplicate();
  await redisPublisher.connect();

  redisPublisher.subscribe("insert", async (message) => {
    const value = fib(parseInt(message));
    await redisClient.hSet("values", message, value);
  });
})().catch((err) => console.error("Redis connection error:", err));
