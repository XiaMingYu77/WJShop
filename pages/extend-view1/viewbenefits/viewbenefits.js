// pages/extend-view1//viewbenefits/viewbenefits.js
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

    if (options.invitenum){
      this.setData({
        invitenum: options.invitenum
      })
    }

    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: "1784d1d3489f492fab67b95fdb05c3a1"
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        list: res.data.list[0],
        img: res.data.list[0].Video
      })
    })

    util.request("/WxMyIndex/GetMyIndex", {}, "GET", false).then((res) => {
      this.setData({
        group: res.data.MemberGroup
      })
      console.log(res)
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
  },
  topchaoji: function() {
    util.request("/WxShare/PostersImg", {
      img: this.data.img
    }, "GET", false).then((res) => {
      if (res.Code == '401') {
        wx.navigateTo({
          url: '../../login/login?backflag=detail&invitenum=' + this.data.invitenum
        })
        return
      }
      console.log(res,this.data.img)
      var urls = []
      var src = res.Msg
      urls[0] = src
      console.log(urls)
      wx.previewImage({
        current: res.Msg, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    })
  }
})