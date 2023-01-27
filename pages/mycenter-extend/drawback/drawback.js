// pages/mycenter-extend//drawback/drawback.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        name: "全部"
      },
      {
        name: "处理中"
      }
    ],
    selected: 0,
    modal: false,
    pageIndex: 1,
    flag: true
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

    if (options) {
      this.setData({
        flag: options.flag
      })
    }
    util.request("/WxOrderChargeback/GetOrderChargebackList", {
      dataType: 0,
      pageIndex: 1,
      pageSize: 10
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        alllist: res.data.itemData
      })
      if (res.data.itemData.length == 0) {
        this.setData({
          flag: false
        })
      }
    })

    util.request("/WxOrderChargeback/GetOrderChargebackList", {
      dataType: 1,
      pageIndex: 1,
      pageSize: 10
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        handlelist: res.data.itemData
      })
      // if (res.data.itemData.length == 0) {
      //   this.setData({
      //     flag: false
      //   })
      // }
    })
  },
  back: function() {
    if (this.data.flag == 'true') {
      wx.switchTab({
        url: '../../mycenter/mycenter',
      })
    }
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
    if (this.data.selected == '0') {
      util.request("/WxOrderChargeback/GetOrderChargebackList", {
        dataType: 0,
        pageIndex: 1,
        pageSize: 10
      }, "POST", false, true).then((res) => {
        console.log(res)
        this.setData({
          alllist: res.data.itemData
        })
        if (res.data.itemData.length == 0) {
          this.setData({
            flag: false
          })
        }
      })
    } else {
      util.request("/WxOrderChargeback/GetOrderChargebackList", {
        dataType: 1,
        pageIndex: 1,
        pageSize: 10
      }, "POST", false, true).then((res) => {
        console.log(res)
        this.setData({
          handlelist: res.data.itemData
        })
        if (res.data.itemData.length == 0) {
          this.setData({
            flag: false
          })
        }
      })
    }
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
    // if (this.data.flag == 'true') {
    //   wx.switchTab({
    //     url: '../../mycenter/mycenter',
    //   })
    // }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.selected == 0) {
      util.request("/WxOrderChargeback/GetOrderChargebackList", {
        dataType: 0,
        pageIndex: 1,
        pageSize: 10
      }, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          alllist: res.data.itemData
        })
        if (res.data.itemData.length == 0) {
          this.setData({
            flag: false
          })
        }
        wx.stopPullDownRefresh()
      })
    } else {
      util.request("/WxOrderChargeback/GetOrderChargebackList", {
        dataType: 1,
        pageIndex: 1,
        pageSize: 10
      }, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          handlelist: res.data.itemData
        })
        if (res.data.itemData.length == 0) {
          this.setData({
            flag: false
          })
        }
        wx.stopPullDownRefresh()
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.cur == 0) {
      util.request("/WxOrderChargeback/GetOrderChargebackList", {
        dataType: 0,
        pageIndex: this.data.pageIndex + 1,
        pageSize: 10
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.itemData.length == 0) {
          util.toast("暂无更多数据")
          return
        }
        this.setData({
          alllist: this.data.alllist.concat(res.data.itemData),
          pageIndex: this.data.pageIndex + 1
        })
      })
    } else {
      util.request("/WxOrderChargeback/GetOrderChargebackList", {
        dataType: 1,
        pageIndex: this.data.pageIndex + 1,
        pageSize: 10
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.itemData.length == 0) {
          util.toast("暂无更多数据")
          return
        }
        this.setData({
          handlelist: this.data.handlelist.concat(res.data.itemData),
          pageIndex: this.data.pageIndex + 1
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  torecashdetail: function() {
    wx.navigateTo({
      url: '../refundaftersale/recashdetail/recashdetail',
    })
  },
  change: function(e) {
    const cur = e.currentTarget.dataset.index
    this.setData({
      selected: cur,
      pageSize: 1,
      flag: true
    })
    if (this.data.selected == 0) {
      util.request("/WxOrderChargeback/GetOrderChargebackList", {
        dataType: 0,
        pageIndex: 1,
        pageSize: 10
      }, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          alllist: res.data.itemData
        })
        if (res.data.itemData.length == 0) {
          this.setData({
            flag: false
          })
        }
      })
    } else {
      util.request("/WxOrderChargeback/GetOrderChargebackList", {
        dataType: 1,
        pageIndex: 1,
        pageSize: 10
      }, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          handlelist: res.data.itemData
        })
        if (res.data.itemData.length == 0) {
          this.setData({
            flag: false
          })
        }
      })
    }
  },
  hide: function() {
    this.setData({
      modal: false
    })
  },
  confirm: function() {

  },
  todrawbackdetail: function(e) {
    var cur = e.currentTarget.dataset.current;
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: `../applyrefundetail/applyrefundetail?id=${cur}&status=${status}`
    })
  },
  showmodal:function(e){
    this.setData({
      modal:true,
      id: e.currentTarget.dataset.current
    })
  },
  deleteorder: function(e) {
    console.log(this.data.id)
    util.request("/WxOrderChargeback/DelOrderChargeback", {
      chargebackId: this.data.id
    }, "POST", false).then((res) => {
      util.toast(res.Msg)
      this.setData({
        modal: false
      })
      console.log(res)
      if (this.data.selected == '0') {
        util.request("/WxOrderChargeback/GetOrderChargebackList", {
          dataType: 0,
          pageIndex: 1,
          pageSize: 10
        }, "POST", false, true).then((res) => {
          console.log(res)
          this.setData({
            alllist: res.data.itemData,
          })
          if (res.data.itemData.length == 0) {
            this.setData({
              flag: false
            })
          }
        })
      } else {
        util.request("/WxOrderChargeback/GetOrderChargebackList", {
          dataType: 1,
          pageIndex: 1,
          pageSize: 10
        }, "POST", false, true).then((res) => {
          console.log(res)
          this.setData({
            handlelist: res.data.itemData
          })
          if (res.data.itemData.length == 0) {
            this.setData({
              flag: false
            })
          }
        })
      }
    })
  },
  togoodsdetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../extend-view/proDetail/proDetail?id=${id}`,
    })
  }
})