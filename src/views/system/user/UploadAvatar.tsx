import WUpload from '@/components/Upload/index'
import { fileResType, getImage } from '@/apis/common'
import React from 'react'

const UploadAvatar:React.FC<{
    value:any,
    onChange:(value:any)=>void
}> = (props)=>{
    const { value, onChange } = props
    const [ fileList, setFileList ] = React.useState<Array<fileResType>>([])
    React.useEffect(()=>{
        if(!value) return
        getImage(value).then(res=>{
            setFileList(res.data)
        })
    },[])
    return <WUpload
        value={fileList}
        onChange={onChange}
        total={1}
        fileSize={5}
        datas={{
            fileType:'image',
            keywords:'avatar'
        }}
        options={{
            accept:'image/*'
        }}
    />
}

export default UploadAvatar