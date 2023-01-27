// pages/extend-view//search/findgoods/findgoods.js
const util = require('../../../../utils/util.js')
var i = 0;
var str = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    imgurl: '',
    name:"",
    modal:"",
    phone:"",
    flag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    i = 0
    str=""
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
  back: function () {
    wx.navigateBack()
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
  chooseImage: function (e) {
    wx.chooseImage({
      sizeType: ['compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        this.setData({
          images: images.length <= 3 ? images : images.slice(0, 3)
          // images:images
        })
      }
    })
  },
  up: function () {
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
      util.request('/WxUserFeedback/AddUserFeedback', {
        ContactNumber:that.data.phone,
        ProductName:that.data.name,
        ProductGoods:that.data.modal,
        Images: that.data.imgurl
      }, 'POST', false).then((res) => {
        console.log(res)
        if (res.Code == '200') {
          wx.redirectTo({
            url: '../successmodal/successmodal',
          })
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
    // console.log(i)
    // console.log(that.data.images[i])
    wx.uploadFile({
      url: util.interfaceUrl() + '/WxUploadImg/UploadImageHandler',
      filePath: that.data.images[i],
      name: 'image', //文件对应的参数名字(key)
      formData: data, //其它的表单信息
      success: function (res) { },
      complete: function (complete) {
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
          util.request('/WxUserFeedback/AddUserFeedback', {
            ContactNumber: that.data.phone,
            ProductName: that.data.name,
            ProductGoods: that.data.modal,
            Images: str
          }, 'POST', false).then((res) => {
            console.log(res)
            if (res.Code == '200') {
              wx.redirectTo({
                url: '../successmodal/successmodal',
              })
            } else {
              util.toast(res.Msg)
              str=""
              i=0
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
      fail: function (res) {
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
    console.log(i)
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  filterEmoji: function (name) {
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    return str;
  },
  nameinput(e){
    var str = this.filterEmoji(e.detail.value).trim()
    console.log('str'+str)
    this.setData({
      name: str
    })
    if (this.data.name.length != 0 && this.data.modal.length != 0 && this.data.phone.length != 0){
      this.setData({
        flag:false
      })
    }else{
      this.setData({
        flag: true
      })
    }
  },
  modalinput(e){
    var str = this.filterEmoji(e.detail.value)
    this.setData({
      modal: str
    })
    if (this.data.name.length != 0 && this.data.modal.length != 0 && this.data.phone.length != 0) {
      this.setData({
        flag: false
      })
    } else {
      this.setData({
        flag: true
      })
    }
  },
  phoneinput(e){
    var str = this.filterEmoji(e.detail.value)
    this.setData({
      phone: str
    })
    if (this.data.name.length != 0 && this.data.modal.length != 0 && this.data.phone.length != 0) {
      this.setData({
        flag: false
      })
    } else {
      this.setData({
        flag: true
      })
    }
  },
  isNull: function (str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    //为空或纯空格为 true    有值为false
    console.log(re.test(str))
    return re.test(str);
  },
  submit(){
    console.log(this.data.phone)
    if (this.data.name.length==0) {
      util.toast("请填写商品名称")
      return
    }
    if (this.data.modal.length == 0) {
      util.toast("请填写商品型号")
      return
    }
    if (!util.isMobile(this.data.phone)){
      util.toast("请填写正确的手机号码")
      return
    }

    this.up()
  },
  tofindgoodsrecord:function(){
    wx.navigateTo({
      url: '../findgoodsrecord/findgoodsrecord',
    })
  }
})