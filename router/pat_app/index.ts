import { find as findAcc, insert as insertAcc, T_ACCOUNTS, update as updateAcc } from "../../bu/pat_app/accounts"
import { enroll as addPat, find as findPat, remove, T_PATIENTS } from "../../bu/pat_app/patients"
import { enroll as enrollDev, find as findDev } from "../../bu/pat_app/devices"
import { findIn as findRepIn } from "../../bu/pat_app/reports"
import { getDefaultConf } from "../../config"
import { ConfigOptions } from "../../config/interface"
import { CONF_OPTIONS } from "../../utils/constants"
import { _G_VAR_GET } from "../../utils/global"
import { getLoggie } from "../../utils/loggie"
import { Row } from "../../utils/mysql-base"
import { send_json } from "../../utils/res"
import { UUID, uuid } from "../../utils/uuid"
import { Logger } from "log4js"

const logger: Logger = getLoggie("dev")

export function defineRouter(app: any, P: string) {
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  const loggie = getLoggie(options?.log_category)

  app.post(`${P}/accounts/signup`, async (req: any, res: any) => {
    // 保存微信用户, 已经存在则更新, 不存在则添加账户
    try {
      let acc: T_ACCOUNTS = Object.assign({}, req.body)
      const results: Row[] = await findAcc({ unionid: acc?.unionid })
      if (results && results.length > 0) {
        await updateAcc(acc)
        acc.uuid = results[0]['uuid']
      } else {
        // acc.uuid = uuid()
        acc.uuid = UUID.random()
        await insertAcc(acc)
      }
      send_json(res, acc)
    } catch (error) {
      loggie.error(error)
      send_json(res, null, error?.message || error)
    }
  })
  app.post(`${P}/accounts/update`, async (req: any, res: any) => {
    // TODO: 更新微信用户信息
    send_json(res, { test: P })
  })

  app.post(`${P}/patients/add`, async (req: any, res: any) => {
    // 添加使用者
    try {
      await addPat(req.body)
      send_json(res, req.body)
    } catch (error) {
      loggie.error(error)
      send_json(res, null, error?.message || error)
    }
  })
  app.post(`${P}/patients/find`, async (req: any, res: any) => {
    // 查找使用者
    try {
      const result = await findPat(req.body)
      send_json(res, result)
    } catch (error) {
      loggie.error(error)
      send_json(res, null, error?.message || error)
    }
  })
  app.post(`${P}/patients/delete`, async (req: any, res: any) => {
    // 删除指定使用者
    try {
      const result = await remove(req.body)
      send_json(res, result)
    } catch (error) {
      loggie.error(error)
      send_json(res, null, error?.message || error)
    }
  })

  app.post(`${P}/dev/enroll`, async (req: any, res: any) => {
    // 更新设备的最后一次使用者信息
    try {
      const result = await enrollDev(req.body)
      send_json(res, result)
    } catch (error) {
      loggie.error(error)
      send_json(res, null, error?.message || error)
    }
  })
  app.post(`${P}/dev/status`, async (req: any, res: any) => {
    // 返回指定设备的状态, 包括最近一次登记使用者
    try {
      const result = await findDev(req.body)
      send_json(res, result)
    } catch (error) {
      loggie.error(error)
      send_json(res, null, error?.message || error)
    }
  })

  app.post(`${P}/reports/:account`, async (req: any, res: any) => {
    // 返回指定账户的所有报告
    const { pageno, pagecnt } = req.body
    try {
      // 查找账户的所有使用者
      const patients: Row[] = await findPat({ belongto: req.params?.account })
      logger.debug("patients=", patients)
      const ids = patients.map((item: T_PATIENTS) => item?.uuid)
      const reports = await findRepIn({ patient_id: ids }, pageno, pagecnt)
      logger.debug("reports=", reports)
      send_json(res, reports)
    } catch (error) {
      loggie.error(error)
      send_json(res, null, error?.message || error)
    }
  })
  app.post(`${P}/report/:repid`, async (req: any, res: any) => {
    // TODO: 返回指定报告的内容
    send_json(res, { test: P })
  })
}