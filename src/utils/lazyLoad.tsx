import React, { Suspense } from "react";
import { Spin } from "antd";

/**
 * @description 路由懒加载
 * @param {Element} Comp 需要访问的组件
 * @returns element
 */

const lazyLoad = (Comp:React.LazyExoticComponent<any>):React.ReactNode=>{
    return (
        <Suspense fallback={
            <div className="page-lazy-loader JS_on">
                <span className="binary"></span>
                <span className="binary"></span>
                <span className="getting-there">全力加载中,请稍后...</span>
            </div>
            }>
            <Comp/>
        </Suspense>
    )
}

export default lazyLoad
