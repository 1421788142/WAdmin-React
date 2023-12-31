import { tableResultData } from '@/apis/interface'

export type Api = (...args: any[]) => Promise<Result<tableResultData<any>>>

export type ResultType<T> = T extends Result<tableResultData<any>> ? T['data']['dataList'] : any[]

export type DataContent<T extends Api> = ResultType<PromiseReturnType<T>>[number]