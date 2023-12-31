import {
    Tooltip,
    Popover,
    Checkbox,
    Divider
} from 'antd';
import {
    SettingOutlined,
    DragOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined
} from '@ant-design/icons/lib/icons';
import { t } from 'i18next';
import { Fragment, useMemo, useRef } from 'react'
import { deepClone } from '@/utils';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import Sortablejs, { SortableEvent } from "sortablejs";
import type Sortable from "sortablejs";
import { isNullAndUnDef } from "@/utils/is";
import { WTableColumn } from '../types';
import { Api } from '@/hooks/types/api';
import { RecordType } from '../types/type';

const TableColSetting = <T extends Api, O extends RecordType<T>>(props:{
    columns: WTableColumn<O, keyof O>[],
    setState: React.Dispatch<React.SetStateAction<WTableColumn<O, keyof O>[]>>,
})=>{

    const {
        columns,
        setState
    } = props

    // 左侧箭头css
    const arrowClass = (item: WTableColumn<O, keyof O>, placement: 'left' | 'right') => {
        return !item.show
        ? "!text-gray-200 cursor-not-allowed"
        : item.fixed === placement
        ? "!text-sky-700"
        : item.show
        ? "!text-gray-400"
        : "!text-gray-200";
    }

    // 选中的列
    const checkedCol = useMemo(()=>{
        return columns.filter(f=>f.show).map(m=>m.dataIndex)
    },[columns])

    // 修改列是否显示
    const setChecked = (checkedValue:Array<CheckboxValueType>)=>{
        let columnList = deepClone<Array<WTableColumn<O, keyof O>>>(props.columns);
        columnList.forEach(
            item => (item.show = checkedValue.some(x => item.dataIndex === x)),
        );
        setState(columnList)
    }

    // 固定列
    const setupFixed = (key:keyof O | 'operation', placement: 'left' | 'right')=>{
        let columnList = deepClone<Array<WTableColumn<O, keyof O>>>(columns);
        let num = 0;
        columnList.forEach((item, index) => {
          if (item.dataIndex === key && item.show) {
            num++;
            if (num === 1) {
              item.fixed = item.fixed ? "" : placement as any;
              if (item.fixed === "left") {
                columnList.splice(0, 0, columnList[index]);
                columnList.splice(index + 1, 1);
              } else if (item.fixed === "right") {
                columnList.splice(columnList.length, 0, item);
                columnList.splice(index, 1);
              }
            }
          }
        });
        setState(columnList)
    }

    // 拖拽排序
    let sortable: Sortable;
    let inited = false;
    let columnListRef = useRef(null);
    const newColumn = useRef<any>(null)
    newColumn.current = columns

    const handleVisibleChange = () => {
        setTimeout(() => {
            const el = columnListRef.current as any;
            if (inited || !el) return;
            sortable = Sortablejs.create(el, {
                animation: 500,
                delay: 400,
                delayOnTouchOnly: true,
                handle: ".drag-outlined",
                onEnd: (evt: SortableEvent) => {
                    const { oldIndex, newIndex } = evt;
                    if (
                        isNullAndUnDef(oldIndex) ||
                        isNullAndUnDef(newIndex) ||
                        oldIndex === newIndex
                    )
                    return;
                    let columnList = deepClone<Array<WTableColumn<O, keyof O>>>(newColumn.current);
                    // 发现有固定则退出拖拽
                    if (columnList[oldIndex]?.fixed || columnList[newIndex]?.fixed) return;
                    if (oldIndex > newIndex) {
                        columnList.splice(newIndex, 0, columnList[oldIndex]);
                        columnList.splice(oldIndex + 1, 1);
                    } else {
                        columnList.splice(newIndex + 1, 0, columnList[oldIndex]);
                        columnList.splice(oldIndex, 1);
                    }
                    setState(columnList)
                    newColumn.current = columnList
                },
            });
            inited = true;
        })
      };

    return <div>
        <Popover
            onOpenChange={handleVisibleChange}
            content={
                <Checkbox.Group ref={columnListRef} value={checkedCol as React.Key[]} className='w-[300px]' onChange={setChecked}>
                    { columns.map(col=>{
                        return <Fragment key={col.dataIndex as string}>
                            <div className='w-[300px] flex items-center justify-between py-1'>
                                <div className='flex items-center'>
                                    <DragOutlined className='mr-2 cursor-pointer drag-outlined'/>
                                    <Checkbox value={col.dataIndex}>{ col.title }</Checkbox>
                                </div>
                                <div className='flex items-center'>
                                    <VerticalAlignBottomOutlined
                                        onClick={()=>setupFixed(col.dataIndex,'left')}
                                        className={[arrowClass(col,'left'),'rotate-90 !text-lg'].join(' ')}
                                    />
                                    <Divider type='vertical'/>
                                    <VerticalAlignTopOutlined
                                        onClick={()=>setupFixed(col.dataIndex,'right')}
                                        className={[arrowClass(col,'right'),'rotate-90 !text-lg'].join(' ')}
                                    />
                                </div>  
                            </div>
                        </Fragment>
                    }) }
                </Checkbox.Group>
            }
            trigger={['click']}
            placement="bottomLeft"
        >
            <Tooltip placement='left' className='cursor-pointer' title={t('components.columnSettings')}>
                <SettingOutlined/>
            </Tooltip>
        </Popover>
    </div>
}

export default TableColSetting