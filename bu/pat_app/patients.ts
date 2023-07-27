import { getDefaultConf } from "../../config";
import { ConfigOptions } from "../../config/interface";
import { CONF_OPTIONS } from "../../utils/constants";
import { ts } from "../../utils/date";
import { _G_VAR_GET } from "../../utils/global";
import { getMysql } from "../../utils/mysql-base";
import { UUID, uuid } from "../../utils/uuid";

export interface T_PATIENTS {
	uuid?:string;
	name?:string; // unique
	age?:number;
	mobile?:string;
	gender?:number;
	belongto?:string;
	relationship?:string;
  create_tm?:string;
}
// 登记使用者
export function enroll(patient:T_PATIENTS){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  return  getMysql(options?.database).query({
    sql: `insert into T_PATIENTS (uuid, name, age, gender, belongto, relationship, mobile, create_tm) values (?,?,?,?,?,?,?,?)`,
    // params: [uuid(), patient?.name, patient?.age, patient?.gender, patient?.belongto, patient?.relationship, patient?.mobile, ts()]
    params: [UUID.random(), patient?.name, patient?.age, patient?.gender, patient?.belongto, patient?.relationship, patient?.mobile, ts()]
  })
}

// 更新使用者
export function update(patient:T_PATIENTS){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  return  getMysql(options?.database).query({
    sql: `update T_PATIENTS set name=?, age=?, gender=?, belongto=?, relationship=?, mobile=? where uuid=?`,
    params: [patient?.name, patient?.age, patient?.gender, patient?.belongto, patient?.relationship, patient.mobile, patient?.uuid]
  })
}

// 删除使用者
export function remove(patient:T_PATIENTS){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  return  getMysql(options?.database).query({
    sql: `delete from T_PATIENTS where uuid=?`,
    params: [patient?.uuid]
  })
}

// 查找使用者
export function find(conds: {[field: string]: string;}){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  let sql = `select * from T_PATIENTS where `
  const keys = Object.keys( conds )
  const params = []
  for (const key of keys) {
    sql += `${key}=? and `
    params.push( conds[key] )
  }
  sql += `1=1`
  return  getMysql(options?.database).query({ sql, params })
}