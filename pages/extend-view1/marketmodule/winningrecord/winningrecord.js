// pages/extend-view1//marketmodule/winningrecord/winningrecord.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataflag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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

    util.request("/WxDraw/GetWinningRecord", {}, "GET", false).then((res) => {
      console.log(res)
      var info = res.data
      for (var i = 0; i < info.length; i++) {
        var str = info[i].F_DrawTime
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        console.log(str)
        str = util.timestampToTime1(str)
        info[i].F_DrawTime = str
      }

      this.setData({
        info
      })
      if (this.data.info.length == 0) {
        this.setData({
          dataflag: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    util.request("/WxDraw/GetWinningRecord", {}, "GET", false).then((res) => {
      console.log(res)
      var info = res.data
      for (var i = 0; i < info.length; i++) {
        var str = info[i].F_DrawTime
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        console.log(str)
        str = util.timestampToTime1(str)
        info[i].F_DrawTime = str
      }

      this.setData({
        info
      })
      if (this.data.info.length == 0) {
        this.setData({
          dataflag: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      dataflag: true
    })
    util.request("/WxDraw/GetWinningRecord", {}, "GET", false).then((res) => {
      console.log(res)
      var info = res.data
      for (var i = 0; i < info.length; i++) {
        var str = info[i].F_DrawTime
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        console.log(str)
        str = util.timestampToTime1(str)
        info[i].F_DrawTime = str
      }

      this.setData({
        info
      })
      if (this.data.info.length == 0) {
        this.setData({
          dataflag: false
        })
      }
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  back: function() {
    var isshare = wx.getLaunchOptionsSync().scene
    if (isshare == 1007 || isshare == 1008) {
      wx.reLaunch({
        url: '/pages/wujieindex/wujieindex'
      })
    } else {
      wx.navigateBack()
    }
  },
  tofillinrecordaddress: function(e) {
    console.log(e)
    var cur = e.currentTarget.dataset.current
    wx.navigateTo({
      url: '../fillinrecordaddress/fillinrecordaddress?id=' + cur
    })
  },
  tochecklogistic: function (e) {
    console.log(info)
    var info = JSON.stringify(e.currentTarget.dataset.current)
    wx.navigateTo({
      url: '../../../mycenter-extend/checklogistic/checklogistic?flag=luckdraw&info=' + info
    })
  }
})