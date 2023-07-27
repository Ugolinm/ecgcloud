import * as Cities from '../../assets/cities.json'
import * as Divisions from '../../assets/divisions.json'
import * as Hospitals from '../../assets/hospitals.json'

export function loadJSON(target:string){
  if( target.toUpperCase()==='CITIES' ) return Cities
  if( target.toUpperCase()==='DIVISIONS' ) return Divisions
  if( target.toUpperCase()==='HOSPITALS' ) return Hospitals
}