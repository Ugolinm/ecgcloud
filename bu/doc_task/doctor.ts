import { getDefaultConf } from "../../config";
import { ConfigOptions } from "../../config/interface";
import { CONF_OPTIONS } from "../../utils/constants";
import { ts } from "../../utils/date";
import { _G_VAR_GET } from "../../utils/global";
import { getMysql, SQL_VALUE } from "../../utils/mysql-base";

export enum DoctorStatus {
  Checking = '审核中', // 审核中
  Approved = '已通过', // 已通过
  Rejected = '未通过', // 未通过
  Freezed  = '冻结中', // 冻结中
  Unknown  = '未知',   // 未知
}

export enum DoctorRights {
  Diagnosis = 'D',
  Review    = 'R'
}

export interface Doctor {
  uuid?     : string;         // 平台唯一标识Id
  unionId?  : string;         // 微信UnionId
  avatarUrl?: string;         // 微信头像
  userIcon? : string;         // 自定义头像
  realname? : string;         // 真实姓名
  gender?   : string;         // 性别 0: male, 1: female
  idcard?   : string;         // 身份证号码
  mobile?   : string;         // 手机号
  title?    : string;         // 职称: 高级 | 副高 | 中级 | 初级
  rights?   : Array<string>;  // 权限: 诊断 | 审核
  hospital? : string;         // 所在医院名称
  division? : Array<string>;  // 所在科室
  location? : Array<string>;  // 省直辖市/市/区县
  address?  : string;         // 详细地址
  id_front? : string;         // base64: 身份证正面照
  id_back?  : string;         // base64: 身份证反面照
  rqc?      : string;         // base64: 医师执业证书
  trc?      : string;         // base64: 职业资格证书
  signature?: string;         // base64: 签名
  status?   : string;         // 状态 审核中 | 已通过 | 未通过 | 冻结中 | 未知 <== DoctorStatus
  create_tm?: string;         // 注册时间
}

// 登记医生
export function enroll(doc:Doctor){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  return  getMysql(options?.database).query({
    sql: `insert into T_DOCTORS (uuid, unionId, avatarUrl, status, create_tm) values (?,?,?,?,?)`,
    params: [doc?.uuid, doc?.unionId, doc?.avatarUrl, doc?.status, ts()]
  })
}

// 更新医生
export function update(doc:Doctor){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  return  getMysql(options?.database).query({
    sql: `update T_DOCTORS set 
    avatarUrl=${SQL_VALUE(doc?.avatarUrl)}, 
    userIcon=${SQL_VALUE(doc?.userIcon)}, 
    realname=${SQL_VALUE(doc?.realname)}, 
    gender=${SQL_VALUE(doc?.gender)}, 
    idcard=${SQL_VALUE(doc?.idcard)}, 
    mobile=${SQL_VALUE(doc?.mobile)}, 
    title=${SQL_VALUE(doc?.title)}, 
    rights=${SQL_VALUE(doc?.rights)}, 
    hospital=${SQL_VALUE(doc?.hospital)}, 
    division=${SQL_VALUE(doc?.division)}, 
    location=${SQL_VALUE(doc?.location)}, 
    address=${SQL_VALUE(doc?.address)}, 
    id_front=${SQL_VALUE(doc?.id_front)}, 
    id_back=${SQL_VALUE(doc?.id_back)}, 
    rqc=${SQL_VALUE(doc?.rqc)}, 
    trc=${SQL_VALUE(doc?.trc)}, 
    signature=${SQL_VALUE(doc?.signature)}, 
    status=${SQL_VALUE(doc?.status)}
    where uuid=?`,
    params: [doc?.uuid]
  })
}

// 删除医生
export function remove(doc:Doctor){
  // const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  // return  getMysql(options?.database).query({
  //   sql: `delete from T_PATIENTS where uuid=?`,
  //   params: [patient?.uuid]
  // })
}

// 查找医生
export function find(conds: {[field: string]: string;}){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  let sql = `select * from T_DOCTORS where `
  const keys = Object.keys( conds )
  const params = []
  for (const key of keys) {
    sql += `${key}=? and `
    params.push( conds[key] )
  }
  sql += `1=1`
  return  getMysql(options?.database).query({ sql, params })
}