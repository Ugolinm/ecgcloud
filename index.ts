import { GeoHttpServer } from 'geo.servers'
import { getDefaultConf } from './config'
import { ConfigOptions } from './config/interface'
import { router } from './router'
import { CONF_OPTIONS } from './utils/constants'
import { _G_VAR_GET } from './utils/global'

export function launch(){
  return new Promise((resolve,reject)=>{
    const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
    new GeoHttpServer( options?.server?.http ).config( router ).start((err: any)=>{
      if( err ) reject(err)
      else resolve(`Http Server [ Ecgcloud ] started @port=${options?.server?.http?.port}`)
    })
  })
}