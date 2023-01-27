// pages/getphonenumber/getphonenumber.js
var app=getApp()
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
    opcity: 1,
    iconOpcity: 0.5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = wx.getMenuButtonBoundingClientRect();
    this.setData({
      width: obj.left,
      height: obj.top + obj.height + 8,
      inputTop: obj.top + (obj.height - 30) / 2,
      arrowTop: obj.top + (obj.height - 32) / 2,
      searchKey: options.searchKey || ""
    }, () => {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            //略小，避免误差带来的影响
            dropScreenH: this.data.height * 750 / res.windowWidth + 186,
            drawerH: res.windowHeight - res.windowWidth / 750 * 100 - this.data.height
          })
        }
      })
    });
    if (wx.getStorageSync('hasphone')){
      wx.switchTab({
        url: '../wujieindex/wujieindex',
      })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getPhoneNumber: function (e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData);

    // var DeviceID = app.gloglobalData.DeviceID
 
    //传输到后台解密
    wx.request({
      url: wx.getStorageSync('domainName') + '/WxOpen/DecryptPhoneNumber',
      data: {
        sessionId: wx.getStorageSync('sessionId'),
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded', 'AppType': '2',
        'DeviceID': "psx1234567890"
      },
      success: function (res) {
        // success
        var json = res.data;
        console.log(res.data);

        if (!json.success) {

          // wx.showModal({
          //   title: '解密过程发生异常',
          //   content: json.msg,
          //   showCancel: false
          // });
          
          return;
        }

        //模组对话框
        var phoneNumberData = json.phoneNumber;
        var msg = '手机号：' + phoneNumberData.phoneNumber +
          '\r\n手机号（不带区号）：' + phoneNumberData.purePhoneNumber +
          '\r\n区号（国别号）' + phoneNumberData.countryCode +
          '\r\n水印信息：' + JSON.stringify(phoneNumberData.watermark);

        // wx.showModal({
        //   title: '收到解密后的手机号信息',
        //   content: msg,
        //   showCancel: false
        // });
        wx.setStorageSync('token', wx.getStorageSync('sessionId'));
      }
    })
   
    if (e.detail.errMsg == 'getPhoneNumber:ok'){
      wx.switchTab({
        url: '../wujieindex/wujieindex'
      })
    } 
  },
  touseragreement: function (e) {
    var cur = e.currentTarget.dataset.current
    wx.navigateTo({
      url: '../extend-view1/useragreement/useragreement?type=' + cur,
    })
  }
})