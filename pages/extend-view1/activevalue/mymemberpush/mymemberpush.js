// pages/extend-view1//activevalue/mymemberpush/mymemberpush.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageindex: 1
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

    this.setData({
      name:options.name
    })

    util.request("/WxEstimatedRevenue/GetMyExtension", {
      PageSize: 10,
      PageIndex: 1
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        list: res.data
      })
    })
  },
  back:function(){
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
    util.request("/WxEstimatedRevenue/GetMyExtension", {
      PageSize: 10,
      PageIndex: 1
    }, "POST", false).then((res) => {
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
    util.request("/WxEstimatedRevenue/GetMyExtension", {
      PageSize: this.data.pageindex + 1,
      PageIndex: 1
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        list: this.data.list.concat(res.data),
        PageSize: this.data.pageindex + 1
      })
    })
  }
})