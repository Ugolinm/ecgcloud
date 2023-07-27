import { getDefaultConf } from "../../config";
import { ConfigOptions } from "../../config/interface";
import { CONF_OPTIONS } from "../../utils/constants";
import { ts } from "../../utils/date";
import { _G_VAR_GET } from "../../utils/global";
import { getMysql } from "../../utils/mysql-base";

export interface T_DEV_LAST_USER {
	dev_id?:string;
	dev_name?:string;
	dev_version?:string;
	last_userid?:string;
	last_used_tm?:string;
}
// 登记最后一次使用者
export function enroll(dev:T_DEV_LAST_USER){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  return  getMysql(options?.database).query({
    sql: `replace T_DEV_LAST_USER (dev_id, dev_name, dev_version, last_userid, last_used_tm) values (?,?,?,?,?)`,
    params: [dev?.dev_id, dev?.dev_name, dev?.dev_version, dev?.last_userid, ts()]
  })
}

// 查找最后一次使用者
export function find(conds: {[field: string]: string;}){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  let sql = `SELECT t1.dev_id,t1.dev_name,t1.dev_version,t1.last_userid,t2.name,t2.belongto FROM T_DEV_LAST_USER t1 left join T_PATIENTS t2 on t1.last_userid=t2.uuid where `
  const keys = Object.keys( conds )
  const params = []
  for (const key of keys) {
    sql += `${key}=? and `
    params.push( conds[key] )
  }
  sql += `1=1`
  console.log( sql, params )
  return  getMysql(options?.database).query({ sql, params })
}