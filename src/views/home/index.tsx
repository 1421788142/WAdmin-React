import { App } from 'antd';
import WTable from '@/components/Table/index';
import { userList, userListType } from '@/apis/system/user';
import { ColumnsType, UseTableImperative } from '@/components/Table/types/type';
import React, { useState } from 'react';

const HomePage = ()=>{
    const [columns, setColumns] = useState<ColumnsType<userListType>[]>([
        {
            title:'姓名',
            dataIndex:'userName',
            search:true,
            searchOption:{
                defaultValue:'admin'
            }
        }
    ])

    const TableRef = React.createRef<UseTableImperative>()
    
    return(<div>
                <WTable
                    onRef={TableRef}
                    api={userList}
                    columns={columns}
                    selection
                />
    </div>) 
}

export default HomePage