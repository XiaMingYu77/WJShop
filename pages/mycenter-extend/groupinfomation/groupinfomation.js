// pages/mycenter-extend//groupinfomation/groupinfomation.js
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
  onLoad: function (options) {
    util.request("/WxUserInfo/MyGroup", {}, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        list: res.data
      })
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

  },
  applyassistant:function(e){
    var list = e.currentTarget.dataset.current
    list = JSON.stringify(list)
    wx.navigateTo({
      url: `../groupassistant1/groupassistant1?list=${list}`,
    })
  },
  deleteassistant:function(e){
    var id = e.currentTarget.dataset.current;
    console.log(id)
    util.request("/WxUserInfo/ShutRobot", {
      F_GUID: id
    }, "POST", false).then((res) => {
      console.log(res)
      // this.setData({
      //   list: res.data
      // })
      util.request("/WxUserInfo/MyGroup", {}, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          list: res.data
        })
      })
    })
  }
})