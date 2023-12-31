import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect, useMemo } from 'react';
import { Tabs } from 'antd';
import './index.less'
import { CloseOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { StoreType } from '@/redux/interface';
import { store } from '@/redux';
import TagMenu from './tagMenu';
import { useTag } from './util';
import { getCurrentRouter } from "@/utils/currentRouter"

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-node-key': string;
}

const DraggableTabNode = ({ className, ...props }: DraggableTabPaneProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props['data-node-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleX: 1 }),
    transition,
    cursor: 'pointer',
  };

  return React.cloneElement(props.children as React.ReactElement, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
};

const TagList: React.FC<{
  tagList: StoreType['historyTagStore']['historyTag'],
}> = (props) => {
  // 拖拽标签逻辑
  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = tagList.findIndex((i) => i.path === active.id);
      const overIndex = tagList.findIndex((i) => i.path === over?.id);
      setStoreTag(arrayMove(tagList, activeIndex, overIndex))
    }
  };

  // tab 标签业务
  const { tagList } = props 
  const navigate = useNavigate();
  const { pathname } = useLocation()
  const { 
    setStoreTag,
    onClose,
    closeLeft,
    closeRight,
    closeAll,
    closeOther
  } = useTag({ tagList, navigate, pathname })

  // 当前路由信息
  const currentTag = getCurrentRouter()

  const seTag = ()=>{
    //如果是登录或错误页面则不缓存菜单
    if (['/login', '/403', '/404'].includes(pathname)) return
    //是否已经存在历史页签
    if(!Array.isArray(tagList)) return
    const isHas = tagList.some(x => x.path === pathname)
    if (!isHas) {
      setStoreTag([ {
        title: currentTag.meta.title as string,
        path: currentTag.path,
        params: {},
        parentPath: '' as string
      }, ...tagList ])
    }
    if (tagList.length > 50) {
      setStoreTag(tagList.filter(x=>x.path !== tagList.at(-1)?.path))
    }
  }

  useEffect(()=>{
    seTag()
  },[ pathname ])

  const onTabClick = (key: string,e:any) => {
    if(pathname === key) return
    navigate(key)
  }


  const items = useMemo(()=>{
    if(!Array.isArray(tagList)) return []
      return tagList.map(tag=>{
        return {
            key: tag.path,
            label: <TagMenu
              pathname={pathname}
              tagPath={ tag.path }
              onClose={onClose}
              closeLeft={closeLeft}
              closeRight={closeRight}
              closeAll={closeAll}
              closeOther={closeOther}
            >
              <div className='tag-item'>
                  <span>{tag.title}</span>
                  <CloseOutlined onClick={(e)=>{
                    e.stopPropagation();
                    onClose(tag.path)
                  }} className='close-outlined'/>
            </div>
          </TagMenu>,
        }
      })
  },[tagList,pathname])
  
  return (
    <Tabs
      items={items}
      onTabClick={onTabClick}
      size='small'
      className='custom-tag w-[100%]'
      popupClassName='custom-tag-popup'
      activeKey={pathname}
      renderTabBar={(tabBarProps, DefaultTabBar) => (
        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
          <SortableContext items={items.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
            <DefaultTabBar {...tabBarProps}>
              {(node) => (
                <DraggableTabNode {...node.props} key={node.key}>
                  {node}
                </DraggableTabNode>
              )}
            </DefaultTabBar>
          </SortableContext>
        </DndContext>
      )}
    />
  );
};

const mapStateToProps = (state: StoreType) => ({
  tagList:state.historyTagStore.historyTag,
})

export default connect(mapStateToProps)(TagList)