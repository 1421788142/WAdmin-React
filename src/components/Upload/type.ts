import { fileResType } from '@/apis/common';
import { useAppProps } from 'antd/es/app/context';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import { UploadFileStatus } from 'antd/es/upload/interface';

export type UploadPropsType = {
    value: Array<fileResType>,
    onChange: (value: any) => void,
    fileSize?: number,
    total?: number,
    fileAction?: string,
    datas: Record<string, any>,
    options: UploadProps
}

export type UploadContextType = {
    antdApp: useAppProps,
    loading: boolean,
    customRequest: () => void,
    saveCloud: () => Promise<void>
    beforeUpload: (file: UploadFile) => Promise<boolean> | boolean,
    handleChange: (value: { fileList: Array<UploadFile> }) => void,
    cloudFile: Array<Omit<UploadFile, 'status'> & {
        progress: number,
        status: UploadFileStatus | 'loading'
    }>,
    setCloudFile: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>,
    baseFile: Array<UploadFile>,
    setBaseFile: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>
}