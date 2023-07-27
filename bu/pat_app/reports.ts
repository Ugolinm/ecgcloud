import { getDefaultConf } from "../../config";
import { ConfigOptions } from "../../config/interface";
import { CONF_OPTIONS } from "../../utils/constants";
import { ts } from "../../utils/date";
import { _G_VAR_GET } from "../../utils/global";
import { getLoggie } from "../../utils/loggie";
import { getMysql } from "../../utils/mysql-base";

export interface T_REPORTS {
  report_id?:string;
  report_up_tm?:string;
	patient_id?:string;
  patient_name?:string; // left join
	data_id?:string;
	data_up_tm?:string;
}

// 查找报告
export function find(conds: {[field: string]: string;}, pageno=1, pagecnt=10){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  const loggie = getLoggie(options?.log_category)

  let sql = `select *,T_PATIENTS.name as patient_name from T_REPORTS 
  left join T_PATIENTS on T_PATIENTS.uuid=T_REPORTS.patient_id 
  where `
  const keys = Object.keys( conds )
  const params = []
  for (const key of keys) {
    sql += `${key}=? and `
    params.push( conds[key] )
  }
  sql += `1=1 LIMIT ${(pageno-1)*pagecnt},${pagecnt}`
  loggie.debug(sql, params)

  return  getMysql(options?.database).query({ sql, params })
}
export function findIn(conds: {[field: string]: string[];}, pageno=1, pagecnt=10){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  const loggie = getLoggie(options?.log_category)

  let sql = `select *,T_PATIENTS.name as patient_name from T_REPORTS 
  left join T_PATIENTS on T_PATIENTS.uuid=T_REPORTS.patient_id 
  where `
  const keys = Object.keys( conds )
  const params:any = []
  for (const key of keys) {
    const arr = conds[key]
    let range = ''
    for (let i=0; i<arr.length; i++) {
      range += `'${arr[i]}'`
      if( i<arr.length-1 ) range += `,`
    }
    if( range ) sql += `${key} in (${range}) and `
  }
  sql += `1=1 LIMIT ${(pageno-1)*pagecnt},${pagecnt}`
  loggie.debug(sql)

  return  getMysql(options?.database).query({ sql, params })
}

export function newReport(report:T_REPORTS){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  return  getMysql(options?.database).query({
    sql: `insert into T_REPORTS (patient_id, report_id, data_id, data_up_tm, report_up_tm) values (?,?,?,?,?)`,
    params: [report?.patient_id, report?.report_id, report?.data_id, report?.data_up_tm, ts()]
  })
}