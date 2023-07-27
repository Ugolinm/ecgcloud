import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { ConfigOptions } from "./interface";

/**
 * system default configuration
 * @returns 
 */
export function getDefaultConf(): ConfigOptions | any {
  return {
    log_category: "dev",
    database: {
      host: "localhost",
      port: 3316,
      user: "root",
      password: "123456",
      database: "ecgcloud"
    },
    dirs: {
      cache: "/Users/sunnandi/dumps/temps/cache",
      dat: "/Users/sunnandi/dumps/temps/dat",
      image: "/Users/sunnandi/dumps/temps/images",
      report: "/Users/sunnandi/dumps/temps/reports",
    },
    server: {
      http: {
        port: 8080,
        cors: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "user-id, user-token, content-type",
          "Access-Control-Allow-Methods": "POST, GET",
        }
      },
      required_fields: [],
      access_frequency: 1000,
      userinfo_expire: 1000 * 60 // authorize
    }
  }
}

/**
 * read a configuration file and convert it into JSON
 * @param path 
 * @returns json
 */
export function loadConf(path: string): ConfigOptions {
  let buff: any
  try {
    if (existsSync(resolve(path))) buff = readFileSync(resolve(path))
  } catch (ex) {
    throw new Error(`Error when reading ${path} cuz ${ex?.message || ex}`)
  }
  if (!buff) throw new Error(`No configuration readed from ${path}`)
  let json: any
  try {
    json = JSON.parse(buff?.toString())
  } catch (ex) {
    throw new Error(`Error when parsing string into JSON which is: ${buff?.toString()}`)
  }
  if (!json) throw new Error(`Invalid json which is null`)

  return json
}