import { Http } from "@/plugins/axios";
import { tableResultData, tableParamsType } from '@/apis/interface'
import { AxiosProgressEvent } from "axios";
import { CONTENT_TYPE_ENUM } from "@/enums/httpEnum";

//图片返回
export interface fileResType {
    fileId: string
    fileName: string
    filePath: string
    fileSize: number
    fileType: string
    id: number
    keywords: string
    remark: string
    userId: string
}

export interface fileParamsType {
    fileType: string,
    keywords: string
}

export const imageUpUrl = '/upload/image' //上传图片
export const videoUpUrl = '/upload/video' //上传视频
// 上传图片
export const uploadImg = (data: FormData, onUploadProgress: (value: AxiosProgressEvent) => void = () => { }) => {
    return Http.post<fileResType>({
        url: imageUpUrl,
        data,
        // 显示进度条
        onUploadProgress,
        headers: {
            'Content-Type': CONTENT_TYPE_ENUM.FORM_URLENCODED
        }
    }, { preventDuplication: true })
}
// 根据图片id获取图片
export const getImage = (fileIds: string) => {
    const data = { fileIds, fileType: 'image' }
    return Http.get<Array<fileResType>>({
        url: '/upload/get', data,
    })
}
// 删除图片
export const deleteImage = (fileIds: string) => {
    const data = { fileIds, fileType: 'image' }
    return Http.delete({ url: '/upload/delete', data }, { joinParamsToUrl: true })
}

// 获取通用参数
export interface generalParamType {
    name: string,
    color?: string,
    value: number,
    valueType: number,
    id: number
}
export const generalParam = (data: tableParamsType & {
    valueType: string
}) => {
    // return Http.get<tableResultData<generalParamType>>({ url: '/generalParameters', data })
}