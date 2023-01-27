// pages/mycenter-extend//assistant/assistant.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal: false,
    tabindex: 0,
    popupShow: false,
    imgflag: true,
    flag: false
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

    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent
    })

    util.request("/WxUserInfo/GetAssistant", {}, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        list: res.data
      })
      if (this.data.list.NotpushList.length == 0) {
        this.setData({
          flag: true
        })
      }
      util.request("/WxDocumenInfo/GetAboutus", {
        Type: "187fa129f13f42918979e9111ddf60a0"
      }, "POST", false).then((res) => {
        console.log(res.data[0])
        this.setData({
          content: res.data[0].Content
        })
      })
    })
  },
  onShow: function() {
    util.request("/WxUserInfo/GetAssistant", {}, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        list: res.data
      })
      if (cur == 0) {
        if (this.data.list.NotpushList.length == 0) {
          this.setData({
            flag: true
          })
        }
      } else {
        if (this.data.list.PushList1.length == 0) {
          this.setData({
            flag: true
          })
        }
      }
      util.request("/WxDocumenInfo/GetAboutus", {
        Type: "187fa129f13f42918979e9111ddf60a0"
      }, "POST", false).then((res) => {
        console.log(res.data[0])
        this.setData({
          content: res.data[0].Content
        })
      })
    })
  },
  applyassistant: function(e) {
    console.log(e.currentTarget.dataset.current)
    var list = e.currentTarget.dataset.current
    list = JSON.stringify(list)
    wx.navigateTo({
      url: `../groupassistant1/groupassistant1?list=${list}`,
    })
  },
  hide: function() {
    this.setData({
      modal: false
    })
  },
  showmodal: function() {
    this.setData({
      modal: true
    })
  },
  clicktab: function(e) {
    var cur = e.currentTarget.dataset.current;
    this.setData({
      tabindex: cur,
      flag: false
    })
    if (cur == 0) {
      if (this.data.list.NotpushList.length == 0) {
        this.setData({
          flag: true
        })
      }
    } else {
      if (this.data.list.PushList1.length == 0) {
        this.setData({
          flag: true
        })
      }
    }
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
    util.request("/WxUserInfo/GetAssistant", {}, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        list: res.data
      })
      if (this.data.tabindex == 0) {
        if (this.data.list.NotpushList.length == 0) {
          this.setData({
            flag: true
          })
        }
      } else {
        if (this.data.list.PushList1.length == 0) {
          this.setData({
            flag: true
          })
        }
      }
      wx.stopPullDownRefresh()
    })

    util.request("/WxDocumenInfo/GetAboutus", {
      Type: "187fa129f13f42918979e9111ddf60a0"
    }, "POST", false).then((res) => {
      console.log(res.data[0])
      this.setData({
        content: res.data[0].Content
      })
    })
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
  closeassistant: function(e) {
    var id = e.currentTarget.dataset.current;
    console.log(id)
    util.request("/WxUserInfo/ShutRobot", {
      F_GUID: id
    }, "POST", false).then((res) => {
      console.log(res)
      // this.setData({
      //   list: res.data
      // })
      util.request("/WxUserInfo/GetAssistant", {}, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          list: res.data
        })
      })
    })
  },
  statuschange: function(e) {
    var cur = e.currentTarget.dataset.current;
    var id = e.currentTarget.dataset.id;
    console.log(cur)
    if (cur == '1') {
      util.request("/WxUserInfo/EditStatus", {
        F_GUID: id,
        F_STATUS: 2
      }, "POST", false, true).then((res) => {
        console.log(res)

        util.request("/WxUserInfo/GetAssistant", {}, "POST", false).then((res) => {
          console.log(res)
          this.setData({
            list: res.data
          })
          util.toast("助理推送已关闭")
        })
        // this.setData({
        //   list: res.data
        // })
      })
    } else {
      util.request("/WxUserInfo/EditStatus", {
        F_GUID: id,
        F_STATUS: 1
      }, "POST", false, true).then((res) => {
        console.log(res)

        util.request("/WxUserInfo/GetAssistant", {}, "POST", false).then((res) => {
          console.log(res)
          this.setData({
            list: res.data
          })
          util.toast("助理推送已开启")
        })
        // this.setData({
        //   list: res.data
        // })
      })
    }
  },
  deleteassistant: function(e) {
    var id = e.currentTarget.dataset.current;
    console.log(id)
    util.request("/WxUserInfo/DelPushProduct", {
      F_PRODUCTID: id
    }, "POST", false, true).then((res) => {
      console.log(res)
      util.request("/WxUserInfo/GetAssistant", {}, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          list: res.data
        })
        if (this.data.tabindex == 0) {
          if (this.data.list.NotpushList.length == 0) {
            this.setData({
              flag: true
            })
          }
        } else {
          if (this.data.list.PushList1.length == 0) {
            this.setData({
              flag: true
            })
          }
        }
      })
    })
  },
  hidePopup: function() {
    this.setData({
      popupShow: false
    })
  },
  showpop: function(e) {
    var cur = e.currentTarget.dataset.current;
    console.log(cur, cur.F_GUID)
    this.setData({
      popupShow: true,
      id: cur.ReplyID,
      name: cur.F_WX_NICKNAME,
      welcomecontent: cur.F_MSG_CONTENT
    })
  },
  inputchange: function(e) {
    var str = this.filterEmoji(e.detail.value)
    this.setData({
      welcomecontent: str
    })
    console.log(e.detail.value)
  },
  filterEmoji: function (name) {

    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");

    return str;

  },
  preserve: function() {
    console.log(this.data.id, this.data.welcomecontent)
    util.request("/WxUserInfo/EditReplay", {
      F_GUID: this.data.id,
      F_MSG_CONTENT: this.data.welcomecontent
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        popupShow: false
      })
      util.request("/WxUserInfo/GetAssistant", {}, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          list: res.data
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
  showimg: function(e) {
    console.log(e.currentTarget.dataset.current)
    var cur = e.currentTarget.dataset.current
    this.setData({
      src: cur,
      imgflag: false,
      cover: '1'
    })
  },
  closeimg: function() {
    this.setData({
      imgflag: true
    })
  },
  keepphoto: function() {
    wx.downloadFile({
      url: this.data.src, //仅为示例，并非真实的资源
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          let img = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success(res) {
              util.toast('保存成功');
            },
            fail(res) {
              util.toast('保存失败');
            }
          });
        }
      }
    })
  },
  clickposter: function() {
    console.log(111)
    var urls = []
    var src = this.data.src
    urls[0] = src
    console.log(urls)
    wx.previewImage({
      current: this.data.src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  todetail: function(e) {
    var cur = e.currentTarget.dataset.current
    wx.navigateTo({
      url: '../../extend-view/proDetail/proDetail?id=' + cur,
    })
  },
  tocreateposter: function(e) {
    var cur = e.currentTarget.dataset.current
    util.request("/WxShare/GeneratePrice", {
      productID: cur
    }, "GET", false).then((res) => {
      console.log(res)
      var img = res.Msg
      wx.navigateTo({
        url: '../../extend-view1/createposter/createposter?img=' + img,
      })
    })
  }
})