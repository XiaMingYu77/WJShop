var app = getApp()
const util = require('../../utils/util.js')
let globalData = getApp().globalData
import TIM from 'tim-wx-sdk';
import COS from "cos-wx-sdk-v5";
Page({
  data: {
    motto: 'Senparc.Weixin SDK Demo v2019.10.19',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    flag: true,
    img1: "https://shop.we-time.net/images/qcloud/xiaochengxudenglubg1.png",
    img2: "https://shop.we-time.net/images/qcloud/xiaochengxudenglubg.png",
    invitenum: ""
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      backflag: options.backflag,
      hasphone: wx.getStorageSync("hasphone")
    })

    if (options.invitenum) {
      this.setData({
        invitenum: options.invitenum
      })
    }

    if (this.data.invitenum == 'undefined') {
      this.setData({
        invitenum: ""
      })
    }

    if (options.scene) {
      var invitenum = options.scene
      this.setData({
        invitenum
      })
    }

    let obj = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          width: obj.left || res.windowWidth,
          height: obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44),
          top: obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6),
          scrollH: res.windowWidth * 0.6
        })
      }
    })

    // if (wx.getStorageSync('token')){
    //   wx.switchTab({
    //     url: '../wujieindex/wujieindex',
    //   })
    // }
    console.log('onLoad')
    var that = this

    //判断是否登录
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    //   //console.log(userInfo);
    // })

    var interval = setInterval(function() {
      that.setData({
        time: new Date().toLocaleTimeString()
      });
    }, 1000);
  },
  getUserInfo: function(e) {
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    var that = this
    wx.getUserInfo({
      success(res) {
        app.getUserInfo(e)
        wx.login({
          success: function(res) {
            console.log(res)
            //换取openid & session_key
            wx.request({
              url: wx.getStorageSync('domainName') + '/WxOpen/OnLogin',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'AppType': '2',
                'DeviceID': "psx1234567890"
              },
              data: {
                code: res.code
              },
              success: function(json) {
                console.log("login success " + json);
                var result = json.data;
                console.log(result)
                if (result.success) {
                  wx.setStorageSync('sessionId', result.sessionId);
                  wx.setStorageSync('token', result.sessionId);
                  wx.setStorageSync('hasphone', result.hasPhone);
                  app.globalData.hasphone = result.hasPhone
                  wx.setStorageSync('RePecent', result.data.RePecent);
                  wx.setStorageSync('RatePecent', result.data.RatePecent);
                  wx.setStorageSync('OrdinaryRePecent', result.data.OrdinaryRePecent);
                  wx.setStorageSync('userid', result.data.UserPhone)
                  wx.setStorageSync('sig', result.data.IMSign)
                  wx.setStorageSync('MemID', result.data.MemID)
                  wx.setStorageSync('UserImg', result.data.UserImg)
                  wx.setStorageSync('isnew', result.data.IsNewPerson)
                  wx.setStorageSync('isLog', true)
                  console.log(wx.getStorageSync('hasphone'))
                  // let promise = app.globalData.tim.login({
                  //   userID: result.data.UserPhone,
                  //   userSig: result.data.IMSign
                  // });
                  // promise.then(function(imResponse) {
                  //   console.log(imResponse.data); // 登录成功
                  // }).catch(function(imError) {
                  //   console.warn('login error:', imError); // 登录失败的相关信息
                  // });
                  console.log(typeof(result.hasPhone))
                  if (result.hasPhone) {
                    // wx.hideLoading()
                    console.log(1111111111)
                    if (that.data.backflag == 'detail') {
                      console.log('back')
                      setTimeout(() => {
                        wx.navigateBack({

                        })
                      }, 2000)
                    } else if (that.data.backflag == 'customerservice') {
                      wx.navigateBack({
                        delta: 2
                      })
                    } else {
                      wx.switchTab({
                        url: '../wujieindex/wujieindex'
                      })
                    }
                  } else {
                    wx.hideLoading()
                    console.log(22222)
                    that.setData({
                      flag: false
                    })
                  }
                  //获取userInfo并校验
                  // wx.getUserInfo({
                  //   success: function(userInfoRes) {
                  //     console.log('get userinfo', userInfoRes);
                  //     app.globalData.userInfo = userInfoRes.userInfo
                  //     // typeof cb == "function" && cb(that.globalData.userInfo)

                  //     //校验
                  //     wx.request({
                  //       url: wx.getStorageSync('domainName') + '/WxOpen/CheckWxOpenSignature',
                  //       method: 'POST',
                  //       header: {
                  //         'content-type': 'application/x-www-form-urlencoded',
                  //         'AppType': '2',
                  //         'DeviceID': "psx1234567890"
                  //       },
                  //       data: {
                  //         sessionId: wx.getStorageSync('sessionId'),   
                  //         rawData: userInfoRes.rawData,
                  //         signature: userInfoRes.signature
                  //       },
                  //       success: function(json) {
                  //         console.log(json.data);
                  //       }
                  //     });

                  //     //解密数据（建议放到校验success回调函数中，此处仅为演示）
                  //     wx.request({
                  //       url: wx.getStorageSync('domainName') + '/WxOpen/DecodeEncryptedData',
                  //       method: 'POST',
                  //       header: {
                  //         'content-type': 'application/x-www-form-urlencoded',
                  //         'AppType': '2',
                  //         'DeviceID': "psx1234567890"
                  //       },
                  //       data: {
                  //         'type': "userInfo",
                  //         sessionId: wx.getStorageSync('sessionId'),
                  //         encryptedData: userInfoRes.encryptedData,
                  //         iv: userInfoRes.iv
                  //       },
                  //       success: function(json) {
                  //         console.log(json.data);
                  //       }
                  //     });
                  //   }
                  // })
                } else {
                  console.log('储存session失败！', json);
                }
              }
            })
          }
        })
        // app.getUserInfo(e)
        app.globalData.userInfo = e.detail.userInfo
        that.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        console.log(res)
        //   wx.switchTab({
        //     url: '../wujieindex/wujieindex',
        //   })
        // console.log(e.detail.userInfo)
        // if (e.detail.userInfo) {
        //   setTimeout(() => {
        //     console.log(wx.getStorageSync('hasphone'))
        //     if (wx.getStorageSync('hasphone') == "true") {
        //       wx.switchTab({
        //         url: '../wujieindex/wujieindex',
        //       })
        //     } else {
        //       // wx.navigateTo({
        //       //   url: '../getphonenumber/getphonenumber'
        //       // })
        //       console.log('111')
        //       that.setData({
        //         flag:false
        //       })
        //     }
        //   },1000)
        //   console.log(that.data.hasphone)
        //   if (that.data.hasphone) {
        //     setTimeout(() => {
        //       wx.navigateBack({

        //       })
        //     }, 1000)
        //   } else {
        //     that.setData({
        //       flag: false
        //     })
        //   }
        // }
      },
      fail(res) {
        console.log(111)
        util.toast("需要微信授权才可以进行下一步哦")
      }
    })
    //   // })
    //   wx.switchTab({
    //     url: '../wujieindex/wujieindex',
    //   })
    // } else {
    //   //用户按了拒绝按钮
    //   // console.log("拒绝")
    //   // wx.switchTab({
    //   //   url: '../login/login',
    //   // })
    // }
  },
  touseragreement: function(e) {
    var cur = e.currentTarget.dataset.current
    wx.navigateTo({
      url: '../extend-view1/useragreement/useragreement?type=' + cur,
    })
  },
  getPhoneNumber: function(e) {
    var that = this
    console.log(that.data.invitenum)
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData);

    // var DeviceID = app.gloglobalData.DeviceID

    //传输到后台解密
    wx.request({
      url: wx.getStorageSync('domainName') + '/WxOpen/DecryptPhoneNumber',
      data: {
        sessionId: wx.getStorageSync('sessionId'),
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        Recommon: that.data.invitenum
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'AppType': '2',
        'DeviceID': "psx1234567890"
      },
      success: function(res) {
        console.log("邀请码为:" + that.data.invitenum)
        // success
        var json = res.data;
        console.log(res);
        // if (!json.success) {

        //   // wx.showModal({
        //   //   title: '解密过程发生异常',
        //   //   content: json.msg,
        //   //   showCancel: false
        //   // });

        //   return;
        // }

        //模组对话框
        // var phoneNumberData = json.phoneNumber;
        // var msg = '手机号：' + phoneNumberData.phoneNumber +
        //   '\r\n手机号（不带区号）：' + phoneNumberData.purePhoneNumber +
        //   '\r\n区号（国别号）' + phoneNumberData.countryCode +
        //   '\r\n水印信息：' + JSON.stringify(phoneNumberData.watermark);

        // // wx.showModal({
        // //   title: '收到解密后的手机号信息',
        // //   content: msg,
        // //   showCancel: false
        // // });
        // wx.setStorageSync('token', wx.getStorageSync('sessionId'));

        console.log(e)
        if (e.detail.errMsg == 'getPhoneNumber:ok') {
          if (res.data.Code == "400") {
            util.toast("邀请码错误,请重新输入")
            return
          }
          if (that.data.backflag == 'detail') {
            console.log('back')
            setTimeout(() => {
              wx.navigateBack({

              })
            }, 1000)
          } else if (that.data.backflag == 'customerservice') {
            wx.navigateBack({
              delta: 2
            })
          } else {
            wx.switchTab({
              url: '../wujieindex/wujieindex'
            })
          }
        } else {
          console.log("点击拒绝")
          util.toast("需要点击允许才可以进行下一步哦")
        }
      }
    })



  },
  clear: function() {
    this.setData({
      invitenum: ""
    })
  },
  invitenumchange: function(e) {
    this.setData({
      invitenum: e.detail.value
    })
  },
  nologin: function() {
    if (this.data.backflag == 'detail') {
      console.log('back')
      wx.navigateBack({

      })
    } else if (this.data.backflag == 'customerservice') {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.switchTab({
        url: '../wujieindex/wujieindex'
      })
    }
  }
})