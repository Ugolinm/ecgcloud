export function _G_VAR_SET(key:string, val: any) {
  const g: any = global
  g[key] = val
}

export function _G_VAR_GET(key:string): any {
  const g: any = global
  return g[key]
}