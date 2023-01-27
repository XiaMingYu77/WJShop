// pages/mycenter-extend//problemdetail/problemdetail.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 200, //header宽度
    height: 64, //header高度
    inputTop: 0, //搜索框距离顶部距离
    arrowTop: 0, //箭头距离顶部距离
    tabIndex: 0, //顶部筛选索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
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

    util.request("/WxDocumenInfo/Details", {
      NewsID:this.data.id
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        problemdetail:res.data
      })
    })

    // 获取客服号
    util.request("/WxOpen/GetCustomerService ", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        msg: res.Msg
      })
    })
  },
  back: function () {
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
  isok:function(){
    wx.navigateBack({
      
    })
  },
  tofeedback:function(){
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  tocustomerservice: function () {
    console.log(this.data.msg)
    wx.navigateTo({
      url: `../../extend-view/news-extend/customerservice/customerservice?conversationID=${'C2C' + this.data.msg}`,
    })
  }
})