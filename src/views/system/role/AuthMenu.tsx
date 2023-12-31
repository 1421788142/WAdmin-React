import React, { memo, useMemo } from 'react';
import { Empty, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import AntdIcon from '@/components/AntdIcon';
import { iconNameCase } from '@/layout/utils'
import { arrRemoval } from '@/utils';

type newDataNode = DataNode & {
    menuType:MenuListType['menuType']
}

const AuthMenu: React.FC<{
    value:string,
    onChange:(value:string)=>void,
    treeData:MenuListType[]
}> = (props) => {
    const { treeData, value, onChange } = props

    const treeMenus = (menu:MenuListType[]):newDataNode[]=>{
        const getItem = (menu: MenuListType): newDataNode => {
            return {
                key: menu.id,
                icon: <AntdIcon component={iconNameCase(menu.icon) as any}/>,
                children: menu.children && menu.children.map(child => getItem(child)),
                title: menu.title,
                menuType: menu.menuType //特殊字段方便后期管理
            }
        }
    
        const items: newDataNode[] = menu.map(menu => getItem(menu))
        return items
    }

    const setChildrenIds = (node: newDataNode,ids:number[])=>{
        if(node.children && node.children.length > 0) {
            node.children.forEach((x)=>{
                ids.push(x.key as number)
                x.children && setChildrenIds(x as newDataNode,ids)
            })
        }
    }

    const onCheck = (checked:{
        checked:Array<number>
    },e:{
        node:newDataNode
    }) => {
        const { node } = e
        let childrenIds:Array<number> = []
        setChildrenIds(node,childrenIds)
        let menuIds = arrRemoval(checked.checked)
        if(menuIds.includes(node.key)){
            menuIds = [...menuIds,...childrenIds]
        } else {
            menuIds = menuIds.filter(x=>![...childrenIds].includes(x))
        }
        onChange(menuIds.join(','))
    }

    const checkedKeys = useMemo(()=>{
        return !value ? [] : value.split(',').map(x=>Number(x))
    },[value])

    const treeDatas = useMemo<newDataNode[]>(()=>{
        return treeMenus(treeData)
    },[treeData,checkedKeys])

  return (
    <div>
        { 
        !treeDatas.length ?
        <Empty description="暂无可分配菜单" /> : 
        <Tree
            blockNode
            checkable
            checkStrictly
            defaultExpandAll
            showLine={true}
            showIcon={true}
            onCheck={onCheck as any}
            treeData={treeDatas}
            checkedKeys={checkedKeys}
        />
      }
    </div>
  );
};

export default memo(AuthMenu);