import { put, get, del, clear, size, memsize, keys, importJson, exportJson } from 'memory-cache'

export function m_set(key:string, value:any, duration?:number, callback?:(k:any,v:any)=>void): any {
  return put(key, value, duration, callback)
}

export function m_get(key:string): any {
  return get(key)
}

export function m_del(key: string): void {
  return del(key)
}

export function m_clear(): void {
  return clear()
}

export function m_size(): number {
  return size()
}

export function m_memsize(): number {
  return memsize()
}

export function m_keys(): any[] {
  return keys()
}

export function m_importJson(json: string, options?: { skipDuplicates?: boolean | undefined }): number {
  return importJson(json, options)
}

export function m_exportJson(): string {
  return exportJson()
}