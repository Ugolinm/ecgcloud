import { accessSync, mkdirSync } from "fs"

/**
 * create dir when not exists
 * @param path 
 */
 export function mkdirIfNotExist( path: string ){
  try {
    accessSync( path )
  } catch (file_exist_err) {
    mkdirSync(path, { recursive: true })
  }
}