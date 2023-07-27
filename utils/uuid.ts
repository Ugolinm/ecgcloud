import { randomUUID } from "crypto";

export function uuid(){
  return randomUUID() // 36位长度
}

export namespace UUID {
  export function random(){
    return randomUUID()
  }
  export function digit(length=16){
    const date = new Date()
    const full_year_4: string = date.getFullYear().toString()                             // 4位长度的年份
    const month_2: string     = (date.getMonth() + 1).toString().replace(/^(\d)$/,"0$1")  // 2位长度的月份
    const date_2: string      = date.getDate().toString().replace(/^(\d)$/,"0$1")         // 2位长度的日
    const hour_2: string      = date.getHours().toString().replace(/^(\d)$/,"0$1")        // 2位长度的小时
    const minute_2: string    = date.getMinutes().toString().replace(/^(\d)$/,"0$1")      // 2位长度的分钟
    const second_2: string    = date.getSeconds().toString().replace(/^(\d)$/,"0$1")      // 2位长度的秒
    const random_bits: number = Math.max(16, length) - 14
    const random: string      = Math.random().toString()
    const random_cut: string  = random.substring(random.length - random_bits)             // 用随机数填补剩余空位
    return full_year_4 + month_2 + date_2 + hour_2 + minute_2 + second_2 + random_cut
  }
}