// pages/extend-view1//memberdetail/memberdetail.js
const util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 34, //header高度
    top: 26, //标题图标距离顶部距离
    scrollH: 0, //滚动总高度
    opcity: 1,
    iconOpcity: 0.5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      name: options.name,
      id: options.id
    })

    let obj = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          width: obj.left || res.windowWidth,
          height: obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44),
          top: obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6),
          scrollH: res.windowWidth * 0.6
        })
        console.log(res)
      }
      
    })
    console.log(this.data.id)
    util.request("/WxEstimatedRevenue/GetIncomeDetails", {
      Memid: this.data.id
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        list: res.data
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
  }
})