// 用户相关
export enum REDUX_USER_ENUM {
    // 更新 用户信息
    UPDATE_USER_INFO = 'UPDATE_USER_INFO',
    // 更新 token
    SET_TOKEN = 'SET_TOKEN',
    // 更新 图形验证码
    SET_VERIFY_CODE = 'SET_VERIFY_CODE',
    // 更新 登录组件显示
    SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
    // 缓存请求记录
    SET_REQUEST_RECORD = 'SET_REQUEST_RECORD',
    // 缓存用户菜单
    SET_USER_ROUTER = 'SET_USER_ROUTER',
    // 退出登录
    LOGIN_OUT = 'LOGIN_OUT',
}

// 系统配置相关
export enum REDUX_CONFIG_ENUM {
    // 更新 语言
    SET_LANGUAGE = 'SET_LANGUAGE',
    // 更新 项目主题
    SET_THEME = 'SET_THEME',
    // 更新 项目组件配置
    SET_COMPONENT = 'SET_COMPONENT',
    // 更新 折叠菜单
    SET_COLLAPSED = 'SET_COLLAPSED',
    // 重置配置
    RESET_CONFIG = 'RESET_CONFIG',
    // 更新视图全屏
    SET_VIEW_FULL = 'SET_VIEW_FULL',
}

// 标签页
export enum REDUX_TAG_ENUM {
    // 路由变化设置
    SET_TAG = 'SET_TAG',
    // 设置刷新视图 此处用redux 因为可以再其他业务逻辑也可以做刷新操作
    SET_VIEW_STATUS = 'SET_VIEW_STATUS',
}
