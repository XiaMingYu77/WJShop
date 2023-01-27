// pages/mycenter-extend//myevaluationdetail/myevaluationdetail.js
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
    console.log(options)
    this.setData({
      id:options.id
    })

    util.request('/WxProductComment/GetProductComment', {
      ID: this.data.id
    }, 'GET', false).then((res) => {
      console.log(res)
      var data = res.data 
      var str = data.AddDate
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      var a = new Date(str * 1);
      var nian = a.getFullYear();//年
      var yue = a.getMonth() + 1;//月
      var tian = a.getDate();//天
      data.AddDate = nian + "年" + yue + "月" + tian + "日"
      for (var j = 0; j < data.ProductCommentMedia.length; j++) {
        if (data.ProductCommentMedia[j].ReComment == '1') {
          data.ProductCommentMedia.unshift(data.ProductCommentMedia.splice(j, 1)[0])
        }
      }
      console.log(res)
      this.setData({
        info:data
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
  previewImage: function (e) {
    console.log(e)
    var current = e.currentTarget.dataset.current;
    var list = e.currentTarget.dataset.list.ProductCommentMedia;
    var imglist = []
    for (var i = 0; i < list.length; i++) {
      if (list[i].ReComment == '0') {
        imglist.push(list[i].MediaUrl)
      }
    }
    console.log(list)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
})