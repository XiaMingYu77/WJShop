// pages/mycenter-extend//feedbackrecord/feedbackrecord.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageindex:1
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

    util.request('/WXFeedback/GetFeedback', {
      PageIndex: 1
    }, 'POST', false).then((res) => {
      console.log(res)
      var record = res.data
      for (var i = 0; i < record.length; i++) {
        var str = record[i].FeedTime
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        console.log(record[i].FeedTime)
        record[i].FeedTime = util.timestampToTime1(str, 'chinese')
      }
      this.setData({
        record: res.data
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
    util.request('/WXFeedback/GetFeedback', {
      PageIndex: 1
    }, 'POST', false).then((res) => {
      console.log(res)
      var record = res.data
      for (var i = 0; i < record.length; i++) {
        var str = record[i].FeedTime
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        console.log(record[i].FeedTime)
        record[i].FeedTime = util.timestampToTime1(str, 'chinese')
      }
      this.setData({
        record: res.data
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    util.request('/WXFeedback/GetFeedback', {
      PageIndex: this.data.pageindex+1
    }, 'POST', false).then((res) => {
      console.log(res)
      var record = res.data
      if(record.length==0){
        util.toast("暂无更多数据")
        return
      }
      for (var i = 0; i < record.length; i++) {
        var str = record[i].FeedTime
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        console.log(record[i].FeedTime)
        record[i].FeedTime = util.timestampToTime1(str, 'chinese')
      }
      this.setData({
        record: this.data.record.concat(res.data),
        pageindex: this.data.pageindex + 1
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  torecorddetail: function(e) {
    var id = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../feedbackrecorddetail/feedbackrecorddetail?id=' + id
    })
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