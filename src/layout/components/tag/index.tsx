import { memo } from 'react';
import Operate from './operate';
import TagList from './tagList';

const HistoryTag = ()=>{
    return(<>
        <div className="flex items-center justify-between w-full wadmin-content-bg history-tag">
            <div className="flex flex-1 w-[10px]">
                <TagList/>
            </div>
            <Operate/>
        </div>
    </>) 
}

export default memo(HistoryTag);