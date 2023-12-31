import React, { memo, useMemo, useState } from 'react';
import Icon, * as Icons from '@ant-design/icons';
import { Input, Popover, Pagination, App } from 'antd';
import './index.less'

const AntdIconPick:React.FC<Partial<{
    value:keyof typeof Icons,
    onChange:(value:any)=>void
}>> = (props)=>{
    const [ current, setCurrent ] = useState<number>(1);
    const [ pageSize, setPageSize ] = useState<number>(48);
    const getTotal = useMemo<number>(() => {
        return Object.entries(Icons).map(([key,value])=>value).filter(x=>!(x instanceof Function)).length
    },[Icons]);
    
    const app = App.useApp();

    const UseIcons = useMemo(()=>{
        const IconAll:Array<{
            key:keyof typeof Icons,
            value: React.ForwardRefExoticComponent<any>
        }> = Object.entries(Icons).map(([key,value])=>{
            if([
                'default',
                'setTwoToneColor',
                'createFromIconfontCN',
                'getTwoToneColor',
                'IconProvider'
            ].includes(key)){ // 过滤掉不需要的方法
                return 'none' as any
            } else {
                return {
                    key,
                    value
                }
            }
        }).filter(x=>x !== 'none')

        const offset = (current - 1) * Number(pageSize);

        return (<>
            { (offset + Number(pageSize) >= IconAll.length ?
                IconAll.slice(offset,IconAll.length) :
                IconAll.slice(offset,offset + Number(pageSize))
            ).map((item,index)=>{
                return <div 
                    key={item.key}
                    onClick={()=>{
                        props.onChange?.(item.key)
                    }}
                    className={[
                        'w-[30px] icon-pick h-[30px] text-xl flex justify-center items-center m-1 cursor-pointer',
                        (props.value === item.key ? 'active' : ''),
                    ].join(' ')}
                >
                    <Icon component={item.value} />
                </div>
            })}
        </>)
    },[Icons,current,pageSize,props.value])
    
    const addonAfterIcon = useMemo<keyof typeof Icons>(()=>{
        if(Icons[props.value as keyof typeof Icons]){
            return props.value as keyof typeof Icons
        } else {
            // 初始化时 延迟提示 不然会报错
            setTimeout(()=>{
                props.value && app.message.warning('输入的图标不存在')
            },200)
            return 'AccountBookFilled'
        }
    },[Icons,props.value])

    return (<Input {...props} addonAfter={
            <Popover
                overlayStyle={{ width: '400px' }}
                trigger='click'
                placement='bottom'
                content={<>
                    <div style={{ width: '380px', height: '250px', overflow: 'auto' }}>
                        <div className="grid grid-cols-8 gap-2 p-1">
                            { UseIcons }
                        </div>
                    </div>
                    <div className="pt-2 text-center">
                        <Pagination
                            show-less-items
                            className="w-[100%]"
                            total={getTotal}
                            current={current}
                            pageSize={pageSize}
                            showSizeChanger={false}
                            onChange={(page, pageSize)=>{
                                setCurrent(page)
                                setPageSize(pageSize)
                            }}
                        />
                    </div>
                </>}
            >
                <Icon className='text-lg cursor-pointer' component={Icons[addonAfterIcon] as React.ForwardRefExoticComponent<any>}></Icon>
            </Popover>
        }>
    </Input>)
}

export default memo(AntdIconPick)