// pages/mycenter-extend//feedbackrecorddetail/feedbackrecorddetail.js
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

    this.setData({
      id: options.id
    })

    util.request('/WXFeedback/GetFeedbackInfo', {
      id: this.data.id
    }, 'POST', false).then((res) => {
      console.log(res)
      var str = res.data.FeedTime
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      str = util.timestampToTime1(str, 'chinese')
      this.setData({
        content: res.data,
        time: str
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
    util.request('/WXFeedback/GetFeedbackInfo', {
      id: this.data.id
    }, 'POST', false).then((res) => {
      console.log(res)
      var str = res.data.FeedTime
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      str = util.timestampToTime1(str, 'chinese')
      this.setData({
        content: res.data,
        time: str
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
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    var imgs = this.data.content.t_Shop_MemberFeedBackImg
    var images = []
    for (var i = 0; i < imgs.length; i++) {
      images.push(imgs[i].FeedImage)
    }
    console.log(images)
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
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