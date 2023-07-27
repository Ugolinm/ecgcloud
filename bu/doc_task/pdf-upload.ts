/**
 * 图片上传、读取、删除
 */

import { IncomingForm } from "formidable";
import { accessSync, constants, mkdirSync, readFileSync, renameSync, unlinkSync } from "fs";
import { resolve } from "path";
import { getDefaultConf } from "../../config";
import { ConfigOptions } from "../../config/interface";
import { CONF_OPTIONS } from "../../utils/constants";
import { ts } from "../../utils/date";
import { _G_VAR_GET } from "../../utils/global";
import { UUID, uuid } from "../../utils/uuid";
import { mkdirIfNotExist } from "./common";

const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
//  const upload_report  = `./report`
//  const upload_cache = `./cache`
 const upload_report  = options?.dirs?.report
 const upload_cache = options?.dirs?.cache
 mkdirIfNotExist(upload_report)
 mkdirIfNotExist(upload_cache)
 
 export function download(filename:string, res:any){
    let filepath = resolve(upload_report, filename);
     //判断文件是否存在
     try {
       accessSync(filepath, constants.F_OK);
     } catch (err) {
       res.status(404).end('文件不存在')
       return
     }
    // const buff:string = readFileSync( filepath, 'binary' )
    // const entity = { filename, buff }
    // pull(res, entity?.filename, entity?.buff)
    res.download(filepath, (err:any)=>{
      if( err ) console.error( err )
      else console.log('下载至客户端')
    })
 }
 
 export function uploadWithAutoUUID(req:any, res:any){
   const form:any = new IncomingForm(); 
   form.uploadDir = upload_cache;
   form.keepExtensions = true;
   form.maxFileSize = 5 * 1024 * 2014;
   form.multiples = false;
   form.parse(req, (err:any, fields:any ,files:any)=>{
     if(err){
       console.error('上传文件出错：',err);
       res.status(500).end('上传文件出错');
       return;
     }
     try{
       const keys:any = Object.keys( files )
       let pdf = files[ keys[0] ]
       const extname = 'pdf'
      //  const filename = `${uuid()}.${extname}`
       const filename = `${UUID.random()}.${extname}`
       renameSync(pdf?.path||pdf?.filepath, resolve( upload_report, filename ) );
       res.status(200).jsonp(
         {
           filename,
           size: pdf.size,
           type: pdf.mimetype,
         }
       );
     }catch(ex){
       console.error( ex )
       res.status(500).end()
     }
   })
 }
 
 export function uploadWithFilename(req:any, res:any, fname:string){
   //判断是否存在@字符，如有则替换为时间戳
   const at = fname.search(/@/)
   if(at!==-1){
     fname = fname.replace(/@/, `${ts()}`)
   }
   console.log('删除原文件');
   try{
     const _path = resolve( upload_report, fname )
     accessSync(_path)
     console.log('原文件存在，进行删除')
     try{
       unlinkSync(_path)
     }catch(ex1){
       console.log('原文件删除失败')
       res.status(500).end('原文件删除失败')
       return
     }
   }catch(ex2){
     console.log('原文件不存在')
   }
   console.log('开始上传图片');
   const form:any = new IncomingForm(); 
   form.uploadDir = upload_cache;
   form.keepExtensions = true;
   form.maxFileSize = 2 * 1024 * 2014;
   form.multiples = true;
   form.parse(req, (err:any, fields:any, files:any)=>{
     if(err){
       console.error('上传文件出错：',err);
       res.status(500).end('上传文件出错');
       return;
     }
     try{
       const keys:any = Object.keys( files )
       let pdf = files[ keys[0] ]
       renameSync(pdf?.path||pdf?.filepath, resolve( upload_report, fname ) );
       res.status(200).jsonp(
         {
           filename: fname,
           size: pdf.size,
           type: pdf.mimetype,
         }
       )
     }catch(ex){
       console.error( ex )
       res.status(500).end('上传文件出错')
     }
   })
 }