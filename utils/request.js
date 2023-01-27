import util from './util.js';
import authLogin from './authLogin.js';

/**
 * 发送请求
 */
export default function request(api, method, data, { noAuth = false, noVerify = false }) {
  let Url = wx.getStorageSync('domainName'), header = {
    'content-type': 'application/json'
  };
  if (!noAuth) {
    //登录过期自动登录
    if (!util.checkLogin()) return authLogin().then(res => { return request(api, method, data, { noAuth, noVerify }); });
  }

  return new Promise((reslove, reject) => {
    var token = wx.getStorageSync('token')
    wx.request({
      url: Url + '/' + api,
      method: method || 'GET',
      header: {
        'content-type': method ? 'application/x-www-form-urlencoded' : 'application/json',
        'DeviceID': "psx1234567890",
        'AppType': '2',
        'AppVer': '12',
        'Token': token
      },
      data: data || {},
      success: (res) => {
        console.log('catch:', res.data.success);
        if (noVerify)
          reslove(res.data, res);
        else if (res.data.success == true)
          reslove(res.data, res);
        else if ([410000, 410001, 410002].indexOf(res.data.status) !== -1) {
          util.logout()
          return authLogin().then(res => { return request(api, method, data, { noAuth, noVerify }); });
        } else
          reject(res.data.msg || '系统错误');
      },
      fail: (msg) => {
        reject('请求失败');
      }
    })
  });
}

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
  request[method] = (api, data, opt) => request(api, method, data, opt || {})
});

