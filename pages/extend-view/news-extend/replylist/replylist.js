// pages/extend-view//news-extend/replylist/replylist.js
const util = require('../../../../utils/util.js')
import TIM from 'tim-wx-sdk';
// import COS from "cos-wx-sdk-v5";


var app = getApp()
// let that

// let pageImResponse;
// const sdkAppID = 1400353409;
// let tim

// var roomID, userID, to_user, userSig, to_user_head, conversationID;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    hasUserInfo: false,
    userSign: '',
    nickName: '',
    msg: [],
    empty_show: false,
    now: '',
    height: app.globalData.height
  },
  onLoad: function() {
    let obj = wx.getMenuButtonBoundingClientRect();
    this.setData({
      width: obj.left,
      height: obj.top + obj.height + 8,
      top: obj.top + (obj.height - 32) / 2
    }, () => {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            scrollH: res.windowWidth
          })
        }
      })
    });

    this.initRecentContactList(),
    this.im()
  },
  back:function(){
    wx.navigateBack({
      
    })
  },
  // 点击消息列表跳转到聊天详情页（需要把列表页的头像传过去，因为详情获取的数据里面没有聊天头像）
  contactsClick(e) {
    var tim = app.globalData.tim
    var conversationID = e.currentTarget.dataset.conversationid // 
    var avatar = e.currentTarget.dataset.avatar
    var name = e.currentTarget.dataset.name
    tim.setMessageRead({
      conversationID: conversationID
    })
    wx.navigateTo({
      url: '../customerservice/customerservice?conversationID=' + conversationID + '&avatar=' + avatar + '&name=' + name,
    })
  },
  // 获取会话列表 （必须要在SDK处于ready状态调用（否则会报错））
  initRecentContactList() {
    var that = this
    // 拉取会话列表
    var tim = app.globalData.tim
    let promise = tim.getConversationList();
    if (!promise) {
      // util.sLoadingHide()
      wx.showToast({
        title: 'SDK not ready',
        icon: 'none',
        duration: 3000
      })
      wx.navigateTo({
        url: '../../../login/login?backflag=customerservice'
      })
      return
    }
    promise.then(function(imResponse) {
      // util.sLoadingHide()
      console.log('会话列表')
      console.log(imResponse)
      // 如果最后一条消息是自定义消息的话，处理一下data
      const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
      conversationList.forEach(e => {
        if (e.lastMessage.type == 'TIMCustomElem') {
          var data = e.lastMessage.payload.data
          var new_data = ''
          if (typeof (data) == 'string' && data) {
            new_data = JSON.parse(data)
          }
          e.lastMessage.payload.data = new_data
        }
        var time = util.timestampToTime2(e.lastMessage.lastTime)
        console.log(time)
        e.lastMessage.lastTime=time
      })
      console.log(conversationList)
      that.setData({
        msg: conversationList,
        empty_show: conversationList && conversationList.length > 0 ? false : true
      })
      var number = 0
      conversationList.forEach(e => {
        number = number + e.unreadCount
      })
      console.log(number)
      wx.setStorageSync('number_msg', number)
      // if (number > 0) {
      //   wx.setTabBarBadge({
      //     index: 2,
      //     text: number.toString()
      //   })
      // } else {
      //   wx.hideTabBarRedDot({
      //     index: 2
      //   })
      // }
    }).catch(function(imError) {
      // util.sLoadingHide()
      wx.showToast({
        title: 'getConversationList error:' + imError,
        icon: 'none',
        duration: 3000
      })
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    })
  },
  im: function() {
    var that = this
    var tim = app.globalData.tim
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
      console.log('收到消息')
      that.initRecentContactList()
    })
  },
  onShow: function() {
    if (app.globalData.isImLogin) {
      // 已经登录了SDK处于read状态
      this.setData({
        hasUserInfo: true
      })
      // 由于登录是写在会话列表的 因此如果已经登录 （SDK处于ready状态）就直接获取会话列表（会话列表函数在下面会话列表里整体贴）
      this.initRecentContactList()
    } else {
      if (wx.getStorageSync('token')) {
        // util.sLoading()
        this.setData({
          hasUserInfo: true
        })
        // 获取登录密码userSign和tid（这里通过后端接口获取）
        this.getPassword()
      } else {
        // 没有登录 就会出现一个授权页 让用户登录（小程序的登录）针对没有登录过的用户，登录过的用户做了静默登录 会自动登录
        this.setData({
          hasUserInfo: false
        })
        
      }
    }
  },
  // 获取登录所用的userSign 和 tid(密码)
  getPassword() {
    this.setData({
      userID: wx.getStorageSync('userid'),
      userSig: wx.getStorageSync('sig')
    })
  },
  //腾讯云im的登录
  loginIm() {
    var that = this
    var tim = app.globalData.tim
    let promise = tim.login({
      userID: that.data.userId,
      userSig: that.data.userSign
    });
    promise.then(function(imResponse) {
      console.log(imResponse)
      console.log('登录成功')
      wx.setStorageSync('isImLogin', true)
      app.globalData.isImLogin = true
      setTimeout(() => {
        // 拉取会话列表
        that.initRecentContactList()
      }, 1000);
    }).catch(function(imError) {
      // util.sLoadingHide()
      wx.showToast({
        title: 'login error' + imError,
        icon: 'none',
        duration: 3000
      })
      console.warn('login error:', imError); // 登录失败的相关信息
    })
  }
})