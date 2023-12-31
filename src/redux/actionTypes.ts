// 用户相关
// 更新 用户信息
export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
// 更新 token
export const SET_TOKEN = "SET_TOKEN";
// 更新 图形验证码
export const SET_VERIFY_CODE = "SET_VERIFY_CODE";
// 更新 登录组件显示
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
// 缓存请求记录
export const SET_REQUEST_RECORD = "SET_REQUEST_RECORD";
// 缓存请求记录
export const SET_USER_ROUTER = "SET_USER_ROUTER";
// 退出登录
export const LOGIN_OUT = "LOGIN_OUT";

// 系统配置
// 更新 语言
export const SET_LANGUAGE = "SET_LANGUAGE";
// 更新 项目主题
export const SET_THEME = "SET_THEME";
// 更新 项目组件配置
export const SET_COMPONENT = "SET_COMPONENT";
// 更新 折叠菜单
export const SET_COLLAPSED = "SET_COLLAPSED";
// 重置配置
export const RESET_CONFIG = "RESET_CONFIG";
// 更新视图全屏
export const SET_VIEW_FULL = "SET_VIEW_FULL";

// 历史标签
// 路由变化设置
export const SET_TAG = 'SET_TAG'
// 设置刷新视图 此处用redux 因为可以再其他业务逻辑也可以做刷新操作
export const SET_VIEW_STATUS = 'SET_VIEW_STATUS'