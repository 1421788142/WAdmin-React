import { EyeOutlined } from "@ant-design/icons"
import { Button, Table, Tooltip, Image, App, UploadFile } from "antd"
import WModal from "../Modal"
import React, { useContext } from "react"
import { ColumnsType } from "antd/es/table"
import { UploadContextType, UploadPropsType } from "./type"
import { UploadContext } from "."
import { deleteImage } from "@/apis/common"

const UploadOk = () => {
  const {
    baseFile,
    antdApp,
    setBaseFile,
    onChange
  } = useContext<UploadPropsType & UploadContextType>(UploadContext);
  const [open, setOpen] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)

  const OperateRender = (value:string,record:UploadFile)=>{
    return (<>
      <Button loading={loading} danger type="text" onClick={() => {
        antdApp.modal.confirm({
          title:'删除提示',
          content: `是否确定删除${record.name}?`,
          onOk: async ()=>{
            setLoading(true)
            let res = await deleteImage(record.uid)
            if(res.code === 200){
              let newBaseFile = baseFile.filter(f=>f.uid !== record.uid)
              onChange(newBaseFile.map(m=>m.uid).join(','))
              setBaseFile(newBaseFile)
            }
            setLoading(false)
          }
        })
      }}>删除</Button>
    </>)
  }

  const columns = [
    {
      title: '缩略图',
      dataIndex: 'url',
      render: (value) => {
        return <Image width={80} height={80} src={value}></Image>
      },
      align: 'center',
      width: 120
    },
    {
      title: '文件名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: OperateRender
    },
  ] as ColumnsType<UploadFile>

  return (<>
    <Tooltip placement="topLeft" className="ml-2" title='已上传'>
      <Button onClick={() => setOpen(true)}>
        <EyeOutlined />
      </Button>
    </Tooltip>
    <WModal
      option={{
        width: 1000,
        open,
        title: '上传',
        onCancel: () => setOpen(false),
        footer: () => {
          return (<div className="p-4 pb-4">
            <Button onClick={() => setOpen(false)}>取消</Button>
          </div>)
        }
      }}
    >
      <Table
        bordered
        pagination={false}
        rowKey={'uid'}
        dataSource={baseFile}
        columns={columns}
      />;
    </WModal>
  </>)
}

export default UploadOk