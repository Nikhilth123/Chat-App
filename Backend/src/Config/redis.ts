import Redis from "ioredis";
import dotenv from "dotenv"
dotenv.config();

export const redis = new Redis({
  // host: process.env.REDIS_HOST,
  // port: Number(process.env.REDIS_PORT),
  // username: process.env.REDIS_USERNAME,
  // password:process.env.REDIS_PASSWORD,
  host:process.env.LOCAL_HOST_REDIS,
  port:Number(process.env.PORT),
});

redis.on("connect", () => {
  console.log("Redis connected ");
});     

redis.on("error", (err) => {
  console.log("Redis error ", err);
});