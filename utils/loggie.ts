import { configure, getLogger, Logger } from 'log4js'
import { resolve } from 'path'

const options: any = {
  appenders: {
    // dev: { type: "dateFile", filename: resolve(process.cwd(), "logs", "geo"), pattern: "yyyy-MM-dd.log", alwaysIncludePattern: true }, 
    dev: { type: "console" },
    prd: { type: "dateFile", filename: resolve(process.cwd(), "logs", "geo"), pattern: "yyyy-MM-dd.log", alwaysIncludePattern: true }
  },
  categories: {
    default: { appenders: ["prd"], level: "info" },
    dev: { appenders: ["dev"], level: "debug" },
    prd: { appenders: ["prd"], level: "info" },
  }
}
configure(options)
export function getLoggie(category: string = "default"): Logger {
  return getLogger(category)
}