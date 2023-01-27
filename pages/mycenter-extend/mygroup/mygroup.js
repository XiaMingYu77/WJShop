// pages/mycenter-extend//mygroup/mygroup.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

    util.request("/WxUserInfo/MyGroup", {}, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        list: res.data
      })
    })
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
  creategroup: function() {
    util.request("/WxUserInfo/RobotApply", {}, "POST", false).then((res) => {
      console.log(res)
      var msg = res.Msg
      util.request("/WxUserInfo/MyGroup", {}, "POST", false).then((res) => {
        console.log(res)
        util.toast(msg)
        this.setData({
          list: res.data
        })
      })
    })
  },
  applyassistant: function(e) {
    console.log(e.currentTarget.dataset.current)
    var list = e.currentTarget.dataset.current
    list = JSON.stringify(list)
    wx.navigateTo({
      url: `../groupassistant1/groupassistant1?list=${list}`
    })
  },
  // deleteassistant: function() {
  //   var id = e.currentTarget.dataset.current
  //   util.request("/WxUserInfo/DelPushProduct", {
  //     F_GUID:id
  //   }, "POST", false).then((res) => {
  //     console.log(res)
  //   })
  // },
  closeassistant: function(e) {
    var id = e.currentTarget.dataset.current;
    console.log(id)
    util.request("/WxUserInfo/ShutRobot", {
      F_GUID: id
    }, "POST", false).then((res) => {
      console.log(res)
      // this.setData({
      //   list: res.data
      // })
      util.request("/WxUserInfo/MyGroup", {}, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          list: res.data
        })
      })
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
    util.request("/WxUserInfo/MyGroup", {}, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        list: res.data
      })
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
  toassistant:function(){
    wx.navigateTo({
      url: '../assistant/assistant',
    })
  }
})