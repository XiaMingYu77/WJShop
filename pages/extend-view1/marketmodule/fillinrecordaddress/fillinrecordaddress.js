// pages/extend-view1//marketmodule/fillinrecordaddress/fillinrecordaddress.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    address:''
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
  nameinput:function(e){
    console.log(e.detail.value)
    this.setData({
      name:e.detail.value
    })
  },
  phoneinput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  addressinput:function(e){
    console.log(e.detail.value)
    this.setData({
      address: e.detail.value
    })
  },
  submit:function(){
    console.log(this.data.name)
    if (this.isNull(this.data.name)) {
      util.toast("请填写正确的姓名")
      return
    }
    if (!util.isMobile(this.data.phone)) {
      util.toast("请填写正确的手机号码")
      return
    }
    if (this.isNull(this.data.address)) {
      util.toast("请填写正确的地址")
      return
    }
    util.request("/WxDraw/FillWinningAddress", {
      ID:this.data.id,
      F_RecipientsName:this.data.name,
      F_RecipientsAddress: this.data.address,
      F_RecipientsPhone:this.data.phone
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.Msg == '填写收货信息成功！') {
        wx.navigateBack({

        })
      } else {
        util.toast(res.Msg)
      }
    })
  },
  // 是否为空或空格
  isNull: function (str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    //为空或纯空格为 true    有值为false
    console.log(re.test(str))
    return re.test(str);
  }
})