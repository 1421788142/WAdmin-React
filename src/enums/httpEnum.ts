/**
 * @description：请求配置
 */
export enum RESULT_ENUM {
  SUCCESS = 200,
  ERROR = 500,
  OVERDUE = 599,
  TIMEOUT = 300000,
  TYPE = "success"
}
/**
 * @description: request method
 */
export enum REQUESY_ENUM {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  contentTyp
 */
export enum CONTENT_TYPE_ENUM {
  // json
  JSON = 'application/json; charset=utf-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}