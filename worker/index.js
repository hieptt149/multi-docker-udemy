import keys from "./keys.js";
import redis from "redis";

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

redisClient.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});

redisClient.subscribe("insert");
