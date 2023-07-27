
import {createClient, RedisClientOptions, RedisClientType, RedisFunctions, RedisModules, RedisScripts} from 'redis'

export default class Redis {
  redisClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts>
  constructor(options?:RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>){
    this.redisClient = createClient(options)
    return this
  }
  connect(){
    return this.redisClient.connect()
  }
  async set(val:any, key=`${Date.now()}`){
    if( !this.redisClient ) throw new Error("redis client has not been initialized.")
    await this.redisClient.set(key, val)
    return {key, val}
  }
  async get(key:string){
    if( !this.redisClient ) throw new Error("redis client has not been initialized.")
    const val = await this.redisClient.get(key)
    return {key, val}
  }
  async hset(map:string, key:string, val:any){
    if( !this.redisClient ) throw new Error("redis client has not been initialized.")
    await this.redisClient.hSet(map, key, val)
    return {map, key, val}
  }
  async hget(map:string, key:string){
    if( !this.redisClient ) throw new Error("redis client has not been initialized.")
    const val = await this.redisClient.hGet(map, key)
    return {map, key, val}
  }
  async hmap(map:string){
    if( !this.redisClient ) throw new Error("redis client has not been initialized.")
    const rows = await this.redisClient.hGetAll(map)
    return {map, rows}
  }
  close(){
    if( !this.redisClient ) throw new Error("redis client has not been initialized.")
    return this.redisClient.quit()
  }
  isOpen(){
    return this.redisClient.isOpen
  }
}