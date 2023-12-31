import { store } from '@/redux'
import { TableContextType, TablePropsType, RecordType } from '../types/type';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { getCurrentRouter } from "@/utils/currentRouter"
import { Api } from '@/hooks/types/api';

const Tabelhead = <T extends Api, O extends RecordType<T>>(props:{
    subTitle:TablePropsType<T,O>['subTitle'],
    selected:TableContextType<T,O>['selected'],
    TableTitleRender:TablePropsType<T,O>['TableTitleRender'],
    TableHeaderRender:TablePropsType<T,O>['TableHeaderRender'],
    children?:React.ReactNode
})=>{
    const {
        TableTitleRender,
        TableHeaderRender,
        subTitle,
        children,
        selected
    } = props

    const { title } = getCurrentRouter()

    const HeaderRender = useMemo(()=>{
        return <>
            <div className="flex min-w-min">
                {/* 按钮插槽 isSelected 是否已选择, selectedList根据key所取的data数据集合 */}
                { 
                    TableHeaderRender &&
                    <TableHeaderRender
                        {...selected}
                    />
                }
            </div>
        </>
    },[selected,TableHeaderRender])

    return (
        <div className="w-full mb-2">
            <div className="flex items-center justify-between">
                {/* 左侧标题部分 */}
                <div className='flex items-center max-w-[25%]'>
                    {
                        TableTitleRender ?
                        <TableTitleRender/> :
                        <div className="text-lg">
                            <span className='mr-2 truncate'>{ title }</span>
                            { subTitle && 
                                <Tooltip placement='right' title={ subTitle }>
                                    <InfoCircleOutlined className='cursor-pointer'/>
                                </Tooltip>
                            }
                        </div>
                    }
                </div>
                    
                {/* 右侧操作部分 */}
                <div className='flex items-center max-w-[70%] overflow-auto'>
                    { HeaderRender }
                    { children }
                </div>
            </div>  
        </div>
    )
}

export default Tabelhead