// pages/extend-view//search/findgoodsrecord/findgoodsrecord.js
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

    util.request("/WxUserFeedback/GetUserFeedbackList", {}, "GET", false).then((res) => {
      console.log(res)
      var info = res.data
      for (var i = 0; i < info.length; i++) {
        var str = info[i].CreateTime
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        console.log(str)
        str = util.timestampToTime1(str)
        info[i].CreateTime = str
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
  back:function(){
    wx.navigateBack({
      
    })
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

  }
})