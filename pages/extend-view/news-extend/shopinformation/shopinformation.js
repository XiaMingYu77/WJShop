// pages/extend-view//news-extend/shopinformation/shopinformation.js
const util = require('../../../../utils/util.js')
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

    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: '142238c14cfe41b8b94ba36ff2fcc066'
    }, "GET", false).then((res) => {
      console.log(res)
      var list = res.data.list
      for (var i = 0; i < list.length; i++) {
        var str = list[i].datatime
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        var a = new Date(str * 1);
        var nian = a.getFullYear(); //年
        var yue = a.getMonth() + 1 < 10 ? '0' + (a.getMonth() + 1) : a.getMonth() + 1; //月
        var tian = a.getDate() < 10 ? '0' + a.getDate() : a.getDate(); //日
        var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
        var minute = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
        var second = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds()
        list[i].datatime = nian + "年" + yue + "月" + tian + "日" + " " + hour + ":" + minute
        // console.log(util.timestampToTime1(str))
      }
      this.setData({
        list: res.data.list
      })
    })
  },
  back: function() {
    wx.navigateBack({

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

  }
})