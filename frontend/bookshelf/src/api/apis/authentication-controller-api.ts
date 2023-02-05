/* tslint:disable */
/* eslint-disable */
/**
 * Sample OpenAPI -- IADI 2021/22
 * This is a sample for the openAPI lab
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
 import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
 import { Configuration } from '../configuration';
 // Some imports not used depending on template conditions
 // @ts-ignore
 import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
 import { UserDTO } from '../models';
import { SessionDTO } from '../models/session-dto';
 /**
  * BookControllerApi - axios parameter creator
  * @export
  */
 export const AuthenticationControllerApiAxiosParamCreator = function (configuration?: Configuration) {
     return {
         /**
          * 
          * @param {UserDTO} [body] 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         login: async (body?: UserDTO, options: any = {}): Promise<RequestArgs> => {
             const localVarPath = `/login`;
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
             const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
             localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         /**
          * 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         logout: async (options: any = {}): Promise<RequestArgs> => {
             const localVarPath = `/logout`;
             // use dummy base URL string because the URL constructor only accepts absolute URLs.
             const localVarUrlObj = new URL(localVarPath, 'https://example.com');
             let baseOptions;
             if (configuration) {
                 baseOptions = configuration.baseOptions;
             }
             const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
             const localVarHeaderParameter = {} as any;
             const localVarQueryParameter = {} as any;
 
             const query = new URLSearchParams(localVarUrlObj.search);
             for (const key in localVarQueryParameter) {
                 query.set(key, localVarQueryParameter[key]);
             }
             for (const key in options.query) {
                 query.set(key, options.query[key]);
             }
             localVarUrlObj.search = (new URLSearchParams(query)).toString();
             let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
             localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
 
             return {
                 url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                 options: localVarRequestOptions,
             };
         },
         
     }
 };
 
 /**
  * BookControllerApi - functional programming interface
  * @export
  */
 export const AuthenticationControllerApiFp = function(configuration?: Configuration) {
     return {
         /**
          * 
          * @param {UserDTO} [body]
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async login(body?: UserDTO, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SessionDTO>> {
             const localVarAxiosArgs = await AuthenticationControllerApiAxiosParamCreator(configuration).login(body, options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
         /**
          * 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         async logout(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
             const localVarAxiosArgs = await AuthenticationControllerApiAxiosParamCreator(configuration).logout(options);
             return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                 const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                 return axios.request(axiosRequestArgs);
             };
         },
     }
 };
 
 /**
  * BookControllerApi - factory interface
  * @export
  */
 export const AuthenticationControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
     return {
         /**
          * 
          * @param {UserDTO} [body]
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         login(body?: UserDTO, options?: any): AxiosPromise<SessionDTO> {
             return AuthenticationControllerApiFp(configuration).login(body, options).then((request) => request(axios, basePath));
         },
         /**
          * 
          * @param {*} [options] Override http request option.
          * @throws {RequiredError}
          */
         logout(options?: any): AxiosPromise<void> {
             return AuthenticationControllerApiFp(configuration).logout(options).then((request) => request(axios, basePath));
         },
         
     };
 };
 
 /**
  * BookControllerApi - object-oriented interface
  * @export
  * @class AuthenticationControllerApi
  * @extends {BaseAPI}
  */
 export class AuthenticationControllerApi extends BaseAPI {
     /**
      * 
      * @param {UserDTO} [body]
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof AuthenticationControllerApi
      */
     public login(body?: UserDTO, options?: any) {
         return AuthenticationControllerApiFp(this.configuration).login(body, options).then((request) => request(this.axios, this.basePath));
     }
     /**
      * 
      * @param {*} [options] Override http request option.
      * @throws {RequiredError}
      * @memberof AuthenticationControllerApi
      */
     public logout(options?: any) {
         return AuthenticationControllerApiFp(this.configuration).logout(options).then((request) => request(this.axios, this.basePath));
     }
     
 }
 