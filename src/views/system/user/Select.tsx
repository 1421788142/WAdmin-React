import { roleList } from "@/apis/system/role"
import WSelect from "@/components/Select/select"

// 角色select
const SelectRole:React.FC<{
    value:any,
    onChange:(value:any)=>void,
    autoLoad:boolean
}> = (props)=>{
    const { value, onChange, autoLoad } = props
        return <WSelect
        api={roleList}
        args={[{ pageNum: -1 }]}
        option={{
            optionKey:{
                label:'roleName',
                value:'roleId'
            },
            autoLoad,
            allowClear:!autoLoad
        }}
        value={value}
        onChange={onChange}
    />
}

export default SelectRole