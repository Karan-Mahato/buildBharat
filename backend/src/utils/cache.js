import redisClient from "../config/redis.js";

export async function getCache(key){
    try{
        const val = await redisClient.get(key);
        return val ? JSON.parse(val) : null;
    } catch(err){
        console.log("Redis GET error",err);
        return null;
    }
}

export async function setCache(key, value, ttl=86400){
    try{
        await redisClient.set(key, JSON.stringify(value), "EX", ttl);
    } catch(err){
        console.log("Redis Cache set error", err);
    }
}