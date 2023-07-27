import {Connection, createConnection, ConnectionConfig, createPool, Pool} from 'mysql'

export type Row = {
  [key: string]: any;
}
/**
 * Mysql instance
 * @param options connection configuration
 * @returns Mysql
 */
export function getMysql(options?:any){
  return new Mysql(options)
}

export default class Mysql {
  private options: ConnectionConfig
  private conn: Connection
  protected def_options = {
    host: "localhost",
    port: 3307,
    user: "root",
    password: "123456",
    database: "geostore"
  }
  constructor(options?:ConnectionConfig){
    if(!options) this.options = this.def_options
    else this.options = options
  }
  /**
   * disable pool mode
   */
  // disablePoolMode(){
  //   this.poolMode = false
  // }
  /**
   * manuallly connect
   * @returns Mysql
   */
  connect(){
    // if( this.poolMode ) this.conn = createPool( this.options )
    this.conn = createConnection( this.options )
    return this
  }
  /**
   * execution of sql
   * auto connect & closed after execution
   * @param options { sql, params }
   * @returns result
   */
  query(options: QueryOptions): Promise<any>{
    return new Promise((resolve,reject)=>{
      try{
        if( !this.conn ) this.connect()
        this.conn.query(options?.sql, options?.params, (err, results)=>{
          if( err ) reject( err )
          else resolve( results )
        })
      }catch(ex){
        reject( ex )
      }
      this.close()
    })
  }
  /**
   * multi-query
   * @param options [{ sql, params },...]
   * @returns results
   */
  async batch(options: Array<QueryOptions>): Promise<any>{
    try{
      if( !this.conn ) this.connect()
      const results:any = []
      for (const option of options) {
        const result = await this.query(option)
        results.push( result )
      }
      this.close()
      return results
    }catch(ex){
      throw ex
    }
  }
  /**
   * transaction
   * manually connect at first, and manually close connection after execution
   * @param options [{ sql, params },...]
   * @returns 
   */
  async transact(options: Array<QueryOptions>): Promise<any> {
    return new Promise((resolve,reject)=>{
      if( !this.conn ) this.connect()
      this.conn.beginTransaction(err2=>{
        if( err2 ) reject( err2 )
        else{
          this.batch( options ).then(ret=>{
            this.conn.commit(err3=>{
              if(err3){
                this.conn.rollback(err5=>{
                  if(err5) reject( err5 )
                  else reject(err3)
                })
              } else resolve( ret )
            })
          }).catch(ex=>{
            this.conn.rollback(err4=>{
              if(err4) reject( err4 )
              else reject(ex)
            })
          })
        }
      })
      this.close()
    })
  }
  /**
   * manually close connection
   */
  close(){
    if(this.conn) this.conn?.end()
  }

}

export interface QueryOptions {
  sql: string;
  params?: Array<any>;
}

/**
 * when field type is a JSON in mysql, transfer the variable into identified mode
 * [NOTE] use it directly as value, not set it to ? (? is a placeholder)
 * @param value json OR array
 * @returns JSON field of mysql mode
 */
export function SQL_VALUE(value:any){
  if( value===undefined || value===null ) return 'NULL'
  else{
    if(typeof value === 'string' ) return `'${value}'`
    else{
      const json = JSON.stringify(value)
      return `'${json}'`
    }
  }
}

export function str2json(value:any){
  if( value===undefined || value===null ) return value
  else{
    try{
      const json = JSON.parse(value)
      return json
    } catch( ex ){
      return null
    }
  }
}