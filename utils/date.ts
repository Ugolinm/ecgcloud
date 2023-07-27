export function format ( fmt: string, val: Date|string|number ): string{
  let dt;
  if( val instanceof Date ){
    dt = val
  }else if( typeof val === 'number' ){
    dt = new Date( ts_digits(val)===TS_DIGIT._10?ts_10to13(val):val )
  }else if( typeof val === 'string' ){
    if( /^\d+$/.test(val) ){
			const ts = parseInt(val)
			dt = new Date( ts_digits(ts)===TS_DIGIT._10?ts_10to13(ts):ts )
		} else {
			try{
				dt = new Date(val)
			}catch(ex){
				dt = new Date( Date.parse(val.replace(/-/g,'/')) )
			}
		}
  }
  const Y = dt.getFullYear(); //year
  const M = dt.getMonth()+1;  //month 
  const D = dt.getDate();     //day 
  const h = dt.getHours();    //hour 
  const m = dt.getMinutes();  //minute 
  const s = dt.getSeconds();  //second 
  const Q = Math.floor((dt.getMonth()+3)/3); //quarter 
  const S = dt.getMilliseconds(); //millisecond 

  const _Y = Y.toString();
  const _M = M.toString().replace(/^(\d)$/,"0$1");
  const _D = D.toString().replace(/^(\d)$/,"0$1");
  const _h = h.toString().replace(/^(\d)$/,"0$1");
  const _m = m.toString().replace(/^(\d)$/,"0$1");
  const _s = s.toString().replace(/^(\d)$/,"0$1");
  const _Q = Q.toString();
  const _S = S.toString().replace(/^(\d)$/,"0$1");

  const _v = fmt.replace(/Y/g,_Y).replace(/M/g,_M).replace(/D/g,_D)
                .replace(/h/g,_h).replace(/m/g,_m).replace(/s/g,_s)
                .replace(/S/g,_S).replace(/Q/g,_Q);
  return _v;
}

export enum TS_DIGIT {
  _10 = 10,
  _13 = 13
}
export function ts(digit=TS_DIGIT._13): number{
  const t = new Date().getTime()
  if( digit===TS_DIGIT._10 ) return Math.floor(t/1000)
  else return t
}
export function ts_13to10(ts_13:number){
  return Math.floor(ts_13/1000)
}
export function ts_10to13(ts_10:number){
  return ts_10*1000
}
export function ts_digits(ts:number){
  return ts.toString().length
}

export function date(ts?: number|string): Date{
  if( ts ){
    if( typeof ts === 'number' ) return new Date( ts_digits(ts)===TS_DIGIT._10?ts_10to13(ts):ts )
    if( typeof ts === 'string' ){
      try {
        const num = parseInt(ts)
        return new Date( num )
      } catch (parseint_ex) {}
      try{
        const parsed = Date.parse( ts.replace(/-/g,'/') )
        return new Date( parsed )
      } catch( err ){
        return new Date()
      }
    }
  }
  return new Date()
}

export function diff(d1: Date, d2: Date): number{
  return Math.abs( d1.getTime() - d2.getTime() )
}

export function add(start: string|Date, interval: number): string{
  let dt = new Date()
  if( !start ) return ''
  if( typeof start ==='string' ){
    const fmtStart = start.replace(/-/g,'/')
    dt = new Date( Date.parse( fmtStart ) )
  }
  else if( typeof start ==='number' ){
    dt = new Date( ts_digits(start)===TS_DIGIT._10?ts_10to13(start):start )
  }
  else if( typeof start ==='object' ){
    dt = start
  }
  const ts = dt.getTime() + interval
  return format( 'Y-M-D h:m:s', date(ts) )
}

export function minus(start: string|Date, interval: number): string{
  let dt = new Date()
  if( !start ) return ''
  
  if( start instanceof Date ){
    dt = start
  }else if( typeof start === 'number' ){
    dt = new Date( ts_digits(start)===TS_DIGIT._10?ts_10to13(start):start )
  }else if( typeof start === 'string' ){
    try{
      dt = new Date(start)
    }catch(ex){
      dt = new Date( Date.parse(start.replace(/-/g,'/')) )
    }
  }
  
  const ts = dt.getTime() - interval
  return format( 'Y-M-D h:m:s', date(ts) )
}