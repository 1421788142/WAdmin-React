import { Tooltip } from 'antd'
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { StoreType } from '@/redux/interface/index'

const HasTooltip = (props:{ title:string })=>{
  const [showTooltip, setShowTooltip] = useState(false)
  const { title } = props
  const visibilityChange = (event:any) => {
    const ev = event.target;
    const ev_weight = ev.scrollWidth; // 文本的实际宽度   scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
    const content_weight = ev.clientWidth; // 文本的可视宽度 clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
    if (ev_weight > content_weight) {
      // 实际宽度 > 可视宽度  文字溢出
      setShowTooltip(true)
    } else {
      // 否则为不溢出
      setShowTooltip(false)
    }
  };

  const configStore = useSelector((state:StoreType)=>state.configStore)
  const hasTip = useMemo(()=>{
    return ['transverse'].includes(configStore.theme.menuType)
  },[configStore.theme.menuType])


  return (
    <span>
      { 
        hasTip ? title :
        showTooltip ? (
          <Tooltip placement='top' title={title}>
            <p className="mb-0 cardp" onMouseEnter={visibilityChange}>{ title }</p>
          </Tooltip>
        ) : (
          <p className="mb-0 cardp" onMouseEnter={visibilityChange}>{ title }</p>
        )
      }
    </span>
  )
}

export default HasTooltip