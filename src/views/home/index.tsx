import { App } from 'antd';
import WTable from '@/components/Table/index';
import { userList, userListType } from '@/apis/system/user';
import { ColumnsType, UseTableImperative } from '@/components/Table/types/type';
import React, { useState } from 'react';

const HomePage = ()=>{
    
    return(<div className='py-10 text-4xl text-center'>
        首页
    </div>) 
}

export default HomePage