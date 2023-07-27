import { Anonymous, Unknown, USER_ID, U_TOKEN } from "./constants";
import { ts } from "./date";

export function getClientIP(req: any) {
  return req?.socket?.remoteAddress || Unknown
}

export function getUserToken(req: any) {
  return req?.headers[U_TOKEN] || req?.query[U_TOKEN] || Unknown
}

export function getUserID(req: any) {
  return req?.headers[USER_ID] || req?.query[USER_ID] || Anonymous
}