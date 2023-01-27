// pages/mycenter-extend//accountsettings/accountsettings.js
const util = require('../../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  },
  back: function () {
    var isshare = wx.getLaunchOptionsSync().scene
    if (isshare == 1007 || isshare == 1008) {
      wx.reLaunch({
        url: '/pages/wujieindex/wujieindex'
      })
    } else {
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toaddress:function(){
    wx.navigateTo({
      url: '../../extend-view/mall-extend/address/address',
    })
  },
  hide:function(){
    this.setData({
      modal:false
    })
  },
  quitlogin:function(){
    this.setData({
      modal: true
    })
  },
  confirm:function(){
    wx.clearStorageSync()
    var isDebug = false; //调试状态使用本地服务器，非调试状态使用远程服务器
    if (!isDebug) {
      //远程域名
      // wx.setStorageSync('domainName', "https://shop.we-time.net")
      wx.setStorageSync('domainName', util.interfaceUrl())
      wx.setStorageSync('wssDomainName', "https://shop.we-time.net")
    } else {
      //本地测试域名
      // wx.setStorageSync('domainName', "http://localhost:58936")
      // wx.setStorageSync('wssDomainName', "ws://localhost:58936")

      //使用.NET Core 2.2 Sample（Senparc.Weixin.MP.Sample.vs2017.sln）配置：
      // wx.setStorageSync('domainName', "http://localhost:58936/VirtualPath")
      // wx.setStorageSync('wssDomainName', "ws://localhost:58936/VirtualPath")

      //使用 .NET Core 3.0 Samole（Senparc.Weixin.Sample.NetCore3.vs2019.sln）配置：
      //杨旺测试
      // wx.setStorageSync('domainName', "http://localhost:14460/")
      // wx.setStorageSync('wssDomainName', "wss://localhost:14460/")
      //彭商贤测试
      wx.setStorageSync('domainName', "http://192.168.1.115/")
      wx.setStorageSync('wssDomainName', "wss://192.168.1.115/")
    }
    app.globalData.userInfo=null
    wx.setStorageSync('isLog', true)
    wx.switchTab({ url: "../../wujieindex/wujieindex" })
  }, 
  tonicknameinfo: function () {
    wx.navigateTo({
      url: '../nicknameinfo/nicknameinfo',
    })
  }
})