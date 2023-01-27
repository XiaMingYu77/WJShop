// pages/mycenter-extend//aboutus/aboutus.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        name: "用户规范"
      },
      {
        name: "关于商城"
      },
      {
        name: "隐私协议"
      }
    ],
    selected: 0,
    modal:false
  },
  change: function (e) {
    const cur = e.currentTarget.dataset.index
    console.log(cur)
    this.setData({
      selected: cur
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
    
    // util.request("/WxDocumenInfo/GetAboutus", {
    //   Type: 6
    // }, "POST", false).then((res) => {
    //   this.setData({
    //     first: res.data[0]
    //   })
    //   console.log(res.data[0])
    // })
    util.request("/WxDocumenInfo/GetAboutus", {
      Type: 7
    }, "POST", false).then((res) => {
      this.setData({
        second: res.data[0]
      })
      console.log(res.data[0])
    })
    util.request("/WxDocumenInfo/GetAboutus", {
      Type: 8
    }, "POST", false).then((res) => {
      this.setData({
        third: res.data[0]
      })
      console.log(res.data[0])
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
  hide:function(){
    this.setData({
      modal:false
    })
  },
  showmodal:function(e){
    console.log(e.currentTarget.dataset.current)
    var cur = e.currentTarget.dataset.current
    var title = e.currentTarget.dataset.title
    this.setData({
      modal:true,
      content: cur,
      title:title
    })
  },
  touseragreement:function(){
    wx.navigateTo({
      url: '../../extend-view1/useragreement/useragreement?type=8',
    })
  }
})