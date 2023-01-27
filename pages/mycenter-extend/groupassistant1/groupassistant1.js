// pages/mycenter-extend//groupassistant1/groupassistant1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var data = JSON.parse(options.list)
    console.log(data)
    this.setData({
      data
    })
  },
  copy: function () {
    var that=this
    wx.setClipboardData({
      data: that.data.data.F_WX_CHATNAME,
      success(res) {
        //粘贴到对应的位置
        wx.getClipboardData({
          success(res) {
            console.log(res)
          }
        })
      }
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
  hide:function(){
    this.setData({
      modal:false
    })
  },
  next:function(){
    this.setData({
      modal: true
    })
  },
  confirm:function(){
    wx.navigateTo({
      url: '../groupassistant2/groupassistant2',
    })
    this.setData({
      modal:false
    })
  }
})