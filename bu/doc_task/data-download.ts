import { accessSync, constants, createWriteStream, unlink } from "fs";
import { mkdirIfNotExist } from "./common";
import * as archiver from 'archiver'
import { resolve } from "path";
import { fetchPatData, generateRepBuf } from "./rep";
import { ConfigOptions } from "../../config/interface";
import { CONF_OPTIONS } from "../../utils/constants";
import { _G_VAR_GET } from "../../utils/global";
import { getDefaultConf } from "../../config";

const options: ConfigOptions = _G_VAR_GET(CONF_OPTIONS) || getDefaultConf()
// const data_cache = `./cache`
// const datfile = `./datfile` // 与接收监听程序保存数据文件的目录保持一致
const data_cache = options?.dirs?.cache
const datfile = options?.dirs?.dat
mkdirIfNotExist(data_cache)
mkdirIfNotExist(datfile)

export async function merge4download(pat_id:string, filename:string, res:any){
  /**
   * 参数校验
   */
  const pat = await fetchPatData( pat_id )
  if( !pat ){
    console.error('指定使用者不存在')
    res.status(404).end('指定使用者不存在')
    return
  }
  const rep_data = generateRepBuf({
    name  : pat?.name,
    age   : pat?.age,
    gender: pat?.gender
  })
  let dat_file = resolve(datfile, filename)
  try {
    accessSync( dat_file, constants.F_OK )
  } catch (ex) {
    console.error( ex?.message||ex )
    res.status(405).end('指定数据文件不存在')
    return
  }

  /**
   * 合并文件处理
   */
  const cache_output_filename = `${pat_id}-${filename}.zip`
  const cache_output_filepath = resolve(data_cache, cache_output_filename)
  const output = createWriteStream( cache_output_filepath )
  const archive = archiver('zip', { zlib: { level: 9 } })
  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    // 整个文件合并完成后就提供下载
    res.download(cache_output_filepath, (err:any)=>{
      if( err ) {
        console.error( "提交下载时出现异常:", err?.message||err )
        res.status(500).end('提交下载时出现异常')
      } else console.log('下载至客户端')
      // 删除临时文件
      unlink( cache_output_filepath, err=>{
        if( err ) console.error( "清理临时文件失败:", err?.message||err )
        else console.log('已清理临时文件:', cache_output_filepath)
      })
    })
  });
  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', function() {
    console.log('Data has been drained');
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err) {
    console.warn( err )
    if (err.code === 'ENOENT') { // no such file or directory
      res.status(404).end(`合并文件时发生警告: ${err?.message}`)
    } else {
      res.status(500).end(`合并文件时发生警告: ${err?.message}`)
    }
  });
  // good practice to catch this error explicitly
  archive.on('error', function(err) {
    console.error( err )
    res.status(500).end(`合并文件时发生异常: ${err?.message}`)
  });

  // pipe archive data to the file
  archive.pipe( output );

  // 获取使用者信息, append到archive中, 命名为.rep
  archive.append(rep_data, { name: `${pat_id}.rep` });
  // 获取DAT文件, 并file到archive中, 命名为.dat
  archive.file(dat_file, { name: `${pat_id}.dat` });
  
  // finalize the archive (ie we are done appending files but streams have to finish yet)
  // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
  archive.finalize();
}