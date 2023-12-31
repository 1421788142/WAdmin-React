import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload';

export const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const uploadSize = (
    file: UploadFile,
    fileSize: number,
    warningMsg: (text: string, option: Record<string, any>) => void
): boolean => {
    const isMax = (file.size || 0) / 1024 / 1024 < fileSize;
    if (!isMax) warningMsg('messages.fileSizeMax', { num: fileSize })
    return isMax
}

const imgType = ["jpeg", "jpg", "png"]; //图片类型
const videoType = ["mp4"]; //视频类型
export const uploadRule = (
    file: UploadFile,
    warningMsg: (text: string, option: Record<string, any>) => void
): boolean => {
    let isFileType = imgType.filter(v => file.type === `image/${v}`).length > 0;
    if (!isFileType) warningMsg('messages.fileType', { type: imgType.join("/") });
    return isFileType;
};