// pages/mycenter-extend//maillist/maillist.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal: false,
    modal1: false,
    maillist: [],
    group: ["注册会员", "超级会员", "导师", "合伙人"],
    id: "",
    flag1: true,
    flag2: false,
    value: '',
    pageindex:1
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

    util.request("/WXJuniormembers/GetAddressBook", {
      pageSize: 10,
      PageIndex: 1
    }, "GET", false).then((res) => {
      console.log(res)
      var maillist = res.data
      console.log()
      if (maillist.weixin == '' || maillist.weixin === null) {
        this.setData({
          flag1: false
        })
      }
      this.setData({
        maillist:maillist,
        mymemberlist: maillist.MemberInfoModel
      })
      console.log(this.data.maillist.Group)
    })
  },
  inputchange: function(e) {
    var val = e.detail.value
    val = val.replace(/\s+/g, "");
    this.setData({
      value: val
    })
    console.log(val)
  },
  change: function() {
    this.setData({
      modal: true
    })
  },
  isNull: function (str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    //为空或纯空格为 true    有值为false
    console.log(re.test(str))
    return re.test(str);
  },
  changesubmit: function() {
    var value = this.data.value
    if (this.isNull(value)) {
      util.toast("微信号不能为空或纯空格");
      return;
    }
    util.request("/WXJuniormembers/MemberExtra", {
      Weixin: value
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        modal: false,
        flag1: true
      })
      util.request("/WXJuniormembers/GetAddressBook", {
        pageSize: 10,
        PageIndex: 1
      }, "GET", false).then((res) => {
        console.log(res.data)
        var maillist = res.data
        if (maillist.weixin == '' || maillist.weixin == 'null') {
          this.setData({
            flag1: false
          })
        }
        this.setData({
          maillist: maillist
        })
      })
    })
  },
  copy: function(e) {
    var cur = e.currentTarget.dataset.current
    var that = this
    wx.setClipboardData({
      data: cur,
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
    util.request("/WXJuniormembers/GetAddressBook", {
      pageSize: 10,
      PageIndex: 1
    }, "GET", false).then((res) => {
      console.log(res)
      var maillist = res.data
      if (maillist.weixin == '' || maillist.weixin == 'null') {
        this.setData({
          flag1: false
        })
      }
      this.setData({
        maillist,
        mymemberlist: maillist.MemberInfoModel
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    util.request("/WXJuniormembers/GetAddressBook", {
      pageSize: 10,
      PageIndex: this.data.pageindex + 1
    }, "GET", false).then((res) => {
      console.log(res)
      var maillist = res.data
      if (maillist.weixin == '' || maillist.weixin == 'null') {
        this.setData({
          flag1: false
        })
      }
      this.setData({
        mymemberlist: this.data.mymemberlist.concat(maillist.MemberInfoModel),
        pageindex:this.data.pageindex+1
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  hideinfo: function() {
    this.setData({
      modal1: false
    })
  },
  showinfo: function(e) {
    var id = e.currentTarget.dataset.current
    console.log(id)
    if (this.data.maillist.Group!='1'){
      this.setData({
        modal1: true,
        id: id
      })
    }else{
      util.toast("您不是超级会员,你不可以进行推荐")
    }
  },
  submit: function() {
    util.request("/WXJuniormembers/ExtGroup", {
      MemID: this.data.id
    }, "GET", false, true).then((res) => {
      console.log(res.data)
      util.request("/WXJuniormembers/GetAddressBook", {
        pageSize: 10,
        PageIndex: 1
      }, "GET", false).then((res) => {
        var maillist = res.data
        if (maillist.weixin == '' || maillist.weixin == 'null') {
          this.setData({
            flag1: false
          })
        }
        this.setData({
          maillist,
          modal1: false,
          mymemberlist: maillist.MemberInfoModel
        })
      })
    })
  },
  writeweixin: function() {
    util.request("/WXJuniormembers/MemberExtra", {
      Weixin: "",
      MemID: ""
    }, "GET", false).then((res) => {
      console.log(res.data)

    })
  },
  hide: function() {
    this.setData({
      modal: false
    })
  }
})