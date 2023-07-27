import { accessSync, constants, mkdirSync, readFileSync, renameSync, unlinkSync } from "fs";
import { resolve } from "path";
import { IncomingForm } from "formidable";
import { UUID, uuid } from "../../utils/uuid";
import { ts } from "../../utils/date";
import { mkdirIfNotExist } from "./common";
import { getDefaultConf } from "../../config";
import { ConfigOptions } from "../../config/interface";
import { CONF_OPTIONS } from "../../utils/constants";
import { _G_VAR_GET } from "../../utils/global";

/**
 * 图片上传、读取、删=除
 */
const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
// const upload_image  = `./image`
// const upload_cache = `./cache`
const upload_cache = options?.dirs?.cache
const upload_image = options?.dirs?.image
mkdirIfNotExist(upload_image)
mkdirIfNotExist(upload_cache)

export function fetch(filename: string, res: any) {
  let filepath = resolve(upload_image, filename);
  //判断文件是否存在
  try {
    accessSync(filepath, constants.F_OK);
  } catch (err) {
    res.status(404).end('图片不存在')
    return
  }
  let content = readFileSync(filepath, "base64");
  content = 'data:image/' + getImageType(filename) + ';base64,' + content;
  //返回结果
  res.writeHead(200, "OK");
  res.write(content); //格式必须为 binary，否则会出错
  res.end();
}

export function uploadWithAutoUUID(req: any, res: any) {
  const form: any = new IncomingForm();
  form.uploadDir = upload_cache;
  form.keepExtensions = true;
  form.maxFileSize = 2 * 1024 * 2014;
  form.multiples = false;
  form.parse(req, (err: any, fields: any, files: any) => {
    if (err) {
      console.error('上传文件出错：', err);
      res.status(500).end('上传文件出错');
      return;
    }
    try {
      const keys: any = Object.keys(files)
      let image = files[keys[0]]
      // console.log( image )
      const extname = getImageExt(image?.mimetype)
      // const filename = `${uuid()}.${extname}`
      const filename = `${UUID.random()}.${extname}`
      renameSync(image?.path || image?.filepath, resolve(upload_image, filename));
      res.status(200).jsonp(
        {
          filename,
          size: image.size,
          type: image.mimetype,
        }
      );
    } catch (ex) {
      console.error(ex)
      res.status(500).end('上传图片出错')
    }
  })
}

export function uploadWithFilename(req: any, res: any, fname: string) {
  //判断是否存在@字符，如有则替换为时间戳
  const at = fname.search(/@/)
  if (at !== -1) {
    fname = fname.replace(/@/, `${ts()}`)
  }
  console.log('删除原文件');
  try {
    const _path = resolve(upload_image, fname)
    accessSync(_path)
    console.log('原文件存在，进行删除')
    try {
      unlinkSync(_path)
    } catch (ex1) {
      console.log('原文件删除失败')
      res.status(500).end('原文件删除失败')
      return
    }
  } catch (ex2) {
    console.log('原文件不存在')
  }
  console.log('开始上传图片');
  const form: any = new IncomingForm();
  form.uploadDir = upload_cache;
  form.keepExtensions = true;
  form.maxFileSize = 2 * 1024 * 2014;
  form.multiples = true;
  form.parse(req, (err: any, fields: any, files: any) => {
    if (err) {
      console.error('上传文件出错：', err);
      res.status(500).end('上传文件出错');
      return;
    }
    try {
      const keys: any = Object.keys(files)
      let image = files[keys[0]]
      renameSync(image?.path || image?.filepath, resolve(upload_image, fname));
      res.status(200).jsonp(
        {
          filename: fname,
          size: image.size,
          type: image.mimetype,
        }
      )
    } catch (ex) {
      console.error(ex)
      res.status(500).end()
    }
  })
}

export function deleteImage(res: any, fname: string) {
  console.log('删除原文件');
  try {
    const _path = resolve(upload_image, fname)
    accessSync(_path)
    console.log('原文件存在，进行删除')
    try {
      unlinkSync(_path)
      res.status(200).end('原文件删除成功')
    } catch (ex1) {
      console.log('原文件删除失败')
      res.status(500).end('原文件删除失败')
      return
    }
  } catch (ex2) {
    console.log('原文件不存在')
    res.status(500).end('原文件不存在')
  }
}

export function deleteImages(res: any, images: any[]) {
  let arr = []
  if (typeof images === 'string') {
    try {
      arr = JSON.parse(images)
    } catch (jsex) {
      res.status(500).end('指定文件格式错误', images)
      return
    }
  }
  if (!arr || arr.length <= 0) {
    res.status(500).end('没有指定文件', images)
    return
  }
  console.log('批量删除原文件', arr);
  let counter = 0
  arr.map((f: string) => {
    try {
      const _path = resolve(upload_image, f)
      accessSync(_path)
      console.log('原文件存在，进行删除', f)
      try {
        unlinkSync(_path)
        counter++
      } catch (ex1) {
        console.log('原文件删除失败', f)
      }
    } catch (ex2) {
      console.log('原文件不存在', f)
    }
  })
  res.status(200).end(`已删除${counter}/${arr.length}`)
}

//获取当前图片的格式
function getImageType(filename: string) {
  var reg = /\.(png|jpg|gif|jpeg|webp)$/
  const arr = filename?.match(reg)
  if (arr) return arr[1]
  return 'png'
}

function getImageExt(miniType: string) {
  var reg = /\/(png|jpg|gif|jpeg|webp)$/
  const arr = miniType?.match(reg)
  if (arr) return arr[1]
  return 'png'
}