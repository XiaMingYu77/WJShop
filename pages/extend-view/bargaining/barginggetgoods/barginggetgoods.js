// pages/extend-view//bargaining/barginggetgoods/barginggetgoods.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    activelength: 500,
    timeList: 86400,
    percent: 10,
    money: ""
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

    console.log(options)
    this.setData({
      productid: options.productid,
      modalid: options.modalid,
      addressid: options.addressid,
      img: options.img,
      name: options.name
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
  click: function() {
    this.setData({
      flag: !this.data.flag
    })
  },
  doit: function() {
    util.request("/WxBargain/SubmitBargain", {
      ProductID:this.data.productid,
      ProductGoodsID:this.data.modalid,
      AddressID:this.data.addressid
    }, "GET", false).then((res) => {
      if(res.Code=='400'){
        util.toast(res.Msg)
        return
      }
      console.log(res)
      var percent = Number(res.data.Percentage)
      this.setData({
        flag:false,
        money: res.data.NegotiatedAmount,
        percent
      })
    })
  },
  tobargainingunderway:function(){
    wx.redirectTo({
      url: '../bargainingunderway/bargainingunderway',
    })
  },
  back: function () {
    wx.navigateBack({

    })
  }
})