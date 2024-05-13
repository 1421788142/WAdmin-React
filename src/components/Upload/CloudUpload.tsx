import { CloudUploadOutlined } from "@ant-design/icons"
import { Alert, Button, Table, Image, Progress, Upload, theme } from "antd"
import WModal from "../Modal"
import React, { useContext, useMemo } from "react"
import { ColumnsType } from "antd/es/table"
import { formatBytes } from './util'
import { UploadContext } from "."
import { UploadContextType, UploadPropsType } from "./type"
import { STATUS_ENUM, STATUS_TEXT_ENUM } from '@/enums/upload'
import { deleteImage } from '@/apis/common';

const CloudUpload = ()=>{
    const {
        total,
        fileAction,
        fileSize,
        options,
        cloudFile,
        antdApp,
        loading,
        setCloudFile,
        customRequest,
        beforeUpload,
        handleChange,
        saveCloud
    } = useContext<UploadPropsType & UploadContextType>(UploadContext);
    const { colorErrorText } = theme.useToken().token;
    const columns = [
        {   
            title: '缩略图',
            dataIndex: 'url',
            render:(value)=>{
                return <Image width={80} height={80} src={value}></Image>
            },
            align:'center',
            width:120
        },
        {
            title: '文件名',
            dataIndex: 'name',
            align:'center',
            render:(value,record)=>{
                return (<>
                    <div>{ value }</div>
                    <Progress status={ STATUS_ENUM[record.status] } percent={record.progress} />
                </>)
            }
        },
        {
            title: '文件大小',
            dataIndex: 'size',
            align:'center',
            render:(value)=>{
                return (<>
                    { formatBytes(value) }
                </>)
            },
            width:120
        },
        {
            title: '状态',
            dataIndex: 'status',
            align:'center',
            width:120,
            render:( value:'done' | 'error' | 'uploading' )=>{
                return (<span style={{ color: value === 'error' ? colorErrorText : '' }}>
                    { STATUS_TEXT_ENUM[value]}
                </span>)
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            align:'center',
            fixed:'right',
            width:120,
            render:(value,record)=>{
                return (<>
                    <Button disabled={ record.status === 'uploading' } danger type="text" onClick={ async ()=>{
                        if ( record.status === 'done' ) {
                            let res = await deleteImage(record.uid)
                            if(res.code === 200){
                                delFn(record.uid)
                            } else {
                                antdApp.message.error('删除失败')}
                        } else {
                            delFn(record.uid)
                        }
                    }}>删除</Button>
                </>)
            }
        },
    ] as ColumnsType<UploadContextType['cloudFile'][number]>
    
    const delFn = (uid:string)=>{
        setCloudFile((oldValue)=>{
            return oldValue.filter(f=>f.uid !== uid)
        })
    }

    // 上传地址
    const [ action, setAction ] = React.useState<string>('')
    const [ open, setOpen ] = React.useState<boolean>(false)
    React.useEffect(()=>{
        // 设置请求前缀
        setAction(`${import.meta.env.VITE_API_URL}${fileAction}`)
    },[])

    const AlertRender = useMemo(()=>{
        return (<>
            <Alert message={`支持${options.accept}格式，单个文件不超过${fileSize}MB，最多只能上传${total}个文件`} type="warning" showIcon />
        </>) 
    },[])

    const saveDisabled = useMemo(()=>{
        return !cloudFile.some(x=>x.status === 'done')
    },[ cloudFile ])

    const uploadDisabled = useMemo(()=>{
        return cloudFile.every(x=>x.status === 'done')
    },[ cloudFile ])

    return <>
        <Button type='primary' onClick={()=>setOpen(true)} icon={
            <CloudUploadOutlined />
        }>上传</Button>

        <WModal
            option={{
                width:1000,
                open,
                title:'上传',
                onCancel:()=>setOpen(false),
                footer:()=>{
                    return (<div className="p-4 pb-4">
                        <Button disabled={loading} onClick={()=>setOpen(false)}>取消</Button>
                        <Button
                            loading={loading}
                            onClick={()=>customRequest()}
                            type="primary"
                            disabled={!cloudFile.length || uploadDisabled}
                        >开始上传</Button>
                        <Button
                            loading={loading}
                            disabled={ saveDisabled }
                            onClick={()=>saveCloud()}
                        >保存</Button>
                    </div>)
                }
            }}
        >
            <div className="flex items-center justify-between my-4">
                { AlertRender }
                <Upload
                    action={action}
                    fileList={[]}
                    {...options}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    customRequest={()=>{}}
                >
                    <Button type="primary" loading={loading}>选择文件</Button>
                </Upload>
            </div>
            <Table
                bordered
                pagination={false}
                rowKey={'uid'}
                dataSource={cloudFile}
                columns={columns}
            />;
        </WModal>
    </>
}

export  default CloudUpload