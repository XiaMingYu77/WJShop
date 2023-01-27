import Util from '../../utils/util.js';
import {
  login
} from '../../api/login.js';
let app = getApp();

Component({
  properties: {
    iShidden: {
      type: Boolean,
      value: true,
    },
    //是否自动登录
    isAuto: {
      type: Boolean,
      value: true,
    },
    isGoIndex: {
      type: Boolean,
      value: true,
    },
    goodId: {
      type: String,
      value: '',
    },
    invitenum: {
      type: String,
      value: '',
    },
  },
  data: {
    cloneIner: null,
    loading: false,
    errorSum: 0,
    errorNum: 3
  },
  attached() {
    //this.get_logo_url();
    this.setAuthStatus();
  },
  methods: {
    close() {
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];
      if (this.data.isGoIndex) {
        wx.switchTab({
          url: '/pages/wujieindex/wujieindex'
        });
      } else {
        this.setData({
          iShidden: true
        });
        if (currPage && currPage.data.iShidden != undefined) {
          currPage.setData({
            iShidden: true
          });
        }
      }
    },
    // get_logo_url: function () {
    //   var that = this;
    //   if (wx.getStorageSync('logo_url')) return this.setData({ logo_url: wx.getStorageSync('logo_url') });
    //   getLogo().then(res => {
    //     wx.setStorageSync('logo_url', res.data.logo_url);
    //     that.setData({ logo_url: res.data.logo_url });
    //   });
    // },
    //检测登录状态并执行自动登录
    setAuthStatus() {
      var that = this;
      Util.chekWxLogin().then((res) => {
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        if (currPage && currPage.data.iShidden != undefined) {
          currPage.setData({
            iShidden: true
          });
        }
        console.log(res)
        if (res.isLogin) {
          if (!Util.checkLogin()) return Promise.reject({
            authSetting: true,
            msg: '用户token失效',
            userInfo: res.userInfo
          });
          // that.triggerEvent('onLoadFun', app.globalData.userInfo);
        } else {
          console.log(app.globalData)
          // if (wx.getStorageSync("isLog") == true) {
          //   return
          // }
          // wx.showLoading({
          //   title: '正在登录中'
          // });
          that.setUserInfo(res.userInfo, true);
        }
      }).catch(res => {
        if (res.authSetting === false) {
          //没有授权不会自动弹出登录框
          if (that.data.isAuto === false) return;
          //自动弹出授权
          //that.setData({ iShidden: false });

          console.log("test" + that.data.goodId);
          // wx.navigateTo({
          //   url: `/pages/login/login?invitenum=${that.data.invitenum}`
          // });
          // if (that.data.goodId) {
          //   wx.navigateTo({
          //     url: '/pages/login/login'
          //   });
          //   return;
          // } else {
          //   console.log(111)
          //   wx.navigateTo({
          //     url: '/pages/login/login'
          //   });
          //   return;
          // }
        } else if (res.authSetting) {
          //授权后登录token失效了
          that.setUserInfo(res.userInfo);
        }
      })
    },
    //授权
    setUserInfo(userInfo, isLogin) {
      let that = this;
      // wx.showLoading({
      //   title: '正在登录中'
      // });
      if (isLogin) {
        console.log("正在登录中1");
        that.getWxUserInfo(userInfo);
      } else {
        console.log("正在登录中2");
        Util.getCodeLogin((res) => {
          Util.wxgetUserInfo().then(userInfo => {
            userInfo.code = res.code;
            that.getWxUserInfo(userInfo);
          }).catch(res => {
            wx.hideLoading();
          });
        });
      }
    },
    getWxUserInfo: function(userInfo) {
      let that = this;
      // wx.getUserInfo({
      //   success(res) {
      //     app.getUserInfo();
      //     app.globalData.userInfo = e.detail.userInfo
      //     that.setData({
      //       userInfo: e.detail.userInfo,
      //       hasUserInfo: true
      //     })
      //     console.log(res)

      //     //   wx.switchTab({
      //     //     url: '../wujieindex/wujieindex',
      //     //   })
      //     console.log(e.detail.userInfo)
      //     if (e.detail.userInfo) {
      //       setTimeout(() => {
      //         console.log(wx.getStorageSync('hasphone'))
      //         if (wx.getStorageSync('hasphone') == "true") {
      //          //   //取消登录提示
      //           wx.hideLoading();
      //         } else {
      //           wx.navigateTo({
      //             url: '../getphonenumber/getphonenumber'
      //           })
      //         }
      //       }, 500)
      //     }
      //   },
      //   fail(res) {
      //     console.log(111)
      //   }
      // })

      console.log(wx.getStorageSync("isLog"))



      login({
        code: userInfo.code.code
      }).then(res => {
        console.log(res)
        app.globalData.token = res.data.sessionId;
        wx.setStorageSync("token", res.data.sessionId)
        wx.setStorageSync("sessionId", res.data.sessionId)
        wx.setStorageSync('userid', res.data.UserPhone)
        wx.setStorageSync('RePecent', res.data.RePecent);
        wx.setStorageSync('RatePecent', res.data.RatePecent);
        wx.setStorageSync('OrdinaryRePecent', res.data.OrdinaryRePecent);
        wx.setStorageSync('sig', res.data.IMSign)
        wx.setStorageSync('MemID', res.data.MemID)
        wx.setStorageSync('isnew', res.data.IsNewPerson)
        // wx.setStorageSync('isnew', true)
        app.globalData.isnew = res.data.IsNewPerson
        app.globalData.isLog = true;
        wx.setStorageSync("isLog", true)
        app.globalData.userInfo = res.data;
        console.log(app.globalData.userInfo)
        // app.globalData.expiresTime = res.data.expires_time;
        // wx.setStorageSync(CACHE_TOKEN, res.data.Token);
        // wx.setStorageSync(CACHE_EXPIRES_TIME, res.data.expires_time);
        // wx.setStorageSync(CACHE_USERINFO, JSON.stringify(res.data.userInfo));
        // let promise = app.globalData.tim.login({
        //   userID: res.data.UserPhone,
        //   userSig: res.data.IMSign
        // });
        // promise.then(function(imResponse) {
        //   console.log(imResponse.data); // 登录成功
        // }).catch(function(imError) {
        //   console.warn('login error:', imError); // 登录失败的相关信息
        // });
        if (res.data.cache_key) wx.setStorage({
          key: 'cache_key',
          data: res.data.cache_key
        });
        //取消登录提示
        wx.hideLoading();
        //关闭登录弹出窗口
        that.setData({
          iShidden: true,
          errorSum: 0
        });
        //执行登录完成回调
        // that.triggerEvent('onLoadFun', app.globalData.userInfo);
      }).catch((err) => {
        console.log(err);
        wx.hideLoading();
        that.data.errorSum++;
        that.setData({
          errorSum: that.data.errorSum
        });
        if (that.data.errorSum >= that.data.errorNum) {
          // wx.showToast({
          //   title: err,
          // })
          Util.toast(err)
        } else {
          that.setUserInfo(userInfo);
        }
      });
    }
  },
})