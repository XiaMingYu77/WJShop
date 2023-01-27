//公共js，主要做表单验证，以及基本方法封装
var app=getApp()
const utils = {
  isNullOrEmpty: function(value) {
    //是否为空
    return (value === null || value === '' || value === undefined) ? true : false;
  },
  trim: function(value) {
    //去空格
    return value.replace(/(^\s*)|(\s*$)/g, "");
  },
  isMobile: function(value) {
    //是否为手机号
    return /^1[3456789]\d{9}$/.test(value);
  },
  isFloat: function(value) {
    //金额，只允许保留两位小数
    return /^([0-9]*[.]?[0-9])[0-9]{0,1}$/.test(value);
  },
  isNum: function(value) {
    //是否全为数字
    return /^[0-9]+$/.test(value);
  },
  formatNum: function(num) {
    //格式化手机号码
    if (utils.isMobile(num)) {
      num = num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    }
    return num;
  },
  interfaceUrl: function() {
    //接口地址
    // return "https://p3q0820927.zicp.vip/LimitedTec.WeChat"
    return "https://shop.we-time.net";
    //return "http://127.0.0.1/LimitedTec.WeChat";
  },
  toast: function(text, duration, success) {
    wx.showToast({
      title: text,
      icon: success ? 'success' : 'none',
      duration: duration || 2000
    })
  },
  preventMultiple: function(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 200;
    }
    let lastTime = null;
    return function() {
      let now = +new Date();
      if (!lastTime || now - lastTime > gapTime) {
        fn.apply(this, arguments);
        lastTime = now;
      }
    }
  },
  request: function(url, postData, method, type, hideLoading) {
    //接口请求
    if (!hideLoading) {
      wx.showLoading({
        title: '请稍候...',
        mask: true
      })
    }
    var pages = getCurrentPages();
    console.log("pages:" + pages.length);
    if (pages.length == 10) {
      wx.showToast({
        title: "页面打开太多，请回退关闭几个页面",
        icon: 'none',    
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack({

        })
      }, 2000)
      return;
    }
    return new Promise((resolve, reject) => {
      var token = wx.getStorageSync('token')
      // var DeviceID = app.gloglobalData.DeviceID
      // console.log(DeviceID)
      wx.request({
        url: this.interfaceUrl() + url,
        data: postData,
        header: {
          'content-type': type ? 'application/x-www-form-urlencoded' : 'application/json',
          'DeviceID': "psx1234567890",
          'AppType': '2',
          'AppVer': '12',
          'Token': token
        },
        method: method, //'GET','POST'
        dataType: 'json',
        success: (res) => {
          !hideLoading && wx.hideLoading()
          resolve(res.data)
          // console.log(res.data)
        },
        fail: (res) => {
          !hideLoading && this.toast("网络不给力，请稍后再试~")
          //wx.hideLoading()
          reject(res)
        }
      })
    })
  },
  getTimeLeft: function(datetimeTo) {
    // 计算目标与现在时间差（毫秒）
    let time1 = new Date(datetimeTo).getTime();
    let time2 = new Date().getTime();
    let mss = time1 - time2;

    // 将时间差（毫秒）格式为：天时分秒
    let days = parseInt(mss / (1000 * 60 * 60 * 24));
    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((mss % (1000 * 60)) / 1000);

    return hours + ":" + minutes + ":" + seconds
  },
  uploadFile: function(src) {
    const that = this
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: this.interfaceUrl() + '/WxUploadImg/UploadImageHandler',
        filePath: src,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: {},
        success: function(res) {
          wx.hideLoading()
          let d = JSON.parse(res.data)
          if (d.code === 1) {
            let fileObj = JSON.parse(d.data)[0];
            //文件上传成功后把图片路径数据提交到服务器，数据提交成功后，再进行下张图片的上传
            resolve(fileObj)
          } else {
            that.toast(res.message);
          }
        },
        fail: function(res) {
          reject(res)
          wx.hideLoading();
          that.toast(res.message);
        }
      })
    })
  },
  timestampToTime: function(timestamp) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes();
    var s = date.getSeconds();
    var text = ""
    if (h >= 12 || h < 24) {
      text = "上午"
    } else {
      text = "下午"
    }
    return text + h + m;
  },
  timestampToTime1: function(data, type) {
    var _data = data;
    //如果是13位正常，如果是10位则需要转化为毫秒
    if (String(data).length == 13) {
      _data = data
    } else {
      _data = data * 1000
    }
    const time = new Date(Number(_data));
    console.log(time)
    const Y = time.getFullYear();
    const Mon = time.getMonth()+1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    const Day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    const H = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const M = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    const S = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    console.log(typeof(M))
    // if (H<10){
    //   H = '0' + H
    // }
    // if (M < 10) {
    //   M = '0' + M
    // }
    // if (S < 10) {
    //   S = '0' + S
    // }
    //自定义选择想要返回的类型
    if (type == "Y") {
      return `${Y}-${Mon}-${Day}`
    } else if (type == "H") {
      return `${H}:${M}:${S}`
    } else if (type == "chinese") {
      return `${Y}年${Mon}月${Day}日 ${H}:${M}`
    }else {
      return `${Y}-${Mon}-${Day} ${H}:${M}:${S}`
    }
  },
  timestampToTime2: function(data, type) {
    var _data = data;
    //如果是13位正常，如果是10位则需要转化为毫秒
    if (String(data).length == 13) {
      _data = data
    } else {
      _data = data * 1000
    }
    const time = new Date(_data);
    const Y = time.getFullYear();
    const Mon = time.getMonth() < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    const Day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    const H = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const M = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    // const S = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    console.log(typeof(M))
    // if (H<10){
    //   H = '0' + H
    // }
    // if (M < 10) {
    //   M = '0' + M
    // }
    // if (S < 10) {
    //   S = '0' + S
    // }
    //自定义选择想要返回的类型
    // if (type == "Y") {
    //   return `${Y}-${Mon}-${Day}`
    // } else if (type == "H") {
    //   return `${H}:${M}:${S}`
    // } else {
    //   return `${Y}-${Mon}-${Day} ${H}:${M}:${S}`
    // }
    var time1 = new Date()
    var year = time1.getFullYear()
    var month = time1.getMonth() < 10 ? '0' + (time1.getMonth() + 1) : time1.getMonth() + 1
    var day = time1.getDate() < 10 ? '0' + time1.getDate() : time1.getDate()
    if (year == Y && month == Mon && Day == day) {
      return `${H}:${M}`
    } else {
      return `${Mon}-${Day} ${H}:${M}`
    }
  },
  throttle: function(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 1500
    }
    let _lastTime = null
    return function() {
      let _nowTime = +new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        // 将this和参数传给原函数
        fn.apply(this, arguments)
        _lastTime = _nowTime
      }
    }
  },
  formatRichText: function(html) {
    let newContent = html.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
    return newContent;
  },
  bannerclick:function(key,id,taskid){
    if (key == '1') {
      //源头好货
      wx.navigateTo({
        url: '/pages/extend-view1/factorysupply/factorysupply?id=' + 'hd0006' + '&taskid=' + taskid,
      })
    } else if (key == '2') {
      //优质发圈
      wx.navigateTo({
        url: '/pages/extend-view1/marketmodule/highquality/highquality?id=' + id,
      })
    } else if (key == '3') {
      //商城榜单
      wx.navigateTo({
        url: '/pages/extend-view1/marketmodule/hotlist/hotlist?id=' + 'hd0002' + '&taskid=' + taskid,
      })
    } else if (key == '4') {
      //高拥商品
      wx.navigateTo({
        url: '/pages/extend-view1/marketmodule/marketdetail/marketdetail?id=' + 'hd0005' + '&taskid=' + taskid,
      })
    } else if (key == '5') {
      //轻奢范
      wx.navigateTo({
        url: '/pages/extend-view1/marketmodule/bannerandcategory/bannerandcategory?id=' + "f2adfa7240d84d6bbcc5475f434883e5" + '&taskid=' + taskid,
      })
    } else if (key == '6') {
      // 新人上手
      wx.navigateTo({
        url: '/pages/extend-view1/marketmodule/newpeople/newpeople?id=' + id,
      })
    } else if (key == '7') {
      // 限时秒杀
      wx.navigateTo({
        url: '/pages/extend-view1/marketmodule/limited/limited?id=' + 'hd0001' + '&taskid=' + taskid,
      })
    } else if (key == '8') {
      //百亿补贴
      wx.navigateTo({
        url: '/pages/extend-view1/billionsubsidies/billionsubsidies?id=' + 'hd0007' + '&taskid=' + taskid,
      })
    }
  },
  taskcomplete:function(type){
    var id=""
    if(type==1){
      id = 'cb7cebcca31841c8b20d190bf107b4b0'
    }else{
      id = '7363487f267a40f0a3770b566ba7ef7b'
    }
    this.request("/WxBargain/FinishTheTask", {
      Memid: wx.getStorageSync('MemID'),
      ID: id
    }, "GET", true).then((res) => {
      console.log(res)
      console.log("砍价成功")
      if (res.data.F_Status == 0) {
        if(type==1){ 
          // app.globalData.paymoney = res.data.F_BargainAmount
          wx.setStorageSync('paymoney', res.data.F_BargainAmount + wx.getStorageSync("paymoney"))
        }else if(type==2){  
          // app.globalData.evaluatemoney = res.data.F_BargainAmount
          wx.setStorageSync('evaluatemoney', res.data.F_BargainAmount + wx.getStorageSync("evaluatemoney"))
        }
        // var str = `你砍掉了${res.data.F_BargainAmount}元`
        // util.toast(str)
        // this.setData({
        //   bargingtask: res.data,
        // })
      } else if (res.data.F_Status == '2'){
        wx.reLaunch({
          url: '/pages/extend-view/bargaining/bargingrecord/bargingrecord?backflag=true',
        })
      }
    })
  }
}

const wxgetUserInfo = function() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      lang: 'zh_CN',
      success(res) {
        resolve(res);
      },
      fail(res) {
        reject(res);
      }
    })
  });
}

const checkLogin = function() {
  let res = getApp().globalData.token ? true : false;
  let res1 = getApp().globalData.isLog;
  let res2 = res && res1;
  if (res2) {
    let newTime = Math.round(new Date() / 1000);
    if (getApp().globalData.expiresTime < newTime) return false;
  }
  return res2;
}

const logout = function() {
  getApp().globalData.token = '';
  getApp().globalData.isLog = false;
}

const chekWxLogin = function() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          return reject({
            authSetting: false
          });
        } else {
          wx.getStorage({
            key: 'cache_key',
            success(res) {
              if (checkLogin()) {
                return resolve({
                  userinfo: getApp().globalData.userInfo,
                  isLogin: true
                });
              } else {
                wxgetUserInfo().then(userInfo => {
                  userInfo.cache_key = res.data;
                  return resolve({
                    userInfo: userInfo,
                    isLogin: false
                  });
                }).catch(res => {
                  return reject(res);
                })
              }
            },
            fail() {
              getCodeLogin((code) => {
                wxgetUserInfo().then(userInfo => {
                  userInfo.code = code;
                  return resolve({
                    userInfo: userInfo,
                    isLogin: false
                  });
                }).catch(res => {
                  return reject(res);
                })
              });
            }
          })
        }
      },
      fail(res) {
        return reject(res);
      }
    })
  })
}

/**
 * 
 * 授权过后自动登录
 */
const autoLogin = function() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        console.log(111111111111)
        wxgetUserInfo().then(userInfo => {
          userInfo.cache_key = res.data;
          return resolve(userInfo);
        }).catch(res => {
          return reject(res);
        })
      },
      fail() {
        console.log(2222222222)
        getCodeLogin((code) => {
          wxgetUserInfo().then(userInfo => {
            userInfo.code = code;
            return resolve(userInfo);
          }).catch(res => {
            return reject(res);
          })
        });
      }
    });
  })
}

const getCodeLogin = function(successFn) {
  wx.login({
    success(res) {
      successFn(res);
    }
  })
}

module.exports = {
  isNullOrEmpty: utils.isNullOrEmpty,
  trim: utils.trim,
  isMobile: utils.isMobile,
  isFloat: utils.isFloat,
  isNum: utils.isNum,
  interfaceUrl: utils.interfaceUrl,
  toast: utils.toast,
  request: utils.request,
  uploadFile: utils.uploadFile,
  formatNum: utils.formatNum,
  getTimeLeft: utils.getTimeLeft,
  timestampToTime: utils.timestampToTime,
  timestampToTime1: utils.timestampToTime1,
  formatRichText: utils.formatRichText,
  throttle: utils.throttle,
  taskcomplete: utils.taskcomplete,
  bannerclick: utils.bannerclick,
  chekWxLogin: chekWxLogin,
  getCodeLogin: getCodeLogin,
  checkLogin: checkLogin,
  wxgetUserInfo: wxgetUserInfo,
  autoLogin: autoLogin,
  logout: logout,
  timestampToTime2: utils.timestampToTime2
}