// import { WUpload, fileList } from './interface/upload'
// import { uploadFile } from '@/apis/common'
// import { t } from 'i18next';
// import { useImmer } from 'use-immer';
// import { useEffect, useState } from "react";
// import {
//     UploadProps,
//     Upload,
//     message,
//     UploadFile,
    
// } from 'antd'

// export const useUpload = ({
//     uploadRule,
//     fileSize,
//     total,
//     fileAction,
//     handUpload,
//     beforeLoad,
// }: WUpload.hookProps) => {
//     // 页面显示的文件
//     const [ fileList, setFile ] = useImmer<fileList[]>([])
//     // 待上传文件
//     const [ notFileList, setNotFile ] = useImmer<fileList[]>([])
//     // 上传地址
//     const [ action, setAction ] = useState<string>('')
//     // 预览弹窗
//     const [ priview, setPriview ] = useState<{
//         previewOpen: boolean
//         previewImage: fileList
//         previewTitle: string
//     }>({
//         previewOpen:false,
//         previewImage: null as unknown as fileList,
//         previewTitle: '',
//     })

//     useEffect(()=>{
//         // 设置请求前缀
//         setAction(`${import.meta.env.VITE_API_URL}${fileAction}`)
//     },[])

//     // 处理默认fileList
//     const setFileList = (fileList: UploadProps['fileList']) => {
//         beforeLoad ? beforeLoad(fileList) : setFile(fileList || [])
//     }

//     const uploadSize = (file: UploadFile): boolean => {
//         const isMax = (file.size as number) / 1024 / 1024 < fileSize;
//         if (!isMax) message.warn(`${$$t('messages.fileSizeMax', { num: fileSize })}`)
//         return isMax
//     }

//     const beforeUpload = (file: UploadFile, fileList: UploadProps['fileList']) => {
//         if (state.fileListData.length >= total) {
//             message.warn(`${$$t('messages.uploadMaxNum', { num: total })}`)
//             return false
//         }
//         if (!uploadSize(file) || !uploadRule(file)) { //判断文件类型,大小
//             setTimeout(() => state.fileListData.pop(), 100)
//             return false
//         }
//         if (handUpload) { //自定义上传
//             state.notFileList.push(file)
//             return false
//         }
//         return true
//     }

//     // 变化事件
//     const upChange = (info: UploadChangeParam<UploadFile<uploadFile>>) => {
//         let { status, response } = info.file
//         if (status === 'done') {
//             let { code, data, message: msg } = response
//             state.fileListData.pop()
//             if (code === 200) {
//                 state.fileListData.push({
//                     url: data.url,
//                     status: 'done',
//                     uid: String(data.id),
//                     name: data.name
//                 })
//                 setEmit('change', state)
//             } else {
//                 message.warn(msg ?? $$t('messages.uploadFailed'))
//             }
//         } else if (status === 'removed') {
//             state.notFileList = state.notFileList.filter(x => x.uid !== info.file.uid)
//             setEmit('change', state)
//         }
//     }

//     // 手动上传
//     const handUploadFn = () => {
//         setEmit('handUpload', state)
//     }

//     const handlePreview = (flie: fileList) => {
//         state.visible = true
//         state.currentFile = flie
//     }

//     return {
//         ...toRefs(state),
//         beforeUpload,
//         upChange,
//         setFileList,
//         handUploadFn,
//         handlePreview
//     }
// }