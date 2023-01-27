// pages/extend-view1//marketmodule/bannerandcategory/bannerandcategory.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageIndex:1
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

    console.log(this.data.id)
    util.request("/WxHome/GetPromActivityInfo", {
      ID: this.data.id,
      PageIndex: '1'
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        info:res.data,
        goodlist: res.data._ProductInfoList
      })
    })
  },
  back: function() {
    // var isshare = wx.getLaunchOptionsSync().scene
    // if (isshare == 1007 || isshare == 1008) {
    //   wx.reLaunch({
    //     url: '/pages/wujieindex/wujieindex'
    //   })
    // } else {
    //   wx.navigateBack()
    // }
    wx.navigateBack()
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
    util.request("/WxHome/GetPromActivityInfo", {
      ID: this.data.id,
      PageIndex: '1'
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        info: res.data,
        goodlist: res.data._ProductInfoList,
        PageIndex: 1
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    util.request("/WxHome/GetPromActivityInfo", {
      ID: this.data.id,
      PageIndex: this.data.PageIndex+1
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        info: res.data,
        goodlist: this.data.goodlist.concat(res.data._ProductInfoList),
        PageIndex: this.data.PageIndex + 1
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  togoodsdetail: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../../extend-view/proDetail/proDetail?id=${id}&OrderSource=${this.data.id}`,
    })
  },
  botbannerclick: function (e) {
    var id = e.currentTarget.dataset.id
    var key = e.currentTarget.dataset.key
    util.bannerclick(key, id)
  }
})