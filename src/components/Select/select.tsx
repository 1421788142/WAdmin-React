import { useOptions } from "@/hooks/useOption"
import { ApiType, OptionsContent } from "./type"
import { Empty, Select, Spin } from "antd"
import { useEffect, useMemo } from "react"
import _ from "loadsh";
import { filterPick } from "@/utils";

const WSelect = <
    T extends ApiType,
    O extends OptionsContent<T> = OptionsContent<T>
>( props:{
    api:T
    option:O
    args: Parameters<T>['length'] extends 0 ? undefined[] : Parameters<T>,
    value:any,
    onChange:(value:any)=>void,
} )=>{

    const {
        args,
        option,
        value,
        api,
        onChange,
    } = props

    // 初始化入参数据
    let paramsArgs = _.cloneDeep(args) as Parameters<T>;

    const { options, loading, getOptions } = useOptions(api,paramsArgs,{
        optionKey:option.optionKey,
        autoLoad:false,//默认都为不默认查询
    })
    useEffect(()=>{
        if(option.autoLoad){
            openSelect(true)
        }
    },[option.autoLoad])
    const openSelect = (value:boolean)=>{
        if(value && !options?.length){
            getOptions(...paramsArgs)
        }
    }

    const RoleSelect = useMemo(()=>{
        return <Select
            loading={loading}
            value={value}
            onDropdownVisibleChange={openSelect}
            onChange={onChange}
            options={options}
            {...filterPick(option,['optionKey','autoLoad','afterRequest'])}
            notFoundContent={loading ? 
            <div className="py-4 text-center">
                <Spin />
            </div> : <Empty description="暂无数据" />
            }
        ></Select>
    },[options,value,loading])

    return RoleSelect
}

export default WSelect