import request from "./../utils/request.js";
/**
 * 
 * 用户相关接口
 * 
*/

/**
 * 小程序用户登录
 * @param data object 小程序用户登陆信息
 */
export function login(data) {
  return request.post("WxOpen/OnLogin", data, { noAuth: true });
}

export function autologin(data) {
  return request.post("WxOpen/auto_auth", data, { noAuth: true });
}

/**
 * 退出登錄
 * 
*/
export function logout() {
  return request.get('logout');
}