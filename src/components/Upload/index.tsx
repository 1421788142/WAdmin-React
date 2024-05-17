import React, {  useState, createContext, useMemo } from 'react';
import type { UploadProps } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import './index.less'
import CloudUpload from './CloudUpload';
import UploadOk from './UploadOk';
import { UploadContextType, UploadPropsType } from './type';
import { deleteImage, fileResType, imageUpUrl, uploadImg } from '@/apis/common';
import { App, Upload } from 'antd'
import { t } from 'i18next';
import { uploadSize, uploadRule, getBase64 } from './util'
import { useLimitedRequest } from '@/utils';

export const UploadContext = createContext<any>(null)
const WUpload: React.FC<UploadPropsType> = (props) => {
  // 设置默认
  const defaultProps = useMemo(()=>{
    return {
      total:5,
      fileSize:2,
      fileAction:imageUpUrl,
      ...props,
      options:{
        name: 'file',
        accept:'image/*',
        ...props.options
      },
    }
  },[props])

  const antdApp = App.useApp()

  // 待上传
  const [ cloudFile, setCloudFile ] = React.useState<UploadContextType['cloudFile']>([])
  // 已上传
  const [ baseFile, setBaseFile ] = React.useState<Array<UploadFile>>([])
  const [ loading, setLoading ] = React.useState<boolean>(false)

  React.useEffect(()=>{
    setBaseFile(()=>{
      return defaultProps.value.map(x=>{
        return {
          uid:x.fileId,
          name:x.fileName,
          status:'done',
          url:x.filePath
        }
      })
    })
  },[ defaultProps.value ])

  const warningMsg = (text:string,option:Record<string,any>)=>{
    antdApp.message.warning(`${t(text, option)}`)
  }

  // 文件上传生成临时base64
  const handleChange: UploadProps['onChange'] = async ({ fileList }) =>{
    const newFiles = fileList.map(async (m)=>{
      const base64 = await getBase64(m.originFileObj as RcFile)
      return {
        ...m,
        url:base64,
        status:'loading' as UploadContextType['cloudFile'][number]["status"],
        progress:0
      }
    })

    Promise.all(newFiles).then((newV)=>{
      setCloudFile((oldValue)=>{
        let uniqueArray = [...oldValue,...newV]
        const idMap = new Map();
        uniqueArray.forEach(item => {
          if (!idMap.has(item.uid)) {
            idMap.set(item.uid, item);
          }
        });
        return Array.from(idMap.values())
      })
    })
  }

  // 上传前的钩子
  const beforeUpload = (file:UploadFile) => {
    if (!uploadSize(file,defaultProps.fileSize,warningMsg) || !uploadRule(file,warningMsg)) { //判断文件类型,大小
      return Upload.LIST_IGNORE
    }
    return true
  }

  // 设置 newUid 上传成功后数据库保存的id
  const _setCloudFile = (item:UploadContextType['cloudFile'][number] & { newUid?:string })=>{
    setCloudFile((oldValue)=>{
      return oldValue.map(x=>{
        if(x.uid === item.uid){
          return { ...item, uid:item.newUid || item.uid }
        }
        return x
      })
    })
  }

  // 确认上传
  const customRequest = async ()=>{
    if(cloudFile.length > defaultProps.total) return warningMsg('messages.uploadMaxNum',{ num:defaultProps.total })
    setLoading(true)
        // 批量上传
    const tasks = cloudFile.filter(x=>x.status !== 'done').map(item=> async ()=>{
      const formData = new FormData()
      formData.append('file',item.originFileObj as RcFile)
      for(const key in defaultProps.datas){
        formData.append(key,defaultProps.datas[key])
      }
      return uploadImg(formData,(e)=>{
        // 进度条
        let progress = Math.round(e.loaded / (e.total || 1) * 100)
        // 监听上传进度
        _setCloudFile({ ...item, progress })
      }).catch(()=>{
        // 上传失败
        _setCloudFile({ ...item, status:'error' })
        setLoading(false)
      }).then((res)=>{
        const { data, code, message } = res as Result<fileResType>
        if(code === 200){
          _setCloudFile({ ...item, progress:100, newUid:data.fileId, status:'done' })
        } else {
          _setCloudFile({ ...item, status:'error' })
          antdApp.message.error(message)
        }
      }) as Promise<Result<fileResType>>
    })
    await useLimitedRequest(tasks,2)
    setLoading(false)
  }

  // 批量删除已上传的
  const delBaseFile = async (baseFiles: UploadContextType['baseFile'])=>{
    await Promise.all(baseFiles.map( async x=>{
      await deleteImage(x.uid)
    }))
  }

  // 保存已上传的文件
  const saveCloud = async ()=>{
    const hasCloud = cloudFile.filter(x=>x.status === 'done')
    // 总数一条直接替换
    if(defaultProps.total === 1){
      // 先删除
      await delBaseFile(baseFile)
      _changeValue(hasCloud.map(x=>x.uid).join(','))
      setBaseFile(hasCloud.map(x=>({...x})) as any)
      setCloudFile([])
    } else {
      // 新上传的加上已上传的大于大于最大数量 则提示用户先删除部分已上传
      if(baseFile.length + hasCloud.length > defaultProps.total){
        return warningMsg('messages.uploadMaxNumOut',{ num:defaultProps.total })
      } else {
        _changeValue([ ...hasCloud.map(x=>x.uid), ...baseFile.map(x=>x.uid) ].join(','))
        setBaseFile((oldValue)=>{
          return [ ...hasCloud.map(x=>({...x})) as any, ...oldValue]
        })
        setCloudFile((oldValue)=>{
          return oldValue.filter(x=>x.status !== 'done')
        })
      }
    }
  }

  // 触发父组件修改value值函数
  const _changeValue = (ids:string)=>{
    defaultProps.onChange(ids)
  }
  
  return (
    <UploadContext.Provider value={{
      ...defaultProps,
      baseFile,
      cloudFile,
      antdApp,
      loading,
      customRequest,
      beforeUpload,
      handleChange,
      setBaseFile,
      setCloudFile,
      saveCloud
    }}>
      <div>
        <CloudUpload/>
        <UploadOk/>
      </div>
    </UploadContext.Provider>
  );
};

export default WUpload;