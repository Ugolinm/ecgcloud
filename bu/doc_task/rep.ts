import { find as findPat, T_PATIENTS } from "../pat_app/patients";
import { encode } from 'iconv-lite'

/**
 * 根据用户id获取用户基本信息
 * @param pat_id 用户id
 * @returns 用户实例
 */
export async function fetchPatData(pat_id:string): Promise<T_PATIENTS>{
  const results = await findPat({uuid: pat_id})
  if( results && results.length>0 ) return results[0]
  else return null
}

/**
 * 将用户的基本信息编辑为rep文件内容
 * @param data { name, age, gender }
 * @returns Buffer
 */
export function generateRepBuf( data: { name: string; age: number; gender: number; } ): Buffer {
    const offset = 0x5f00;
    const b64 = Buffer.alloc(512 * 1024)

    // 姓名:20字节, 地址:0x00-0x13 => 0-19
    const bytesName: Buffer = encode(data?.name, 'gb2312')
    const bytesNameLen = 20
    for( let j=0; j<bytesName.length && j<bytesNameLen; j++ ){
      b64[offset + j] = bytesName[j]
    }

    // 年龄:3字节, 地址:0x14-0x16 => 20-22
    const bytesAge: Buffer = Buffer.from( `${data?.age}` )
    const bytesAgeLen = 3
    for( let j=0; j<bytesAge.length && j<bytesAgeLen; j++ ){
      b64[offset + 20 + j] = bytesAge[j]
    }

    // 性别:1字节, 地址:0x17 => 23
    b64[offset + 23] = data?.gender;

    b64[offset + 0x130] = 1;  //0x130  记录仪功能项?， 默认1 心电 
    b64[offset + 0x131] = 3;  //0x131 ?电通道数，字节，3-三导联，12 -??导联  默认3
    b64[offset + 0x132] = 0;  //0x132-133  采样率默认250   0
    b64[offset + 0x133] = 1;  //0x132-133  采样率默认250   1
    b64[offset + 0x134] = 2;  //0x134 默认2 
    b64[offset + 0x135] = 153;//0x135-136 心电采样常数  低位在前 默认51
    b64[offset + 0x136] = 1;  //0x135-136 心电采样常数  低位在前
    b64[offset + 0x137] = 10; //0x137 心电灵敏度默认10
    b64[offset + 0x138] = 0;  //0x138 起搏数据与常规?电数据组合，= 1 为组合，= 0 为不组
    b64[offset + 0x139] = 255;//0x139 ?电记录?式（全信息、?段），字节，0xFF 全信息
    b64[offset + 0x13a] = 255;//0x13a 电池电压参考值，字节：007—3.3,01—2.048,02 - 2.4V,03 - 6.5V,255 等分

    const now   = new Date()
    const year  = now.getFullYear();
    const mon   = now.getMonth() + 1
    const date  = now.getDate()
    const hour  = now.getHours()
    const min   = now.getMinutes()
    const sec   = now.getSeconds()

    b64[offset + 0x180] = year&0xff
    b64[offset + 0x181] = year>>8
    b64[offset + 0x182] = mon
    b64[offset + 0x183] = date
    b64[offset + 0x184] = hour
    b64[offset + 0x185] = min
    b64[offset + 0x186] = sec

    return b64;
}