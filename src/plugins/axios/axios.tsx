import axios, { AxiosRequestConfig, Axios, AxiosResponse, AxiosError } from "axios";
import { start, close } from '@/plugins/nprogress'
import { message } from "antd";
import { HandlingInterface, setUpConfig } from './utils'
import { checkStatus } from "./checkStatus";
import { store } from "@/redux";
import i18n from "i18next";
import { ArgsProps } from "antd/es/message";
import { REDUX_USER_ENUM } from "@/enums/redux";

const { t } = i18n
export default class VAxios {
    private instance: Axios // axios
    private option!: RequestOptions; //axios 配置项
    private reqList: string[] = [] //全部请求列表
    constructor(config: AxiosRequestConfig) {
        //创建一个axios
        this.instance = axios.create(config)
        this.interceptors()
    }
    get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<Result<T>> {
        return this.Request({ ...config, method: 'GET' }, options);
    }

    post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<Result<T>> {
        return this.Request({ ...config, method: 'POST' }, options);
    }

    put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<Result<T>> {
        return this.Request({ ...config, method: 'PUT' }, options);
    }

    delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<Result<T>> {
        return this.Request({ ...config, method: 'DELETE' }, options);
    }

    // 消息提示
    private showMessage({
        msg,
        duration = 2,
        config = {} as Partial<ArgsProps>
    }:{
        msg:string,
        duration?:number,
        config?: Partial<ArgsProps>
    }) {
        message[config?.type || 'info'](
            {
                ...config,
                content: <span className="flex items-center">{msg}</span>,
                className: 'custom-message-class',
            },
            duration
        )
    }
    //将定义的配置类型传ResponseResult传过去
    public async Request<T>(config: AxiosRequestConfig, options: RequestOptions = {}) {
        return new Promise((resolve, reject) => {
            this.option = options
            const ret = HandlingInterface(config, options);
            this.instance.request(ret).then((res: AxiosResponse) => {
                try {
                    res && resolve(res.data);
                } catch (err) {
                    reject(err || new Error('request error!'));
                }
                close()
                return;
            }).catch((e: Error | AxiosError) => {
                console.log(e)
                reject(e)
            })
        }) as Promise<Result<T>>
    }
    /**
     * 阻止重复请求 注意选配了时间戳可能导致url每毫秒都不一样所以无法中断请求
     * @param {Array} reqList - 当前请求列表
     * @param {string} url - 当前请求地址
     * @param {function} cancel - 请求中断函数
     * @param {string} errorMessage - 请求中断是需提示的错误信息
     */
    private handleStopRepeatRequest = (url: string, cancel: Function, errorMessage: string = ''): void => {
        for (let i = 0; i < this.reqList.length; i++) {
            if (this.reqList[i] === url && !this.option.preventDuplication) {
                this.showMessage({
                    msg: t('sys.repeatAxios'),
                    config: { type: 'error' }
                })
                // cancel(errorMessage)
                return
            }
        }
        this.reqList.push(url)
    }
    /**
     * 允许某个请求可以继续进行
     * @param {array} reqList 全部请求列表
     * @param {string} url 请求地址
     */
    private handleAllowRequest = (url: string): void => {
        for (let i = 0; i < this.reqList.length; i++) {
            if (this.reqList[i] === url) {
                // 删除当前请求
                this.reqList.splice(i, 1)
                store.dispatch({
                    type: REDUX_USER_ENUM.SET_REQUEST_RECORD,
                    record: {
                        cancel: null,
                        url,
                        type: 'remove'
                    }
                })
                break
            }
        }
    }

    private interceptors() {
        //挂载拦截器
        this.interceptorsRequest()
        this.interceptorsResponse()
    }
    // 添加请求拦截器
    private interceptorsRequest() {
        this.instance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                start()
                let cancel: Function = () => null //定义标识符可以中断请求
                config.cancelToken = new axios.CancelToken(c => {
                    cancel = c
                    //将请求记录存起来
                    store.dispatch({
                        type: REDUX_USER_ENUM.SET_REQUEST_RECORD,
                        record: {
                            cancel,
                            url: config.url,
                            type: 'add'
                        }
                    })
                })
                // 阻止重复请求
                this.handleStopRepeatRequest(config.url as string, cancel, `${config.url} ${t('sys.repeatAxios')}`)
                // 请求前根据option修改config
                config = { ...setUpConfig(config, this.option) }
                return config;
            }, (error) => {
                // 对请求错误做些什么
                return Promise.reject(error);
            });
    }

    // 添加响应拦截器
    private interceptorsResponse() {
        this.instance.interceptors.response.use((res: AxiosResponse<any>) => {
            this.handleAllowRequest(res.config.url as string)
            const code = res.data.code || 500
            const msg = res.data.message || res.data.msg || t('sys.errMsg500')
            const errMsg = checkStatus(code, msg)
            if (errMsg) {
                this.showMessage({
                    msg: errMsg,
                    config: { type: 'error' }
                })
            }
            return res
        }, (error) => {
            this.handleAllowRequest(error.config.url)
            error.config.__retryCount = error.config.__retryCount || 0 // 重启机制仅get支持重启
            error.config.__retryCount += 1
            if (error.config.__retryCount > 2) {
                return Promise.reject(error)
            } else if (error.config.method === 'get') {
                return new Promise(function (resolve) {
                    return setTimeout(function () {
                        // error.config 失败接口的请求配置
                        return resolve(axios(error.config))
                    }, 2000)
                })
            } else {
                return Promise.reject(error)
            }
        });
    }
}
