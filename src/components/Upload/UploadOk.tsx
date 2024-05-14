import { EyeOutlined } from "@ant-design/icons"
import { Button, Table, Tooltip, Image, UploadFile } from "antd"
import WModal from "../Modal"
import React, { useContext } from "react"
import { ColumnsType } from "antd/es/table"
import { UploadContextType, UploadPropsType } from "./type"
import { UploadContext } from "."
import { deleteImage } from "@/apis/common"
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { HolderOutlined } from '@ant-design/icons';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = React.useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};


const UploadOk:React.FC = () => {
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
            } else {
              antdApp.message.error(res.message)
            }
            setLoading(false)
          }
        })
      }}>删除</Button>
    </>)
  }

  const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
      <Button
        type="text"
        size="small"
        icon={<HolderOutlined />}
        style={{ cursor: 'move' }}
        ref={setActivatorNodeRef}
        {...listeners}
      />
    );
  };

  const columns = [
    { key: 'sort', align: 'center', width: 80, render: () => <DragHandle /> },
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


  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setBaseFile((prevState) => {
        const activeIndex = prevState.findIndex((record) => record.uid === active?.id);
        const overIndex = prevState.findIndex((record) => record.uid === over?.id);
        const newColumns = arrayMove(prevState, activeIndex, overIndex);
        onChange(newColumns.map(m=>m.uid).join(','))
        return newColumns
      });
    }
  };

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

    <DndContext onDragEnd={onDragEnd}>
      <SortableContext items={baseFile.map((i) => i.uid)} strategy={verticalListSortingStrategy}>
        <Table
          bordered
          pagination={false}
          rowKey={'uid'}
          dataSource={baseFile}
          columns={columns}
          components={{ body: { row: Row } }}
        />
        </SortableContext>
      </DndContext>
    </WModal>
  </>)
}

export default UploadOk