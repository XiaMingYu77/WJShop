// pages/mycenter-extend//fillinnum/fillinnum.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal: false,
    areaIndex: 0,
    value2:'',
    area: ['点击选择', '顺丰速运', '邮政EMS', '圆通快递', '申通快递', '中通快递', '韵达快递', '天天快递', '汇通快递', '优速快递', '百世汇通','安能物流','德邦物流', '宅急送']
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
  companychange: function(e) {
    console.log(e.detail.value)
    this.setData({
      value1: e.detail.value
    })
  },
  numchange: function(e) {
    this.setData({
      value2: e.detail.value
    })
  },
  isNull: function(str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    //为空或纯空格为 true    有值为false
    console.log(re.test(str))
    return re.test(str);
  },
  submit: function() {
    if (this.data.areaIndex==0) {
      util.toast("请选择物流公司");
      return
    }
    if (this.isNull(this.data.value2)) {
      util.toast("请填写正确的快递单号");
      return
    }
    if (/[^\w\.\/]/ig.test(this.data.value2)){
      util.toast("快递单号只能包含数字和英文字母");
      return
    }
    util.request("/WxOrderChargeback/SetCourierByBuyer", {
      ChargebackId:this.data.id,
      LogisticsFirm: this.data.area[this.data.areaIndex],
      TrackingNumber:this.data.value2
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        modal:true
      })
    })
  },
  hide: function() {
    this.setData({
      modal: false
    })
    wx.navigateBack({
      delta: 2
    })
  },
  bindPickerChange: function (e) {
    // console.log(this.data.realvalue[e.detail.value])
    this.setData({
      areaIndex: e.detail.value
    })
    console.log(this.data.areaIndex)
  }
})