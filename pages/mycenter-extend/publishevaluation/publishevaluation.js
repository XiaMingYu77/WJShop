// pages/mycenter-extend//publishevaluation/publishevaluation.js
const util = require('../../../utils/util.js')
var i = 0;
var str = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current1: "5",
    current2: "5",
    current3: "5",
    images: [],
    imgurl: '',
    src: '',
    content: "",
    modal: false,
    videourl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    i = 0
    str = ''
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
      orderid: options.data,
      flag: options.flag
    })
    util.request('/WxProOrders/GetUserOrderInfo', {
      OrderId: this.data.orderid
    }, 'POST', false).then((res) => {
      console.log(res.data)
      this.setData({
        info: res.data,
        orderproid: res.data.OrderProduct[0].OrderProID
      })
    })
  },
  change1: function(e) {
    var current1 = e.detail.index
    console.log(e)
    this.setData({
      current1
    })
  },
  change2: function(e) {
    var current2 = e.detail.index
    console.log(e)
    this.setData({
      current2
    })
  },
  change3: function(e) {
    var current3 = e.detail.index
    console.log(e)
    this.setData({
      current3
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
  inputcontent: function(e) {
    var str = this.filterEmoji(e.detail.value)
    this.setData({
      content: str
    })
    console.log(this.data.content)
  },
  chooseImage: function(e) {
    wx.chooseImage({
      sizeType: ['compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        this.setData({
          images: images.length <= 5 ? images : images.slice(0, 5)
          // images:images
        })
      }
    })
  },
  up: function() {
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    var that = this;
    var token = wx.getStorageSync("token")
    var data = {
      'content-type': 'application/json',
      "AppType": "2",
      "AppVer": "12",
      "DeviceID": "psx1234567890",
      "Token": token,
    }
    if (this.data.images.length == 0) {
      str = str.substring(0, str.length - 1)
      util.request('/WxProductComment/AddProudctComment', {
        ms: that.data.current1,
        wl: that.data.current2,
        td: that.data.current3,
        orderproid: that.data.orderproid,
        Content: that.data.content,
        videourl: that.data.videourl,
        imgurl: that.data.imgurl
      }, 'POST', false).then((res) => {
        console.log(that.data.current1, that.data.current2, that.data.current3, that.data.orderid, that.data.orderproid, that.data.content, that.data.src, that.data.imgurl)
        console.log(111)
        console.log(res)
        if (res.Msg == '评论成功！') {
          // this.setData({
          //   modal: true
          // })
          util.toast(res.Msg)
          setTimeout(() => {
            wx.navigateBack({

            })
            util.taskcomplete(2)
          }, 500)
        } else {
          util.toast(res.Msg)
          str = ""
          i = 0
          that.setData({
            images: [],
            imgurl: ''
          })
        }
      })
      return;
    }
    console.log(i)
    console.log(that.data.images[i])
    wx.uploadFile({
      url: util.interfaceUrl() + '/WxUploadImg/UploadImageHandler',
      filePath: that.data.images[i],
      name: 'image', //文件对应的参数名字(key)
      formData: data, //其它的表单信息
      success: function(res) {},
      complete: function(complete) {
        console.log(complete)
        var data1 = JSON.parse(complete.data).data[0]
        console.log(data1)
        str += data1 + ","
        i++
        if (i == that.data.images.length) {
          str = str.substring(0, str.length - 1)
          // that.setData({
          //   imgurl: str
          // })
          console.log(111)
          // console.log(complete)
          util.request('/WxProductComment/AddProudctComment', {
            ms: that.data.current1,
            wl: that.data.current2,
            td: that.data.current3,
            orderproid: that.data.orderproid,
            Content: that.data.content,
            videourl: that.data.videourl,
            imgurl: str
          }, 'POST', false).then((res) => {
            console.log(that.data.current1, that.data.current2, that.data.current3, that.data.orderid, that.data.orderproid, that.data.content, that.data.src, str)
            console.log(res)
            if (res.Msg == '评论成功！') {
              // this.setData({
              //   modal: true
              // })
              util.toast(res.Msg)
              util.taskcomplete(2)
              setTimeout(()=>{
                wx.navigateBack({
                  
                })
              },500)
            } else {
              util.toast(res.Msg)
              str = ""
              i = 0
              that.setData({
                images: [],
                imgurl: ''
              })
            }
          })
          return
        } else if (i < that.data.images.length) { //若图片还没有传完，则继续调用函数
          that.up()
        }
      },
      fail: function(res) {
        // wx.hideLoading()
        // util.toast("图片上传失败,请重新上传")
      }
    })
  },
  removeImage(e) {
    console.log(e)
    var images = this.data.images
    const idx = e.target.dataset.idx
    images.splice(idx, 1)
    // i--
    // str = str.substring(0, str.length - 1)
    // var arr = str.split(',')
    // arr.splice(idx, 1)
    // str = ''
    // for (var i = 0; i < arr.length; i++) {
    //   str += arr[i] + ","
    // }
    console.log(images)
    this.setData({
      images: images
    })
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  chooseVideo: function() {
    if (this.data.src!=""){
      util.toast("最多只能选择一个视频")
      return
    }
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      success: function(res) {
        var size = Math.floor(res.size / 1000000)
        that.setData({
          src: res.tempFilePath,
        })
        if (size <= 10) {
          // that.setData({
          //   src: res.tempFilePath,
          // })
          that.uploadvideo()
        } else {
          util.toast("您选择的视频过大")
        }
      }
    })
  },
  uploadvideo: function() {
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    var that = this
    var token = wx.getStorageSync("token")
    var data = {
      'content-type': 'application/json',
      "AppType": "2",
      "AppVer": "12",
      "DeviceID": "psx1234567890",
      "Token": token,
    }
    var src = this.data.src;
    wx.uploadFile({
      url: util.interfaceUrl() + '/WxUploadImg/UploadImageHandler', //服务器接口
      method: 'GET', 
      filePath: src,
      header: data,
      name: 'files', //服务器定义的Key值
      success: function(res) {
        that.setData({
          videourl: JSON.parse(res.data).data[0]
        })
        console.log(JSON.parse(res.data).data[0])
        wx.hideLoading()
        util.toast("视频上传成功")
        // console.log('视频上传成功')
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading()
        util.toast("视频上传失败,请重新上传视频")
        // console.log('接口调用失败')
      }
    })
  },
  filterEmoji: function(name) {
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    return str;

  },
  submit: function() {
    this.up()
    // if (!(/^[\u4E00-\u9FA5]{2,4}$/.test(this.data.content))) {
    //   util.toast("收货人姓名长度需要在2个字符以上且不能包含非法字符")
    //   return;
    // }
    // var that = this
    // str = str.substring(0, str.length - 1)
    // // var reg = /,$/gi;
    // // imgurl = imgurl.replace(reg, "");
    // console.log(that.data.content, str)
    // util.request('/WxProductComment/AddProudctComment', {
    //   ms: that.data.current1,
    //   wl: that.data.current2,
    //   td: that.data.current3,
    //   orderproid: that.data.orderproid,
    //   Content: that.data.content,
    //   videourl: that.data.src,
    //   imgurl: str
    // }, 'POST', false).then((res) => {
    //   console.log(that.data.current1, that.data.current2, that.data.current3, that.data.orderproid, that.data.content, that.data.src, that.data.imgurl)
    //   console.log(res)
    //   if (res.Msg == '评论成功！') {
    //     // this.setData({
    //     //   modal: true
    //     // })
    //     util.toast(res.Msg)
    //     wx.navigateBack({

    //     })
    //   } else {
    //     util.toast(res.Msg)
    //   }
    // })
  },
  removevideo: function() {
    this.setData({
      videourl: "",
      src:""
    })
  },
  hideinfo: function() {
    this.setData({
      modal: false
    })
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
  submit1: function() {
    if (this.data.flag == 'order') {
      wx.navigateBack({

      })
    } else if (this.data.flag == 'orderdetail') {
      const pages = getCurrentPages()
      //声明一个pages使用getCurrentPages方法
      const perpage = pages[pages.length - 3]
      //声明一个当前页面
      perpage.onLoad()
      wx.navigateBack({
        delta: 2
      })
    } else {
      const pages = getCurrentPages()
      //声明一个pages使用getCurrentPages方法
      const perpage = pages[pages.length - 2]
      //声明一个当前页面
      perpage.onLoad()
      wx.navigateBack({

      })
    }

  }
})