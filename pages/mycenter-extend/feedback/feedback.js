// pages/mycenter-extend//feedback/feedback.js
const util = require('../../../utils/util.js')
var i = 0;
var str = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal: false,
    content: "",
    namevalue: "",
    phonevalue: "",
    images: [],
    imgurl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    i=0
    str=''
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
        // console.log(images)
        // var tempFilePaths=""
        // for (var i = 0; i < images.length;i++){
        //   tempFilePaths += images[i]+","
        // }
        // var token = wx.getStorageSync("token")
        // wx.uploadFile({
        //   url: 'http://p3q0820927.zicp.vip/LimitedTec.WeChat/WxUploadImg/UploadImageHandler', //仅为示例，非真实的接口地址
        //   filePath: images[0],
        //   name: 'file',
        //   formData: {
        //     'content-type': 'application/json',
        //     "AppType": "2",
        //     "AppVer": "12",
        //     "DeviceID": "psx1234567890",
        //     "Token": token,
        //   },
        //   success(res) {
        //     const data = res.data
        //     console.log(res)
        //     //do something
        //   }
        // })
      }
    })
  },
  up: function() {
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
      util.request('/WXFeedback/AddFeedback', {
        FeedType: that.data.clicknum,
        FeedContent: that.data.content,
        MemberName: that.data.namevalue,
        FeedPhone: that.data.phonevalue,
        imgurl: this.data.imgurl
      }, 'POST', false).then((res) => {
        console.log(res)
        that.setData({
          modal: false
        })
        util.toast("意见反馈成功")
        setTimeout(() => {
          wx.navigateBack({})
        }, 500)
      })

      return;
    }
    console.log(i)
    wx.uploadFile({
      url: util.interfaceUrl()+'/WxUploadImg/UploadImageHandler',
      filePath: that.data.images[i],
      name: 'image', //文件对应的参数名字(key)
      formData: data, //其它的表单信息
      success: function(res) {},
      complete: function(complete) {
        var data1 = JSON.parse(complete.data).data[0]
        console.log(data1)
        str += data1 + ","
        i++
        if (i == that.data.images.length) {
          var reg = /,$/gi;
          str = str.replace(reg, "");
          console.log(111)
          // console.log(complete)
          util.request('/WXFeedback/AddFeedback', {
            FeedType: that.data.clicknum,
            FeedContent: that.data.content,
            MemberName: that.data.namevalue,
            FeedPhone: that.data.phonevalue,
            imgurl: str
          }, 'POST', false).then((res) => {
            console.log(res)
            that.setData({
              modal: false
            })
            util.toast("意见反馈成功")
            setTimeout(() => {
              wx.navigateBack({})
            }, 500)
          })
        } else if (i < that.data.images.length) { //若图片还没有传完，则继续调用函数
          that.up()
        }
      }
    })
  },
  removeImage(e) {
    console.log(e)
    var images = this.data.images
    const idx = e.target.dataset.idx
    images.splice(idx, 1)
    i--
    str = str.substring(0, str.length - 1)
    var arr = str.split(',')
    arr.splice(idx, 1)
    str = ''
    for (var i = 0; i < arr.length; i++) {
      str += arr[i] + ","
    }
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
  showmodal: function(e) {
    console.log(this.data.content)
    if (this.isNull(this.data.content)) {
      util.toast("内容不能为空");
      return;
    }

    if (this.data.namevalue.trim().length == 0) {
      util.toast("请填写你的姓名");
      return;
    }

    if (!util.isMobile(this.data.phonevalue)) {
      util.toast("手机号格式不正确");
      return;
    }

    this.setData({
      modal: true,
      clicknum: e.currentTarget.dataset.current
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
  hideinfo: function() {
    this.setData({
      modal: false
    })
  },
  showinfo: function() {
    this.setData({
      modal: true
    })
  },
  inputcontent: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  inputname: function(e) {
    this.setData({
      namevalue: e.detail.value
    })
  },
  inputphone: function(e) {
    this.setData({
      phonevalue: e.detail.value
    })
  },
  submit: function() {
    this.up();
    // console.log(this.data.clicknum, this.data.content, this.data.namevalue, this.data.phonevalue)
    //   util.request("/WXFeedback/AddFeedback",
    //   { 
    //     FeedType:this.data.clicknum,
    //     FeedContent:this.data.content,
    //     MemberName: this.data.namevalue,
    //     FeedPhone: this.data.phonevalue,
    //     imgurl:"1234"
    //   }, "POST", false).then((res) => {
    //     console.log(res)
    //   })
    //   this.setData({
    //   modal: false
    // })
    // wx.navigateBack({

    // })
  },
  tofeedbackrecord:function(){
    wx.navigateTo({
      url: '../feedbackrecord/feedbackrecord',
    })
  }
})