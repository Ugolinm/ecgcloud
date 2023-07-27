import { getDefaultConf } from "../../config";
import { ConfigOptions } from "../../config/interface";
import { CONF_OPTIONS } from "../../utils/constants";
import { ts } from "../../utils/date";
import { _G_VAR_GET } from "../../utils/global";
import { getMysql } from "../../utils/mysql-base";
import { DoctorRights } from "./doctor";

export enum TaskMode {
  Waiting = 'waiting',
  Pending = 'pending',
  History = 'history',
}

export enum TaskStatus {
  NewlyTaskWaiting = '00',  // 新任务-待接诊
  CancelledWaiting = '01',  // 被撤销-待接诊
  Pending = '10',  // 待诊断
  Diagnosed = '20',  // 已诊断
  Reviewed = '30',  // 已复核
}

export interface Task {
  taskid?: string; // 任务ID
  pat_id?: string; // 使用者ID
  realname?: string; // 使用者真实姓名
  gender?: string; // 使用者性别 0:女 1:男
  age?: number; // 年龄
  collect_sta_tm?: string; // 开始采集时间
  collect_end_tm?: string; // 结束采集时间
  duration?: number; // 采集时长
  data_up_tm?: string; // 数据上传时间(即任务创建时间)
  data_id?: string; // 数据文件ID
  report_id?: string; // 报告文件ID
  accepted_by?: string; // 接诊医生ID
  accept_tm?: string; // 接诊时间
  finish_tm?: string; // 任务完成时间(指复核通过)
  canceled_by?: string; // 撤销医生ID
  canceled_tm?: string; // 诊断撤销时间
  diagnosed_by?: string; // 诊断医生ID
  diagnosed_tm?: string; // 诊断提交时间
  reviewed_by?: string; // 审核医生ID
  reviewed_tm?: string; // 审核提交时间
  status?: string; // 任务状态 00:新任务-待接诊 | 01:被撤销-待接诊 | 10:待诊断 | 20:已诊断 | 30:已复核
}
/**
 * 获取待接诊任务
 * @params doc_id 当前医生id
 */
export function fetchWaitingTasks(doc_id: string, offset?: number, rows?: number) {
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  const limit = rows ? `limit ${offset},${rows}` : ''
  let sql = `select * from V_TASKS where status in (?,?) and (canceled_by is null or canceled_by!=?) order by data_up_tm asc ${limit}`
  const params = [TaskStatus.NewlyTaskWaiting, TaskStatus.CancelledWaiting, doc_id]
  return getMysql(options?.database).query({ sql, params })
}
/**
 * 获取待接诊任务的总数
 * @params doc_id 当前医生id
 */
export async function fetchWaitingCount(doc_id: string) {
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  let sql = `select count(1) as TOTAL_CNT from V_TASKS where status in (?,?) and (canceled_by is null or canceled_by!=?)`
  const params = [TaskStatus.NewlyTaskWaiting, TaskStatus.CancelledWaiting, doc_id, doc_id]
  const results = await getMysql(options?.database).query({ sql, params })
  if (results && results.length > 0) {
    return results[0]?.TOTAL_CNT
  } else return 0
}

/**
 * 获取待诊断任务
 * @params doc_id 当前医生id
 */
export function fetchPendingTasks(doc_id: string) {
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  let sql = `select * from V_TASKS where status=? and accepted_by=? limit 1`
  const params = [TaskStatus.Pending, doc_id]
  return getMysql(options?.database).query({ sql, params })
}

/**
 * 获取历史诊断任务
 * @params doc_id 当前医生id
 */
export function fetchHistoryTasks(doc_id: string, offset?: number, rows?: number): Promise<any> {
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  const limit = rows ? `limit ${offset},${rows}` : ''
  let sql = `select * from V_TASKS where status in (?,?) and (diagnosed_by=? or reviewed_by=?) order by data_up_tm desc ${limit}`
  const params = [TaskStatus.Diagnosed, TaskStatus.Reviewed, doc_id, doc_id]
  console.log(sql, params)
  return getMysql(options?.database).query({ sql, params })
}
/**
 * 获取历史诊断任务的总数
 * @params doc_id 当前医生id
 */
export async function fetchHistoryCount(doc_id: string) {
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  let sql = `select count(1) as TOTAL_CNT from V_TASKS where status in (?,?) and (diagnosed_by=? or reviewed_by=?)`
  const params = [TaskStatus.Diagnosed, TaskStatus.Reviewed, doc_id, doc_id]
  const results = await getMysql(options?.database).query({ sql, params })
  if (results && results.length > 0) {
    return results[0]?.TOTAL_CNT
  } else return 0
}

/**
 * 接诊
 * @params doc_id 当前医生id
 * @params taskid 当前任务id
 */
export async function acceptTask(doc_id: string, taskid: string): Promise<{ result?: any; error?: string; }> {
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  let sql = `update T_TASKS set status=?, accepted_by=?, accept_tm=? where taskid=?`
  const params = [TaskStatus.Pending, doc_id, ts(), taskid]
  console.log(sql, params)
  try {
    const result = await getMysql(options?.database).query({ sql, params })
    console.log(result)
    return Promise.resolve({ result })
  } catch (ex) {
    console.error(ex)
    return Promise.resolve({ error: ex?.message || ex })
  }
}

/**
 * 取消诊断任务
 * @params doc_id 当前医生id
 * @params taskid 当前任务id
 */
export async function cancelTask(doc_id: string, taskid: string): Promise<{ result?: any; error?: string; }> {
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  let sql = `update T_TASKS set status=?, canceled_by=?, canceled_tm=? where taskid=?`
  const params = [TaskStatus.CancelledWaiting, doc_id, ts(), taskid]
  console.log(sql, params)
  try {
    const result = await getMysql(options?.database).query({ sql, params })
    console.log(result)
    return Promise.resolve({ result })
  } catch (ex) {
    console.error(ex)
    return Promise.resolve({ error: ex?.message || ex })
  }
}

/**
 * 诊断完毕
 * @params doc_id 当前医生id
 * @params taskid 当前任务id
 * @params report_id 报告id
 */
export async function diagnosedTask(doc_id: string, taskid: string, report_id: string): Promise<{ result?: any; error?: string; }> {
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  // 是否具有复核权限
  let review_rights = false
  const sql4rights = `SELECT uuid FROM T_DOCTORS where JSON_CONTAINS( rights, '"${DoctorRights.Review}"' ) and uuid=?`
  const params4rights = [doc_id]
  try {
    const result4rights = await getMysql(options?.database).query({ sql: sql4rights, params: params4rights })
    if (result4rights && result4rights.length > 0) review_rights = true
  } catch (ex) {
    console.error(ex)
  }

  // 如果存在复核权限, 则进行自我复核通过
  let review_set = ``
  if (review_rights) {
    console.log('拥有复核权限, 进行自我复核')
    review_set = `, reviewed_by="${doc_id}", reviewed_tm="${ts()}", finish_tm="${ts()}"`
  } else console.log('不存在复核权限')

  // 执行
  let sql = `update T_TASKS set status=?, diagnosed_by=?, diagnosed_tm=?, report_id=? ${review_set} where taskid=?`
  const params = [
    review_rights ? TaskStatus.Reviewed : TaskStatus.Diagnosed,
    doc_id, ts(), report_id, taskid
  ]
  console.log(sql, params)
  try {
    const result = await getMysql(options?.database).query({ sql, params })
    console.log(result)
    return Promise.resolve({ result })
  } catch (ex) {
    console.error(ex)
    return Promise.resolve({ error: ex?.message || ex })
  }
}