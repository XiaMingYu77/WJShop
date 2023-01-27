// pages/extend-view1//myprofit/myprofit.js
const util = require('../../../utils/util.js')
let query = wx.createSelectorQuery()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        name: "今日预估"
      }, 
      {
        name: "本月预估"
      }, 
      {
        name: "上月预估"
      }
    ],
    selected:0,
    showtext:false,
    Type:0
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

    util.request("/WxEstimatedRevenue/GetEstimatedRevenue", {
      Type:this.data.Type
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        list:res.data
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
  change:function(e) {
    const cur =e.currentTarget.dataset.index
    console.log(cur)
    this.setData({
      selected: cur,
      Type:cur
    })
    util.request("/WxEstimatedRevenue/GetEstimatedRevenue", {
      Type: this.data.Type
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        list: res.data
      })
    })
  },
  popup:function(){
    this.setData({
      showtext: true
    })
  },
  hidePopup:function(){
    this.setData({
      showtext: false
    })
  },
  tototalprofitdetail:function(){
    wx.navigateTo({
      url: '../totalprofitdetail/totalprofitdetail',
    })
  },
  toprofitdetail: function () {
    wx.navigateTo({
      url: '../profitdetail/profitdetail',
    })
  },
  toprofitincomedetail: function () {
    wx.navigateTo({
      url: '../profitincome/profitincome',
    })
  },
  tomyrecashdetail:function(){
    wx.navigateTo({
      url: '../myrecashdetail/myrecashdetail',
    })
  },
  hide:function(){
    this.setData({
      showtext:false
    })
  }
})