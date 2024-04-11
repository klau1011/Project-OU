import { Redis } from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_CONNECTION_STR) {
    return process.env.REDIS_CONNECTION_STR;
  }
  throw new Error("REDIS_CONNECTION_STR not defined");
};

export const redis = new Redis(getRedisUrl());
