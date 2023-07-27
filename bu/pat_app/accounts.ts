import { getDefaultConf } from "../../config";
import { ConfigOptions } from "../../config/interface";
import { CONF_OPTIONS } from "../../utils/constants";
import { ts } from "../../utils/date";
import { _G_VAR_GET } from "../../utils/global";
import { getMysql } from "../../utils/mysql-base";

export interface T_ACCOUNTS {
	uuid?: string;
	openid?: string;
	unionid?: string;
	mobile?: string;
	nickname?: string;
	avatarUrl?: string;
	create_tm?: string;
}
// 保存微信用户, 已经存在则更新, 不存在则添加账户
export function insert(account:T_ACCOUNTS){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  return  getMysql(options?.database).query({
    sql: `insert into T_ACCOUNTS (uuid, unionid, openid, mobile, nickname, avatarUrl, create_tm) values (?,?,?,?,?,?,?)`,
    params: [account?.uuid, account?.unionid, account?.openid, account?.mobile, account?.nickname, account?.avatarUrl, ts()]
  })
}

export function update(account:T_ACCOUNTS){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  return  getMysql(options?.database).query({
    sql: `update T_ACCOUNTS set unionid=?, openid=?, mobile=?, nickname=?, avatarUrl=? where uuid=?`,
    params: [account?.unionid, account?.openid, account?.mobile, account?.nickname, account?.avatarUrl, account?.uuid]
  })
}

export function find(conds: {[field: string]: string;}){
  const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
  let sql = `select * from T_ACCOUNTS where `
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