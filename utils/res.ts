export function send_json(res:any, data?:any, error?:any): void {
  if( error ) {
    res.json({ error })
  } else {
    res.json( data )
  }
}