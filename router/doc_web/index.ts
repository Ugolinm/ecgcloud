import { Logger } from "log4js";
import { merge4download } from "../../bu/doc_task/data-download";
import { Doctor, DoctorStatus, enroll, find, update } from "../../bu/doc_task/doctor";
import { deleteImage, deleteImages, fetch, uploadWithAutoUUID as uploadImage_uuid, uploadWithFilename as uploadImage_fname } from "../../bu/doc_task/image-upload";
import { loadJSON } from "../../bu/doc_task/json";
import { download, uploadWithAutoUUID as uploadPdf_uuid, uploadWithFilename as uploadPdf_fname } from "../../bu/doc_task/pdf-upload";
import { acceptTask, cancelTask, diagnosedTask, fetchHistoryCount, fetchHistoryTasks, fetchPendingTasks, fetchWaitingCount, fetchWaitingTasks, TaskMode } from "../../bu/doc_task/tasks";
import { newReport, T_REPORTS } from "../../bu/pat_app/reports";
import { getLoggie } from "../../utils/loggie";
import { Row, str2json } from "../../utils/mysql-base";
import { send_json } from "../../utils/res";
import { UUID, uuid } from "../../utils/uuid";

const logger: Logger = getLoggie("dev")

export function defineRouter(app:any, P:string){
  //浏览器OPTIONS预检
  app.all('*', function(req:any, res:any, next:any) {
    if(req.method=="OPTIONS") res.status(200);/*让options请求快速返回*/
    else  next();
  });

  /********** 图片区 ************/

  /**
   * 根据文件名获取本地存储的图片并返回到浏览器
   */
  app.post(`${P}/fetch-image/:filename`, (req:any, res:any)=> {
    const filename = req.params?.filename;
    if( !filename ){
      res.status(500).send('没有指定文件名')
      return
    }
    logger.debug('图片文件名称=', filename);
    // 获取图片base64
    fetch( filename, res )
  });

  /**
   * 利用Vue的Upload控件进行图片上传
   * 将图片利用UUID插件进行重命名，无扩展名
   * 返回{文件名，文件大小，文件类型}
   */
  app.post(`${P}/upload-image`,(req:any, res:any)=>{
    logger.debug('开始上传图片, 文件名采用uuid');
    uploadImage_uuid(req, res)
  })

  /**
   * 利用Vue的Upload控件进行图片上传
   * 将图片利用指定的文件名进行保存，如果存在源文件，则进行删除后再保存
   * 返回{文件名，文件大小，文件类型}
   */
  app.post(`${P}/upload-image/:filename`,(req:any, res:any)=>{
    let fname = req.params?.filename
    if( !fname ){
      res.status(500).send('没有指定文件名')
      return
    }
    uploadImage_fname(req, res, fname)
  })

  /**
   * 删除图片
   */
  app.post(`${P}/delete-image/:filename`,(req:any, res:any)=>{
    let fname = req.params?.filename
    if( !fname ){
      res.status(500).send('没有指定文件名')
      return
    }
    deleteImage( res, fname )
  })

  /**
   * 批量删除图片
   */
  app.post(`${P}/delete-image/batch`,(req:any, res:any)=>{
    const images = req.body?.images
    if( !images ){
      res.status(500).send('没有指定文件', images)
      return
    }
    deleteImages(res, images)
  })

  /********** pdf区 ************/

  /**
   * 根据文件名获取本地存储的pdf并返回到浏览器
   */
   app.post(`${P}/fetch-pdf/:filename`, (req:any, res:any)=> {
    const filename = req.params?.filename;
    if( !filename ){
      res.status(500).send('没有指定文件名')
      return
    }
    logger.debug('文件名=', filename);
    // 获取图片base64
    download( filename, res )
  });

  /**
   * 利用Vue的Upload控件进行pdf上传
   * 将图片利用UUID插件进行重命名，无扩展名
   * 返回{文件名，文件大小，文件类型}
   */
  app.post(`${P}/upload-pdf`,(req:any, res:any)=>{
    logger.debug('开始上传文件, 文件名采用uuid');
    uploadPdf_uuid(req, res)
  })

  /**
   * 利用Vue的Upload控件进行pdf上传
   * 将图片利用指定的文件名进行保存，如果存在源文件，则进行删除后再保存
   * 返回{文件名，文件大小，文件类型}
   */
  app.post(`${P}/upload-pdf/:filename`,(req:any, res:any)=>{
    let fname = req.params?.filename
    if( !fname ){
      res.status(500).send('没有指定文件名')
      return
    }
    logger.debug('开始上传文件, 文件名指定=',fname)
    uploadPdf_fname(req, res, fname)
  })

  /********** 数据区 ************/

  /**
   * 根据文件名获取用户信息并生成rep文件, 同时获取数据文件, 改名为dat文件,并合并为zip文件返回到浏览器
   */
   app.post(`${P}/fetch-data/:pat_id/:filename`, (req:any, res:any)=> {
    const pat_id = req.params?.pat_id;
    const filename = req.params?.filename;
    if( !pat_id ){
      res.status(300).send('没有指定使用者')
      return
    }
    if( !filename ){
      res.status(301).send('没有指定文件名')
      return
    }
    logger.debug('指定使用者=', pat_id, '文件名=', filename);
    // 合并下载
    merge4download( pat_id, filename, res )
  });

  /********** 业务逻辑区 ************/

  /**
   * 加载JSON文件
   */
  app.get(`${P}/json/:target`,(req:any, res:any)=>{
    let target = req.params?.target
    if( !target ){
      res.status(300).send('没有指定文件名')
      return
    }
    send_json(res, loadJSON(target) )
  })

  /**
   * 获取任务清单
   */
  app.post(`${P}/tasks/:mode/:doc_id`,async (req:any, res:any)=>{
    const mode = req.params?.mode
    if( !mode ){
      res.status(300).send('没有指定任务分类')
      return
    }
    const doc_id = req.params?.doc_id
    if( !doc_id ){
      res.status(301).send('没有指定医生编号')
      return
    }
    const pageno = req.body?.pageno
    const pagecnt = req.body?.pagecnt
    let offset, rows
    if( pageno && pagecnt ) {
      rows   = pagecnt
      offset = ( pageno - 1 ) * rows
    }
    if( mode==TaskMode.Waiting ) send_json(res, {
      rows : await fetchWaitingTasks(doc_id, offset, rows),
      total: await fetchWaitingCount(doc_id),
    })
    else if( mode==TaskMode.Pending ) send_json(res, await fetchPendingTasks(doc_id) )
    else if( mode==TaskMode.History ) send_json(res, {
      rows : await fetchHistoryTasks(doc_id, offset, rows),
      total: await fetchHistoryCount(doc_id),
    })
    else send_json(res, [] )
  })

  /**
   * 接诊
   */
   app.get(`${P}/tasks/accept/:doc_id/:taskid`, async (req:any, res:any)=>{
    const doc_id = req.params?.doc_id
    if( !doc_id ){
      res.status(300).send('没有指定医生')
      return
    }
    const taskid = req.params?.taskid
    if( !taskid ){
      res.status(301).send('没有指定任务编号')
      return
    }
    const { error } = await acceptTask(doc_id, taskid)
    if( error ) send_json(res, null, error )
    else send_json(res, {doc_id, taskid})
  })

  /**
   * 取消任务
   */
  app.get(`${P}/tasks/cancel/:doc_id/:taskid`, async (req:any, res:any)=>{
    const doc_id = req.params?.doc_id
    if( !doc_id ){
      res.status(300).send('没有指定医生')
      return
    }
    const taskid = req.params?.taskid
    if( !taskid ){
      res.status(301).send('没有指定任务编号')
      return
    }
    const { error } = await cancelTask(doc_id, taskid)
    if( error ) send_json(res, null, error )
    else send_json(res, {doc_id, taskid})
  })

  /**
   * 诊断完成
   */
   app.get(`${P}/tasks/diagnosed/:doc_id/:taskid/:rep_id`, async (req:any, res:any)=>{
    const doc_id = req.params?.doc_id
    if( !doc_id ){
      res.status(300).send('没有指定医生')
      return
    }
    const taskid = req.params?.taskid
    if( !taskid ){
      res.status(301).send('没有指定任务编号')
      return
    }
    const rep_id = req.params?.rep_id
    if( !rep_id ){
      res.status(302).send('没有指定报告编号')
      return
    }
    const { error } = await diagnosedTask(doc_id, taskid, rep_id)
    if( error ) send_json(res, null, error )
    else send_json(res, {doc_id, taskid})
  })

  /**
   * 新增报告
   */
   app.post(`${P}/new-report`, async (req:any, res:any)=>{
    const report: T_REPORTS = req.body
    if( !report?.patient_id ){
      res.status(300).send('没有指定使用者')
      return
    }
    if( !report?.report_id ){
      res.status(301).send('没有指定报告')
      return
    }
    if( !report?.data_id ){
      res.status(303).send('没有指定数据文件')
      return
    }
    if( !report?.data_up_tm ){
      res.status(304).send('没有指定数据上传时间')
      return
    }
    try{
      await newReport( report )
      send_json(res, report)
    }catch(ex){
      send_json(res, null, ex )
    }
  })

  /** 用户注册区 */
  app.post(`${P}/wx-login/:unionId`, async (req:any, res:any)=> {
    const unionId = req.params?.unionId;
    const avatarUrl = req.body?.avatarUrl;
    if( !unionId ){
      res.status(300).send('没有指定unionId')
      return
    }
    // 通过unionId查找当前用户
    const results: Doctor[] = await find({ unionId })
    if( !results || results.length===0 ){
      // const doc: Doctor = { uuid: uuid(), unionId, avatarUrl, status: DoctorStatus.Checking }
      const doc: Doctor = { uuid: UUID.random(), unionId, avatarUrl, status: DoctorStatus.Checking }
      try{
        // 新用户登录, 保存unionId, avatarUrl
        await enroll( doc )
        // 返回不完整信息, 客户端需要填写注册资料
        send_json( res, { signup: 'Y', doctor: doc } )
      }catch(ex){
        console.error( ex )
        send_json( res, null, ex?.message||ex )
      }
    } else {
      const row: Row = results[0]
      const doc: Doctor = Object.assign({}, row)
      if( doc?.realname ) {
        // 基本信息已填, 返回完整用户信息, 客户端无需填写注册资料
        // json转换
        doc.division  = str2json( row?.division )
        doc.location  = str2json( row?.location )
        doc.rights    = str2json( row?.rights )
        send_json( res, { signup: 'N', doctor: doc } )
      } else {
        // 没有基本信息, 返回不完整信息, 客户端需要填写注册资料
        send_json( res, { signup: 'Y', doctor: doc } )
      }
    }
  });

  app.post(`${P}/signup`, async (req:any, res:any)=> {
    const doctor: Doctor = req.body;
    logger.debug("医生信息:", doctor)
    if( !doctor || !doctor?.uuid ){
      res.status(300).send('没有指定医生基本信息')
      return
    }
    try{
      // 更新医生信息
      await update( doctor )
      // 返回完整信息
      send_json( res, { doctor } )
    }catch(ex){
      console.error( ex )
      send_json( res, null, ex?.message||ex )
    }
  });

  /** 微信扫码登录重定向页面 */
  // app.get(`${P}/wx-login-callback`, async (req:any, res:any)=> {
  //   const code = req.query?.code
  //   const state = req.query?.state // sid-tasks
  //   if( state!=='sid-tasks' ){
  //     const error = '微信扫码登录时指定的state值错误'
  //     // TODO: 跳转到Error页面, 并传递error参数
  //   } else {
  //     // TODO: 跳转到Login页面, 并传递code参数
  //   }
  // })
}