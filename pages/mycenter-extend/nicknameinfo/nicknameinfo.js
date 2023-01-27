// pages/mycenter-extend//nicknameinfo/nicknameinfo.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "1997-09-05",
    modal: false,
    images: []
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

    util.request("/WxUserInfo/GetMemberInfo", {}, "POST", false).then((res) => {
      console.log(res)
      var str = res.data.BirthYear + "-" + res.data.BirthMonth + "-" + res.data.BirthDay
      var reg = /^\s+|\s+|\s+$/g; //匹配开头结尾和中间的所有空白符
      str = str.replace(reg, '');
      if (res.data.BirthYear == null || res.data.BirthMonth == null || res.data.BirthDay==null){
        str = this.getime()
      }
      console.log(str, this.getime())
      var img = []
      img[0] = res.data.Photo
      console.log(img)                         
      var sex = res.data.MemSex
      if (sex != 1 && sex != 2) {
        sex = 2
      }

      var endtime=this.getime()
      // console.log(endtime)
      this.setData({
        list: res.data,
        images: img,
        name: res.data.NickName,
        sex: sex,
        url: res.data.Photo,
        date: str,
        endtime
      })
    })
  },
  getime: function() {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    // console.log(Y + '-' + M + '-' + D);
    return Y + '-' + M + '-' + D 
  },
  radiochange: function(e) {
    console.log(e)
    this.setData({
      sex: e.detail.value
    })
  },
  inputchange: function(e) {
    // if (e.detail.value.length>=10){
    //   util.toast('您输入的昵称长度过长')
    //   return
    // }
    // console.log(e.detail.value)
    // if (!(/^[\u4E00-\u9FA5]{2,4}$/.test(e.detail.value))) {
    //   // util.toast("收货人姓名不能包含非法字符")
    //   return;
    // } else {
    //   this.setData({
    //     name: e.detail.value
    //   })
    // }
    var str = this.filterEmoji(e.detail.value)
    this.setData({
      name: str
      })
    console.log(str)
  },
  filterEmoji: function (name) {
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    return str;
  },
  isNull: function (str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    //为空或纯空格为 true    有值为false
    console.log(re.test(str))
    return re.test(str);
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    this.setData({
      date: e.detail.value
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
  hide: function() {
    this.setData({
      modal: false
    })
  },
  submit: function() {
    this.setData({
      modal: true
    })
  },
  chooseImage(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images
        images[0] = res.tempFilePaths[0]
        // console.log(images)
        // 限制最多只能留下3张照片
        // this.data.images = images.length <= 1 ? images : images.slice(0, 1)
        var list = this.data.list;
        list.Photo = images
        this.setData({
          images: images,
          list: list
        })
        console.log(this.data.images)
        var img = this.data.images[0]
        // console.log(img)
        var that = this;
        var token = wx.getStorageSync("token")
        var data = {
          'content-type': 'application/json',
          "AppType": "2",
          "AppVer": "12",
          "DeviceID": "psx1234567890",
          "Token": token,
        }
        // console.log(util.interfaceUrl)
        wx.uploadFile({
          url: util.interfaceUrl()+'/WxUploadImg/UploadImageHandler',
          filePath: that.data.images[0],
          name: 'image', //文件对应的参数名字(key)
          formData: data, //其它的表单信息
          success: function(res) {},
          complete: function(complete) {
            var data1 = JSON.parse(complete.data).data[0]
            // console.log(data1)
            that.setData({
              url: data1
            })
            // console.log(that.data.images[0])
            // console.log(complete.data)
          }
        })

      }
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
  confirm: function() {
    if (this.isNull(this.data.name)){
      util.toast("你的昵称不能全部为空格");
      this.setData({
        modal: false
      })
      return
    }
    if (this.data.name.length>11) {
      console.log(this.data.name.length)
      util.toast("你的昵称过长,请重新输入")
      this.setData({
        modal:false
      })
      return
    }
    var data = this.data.date.split("-")
    var year = data[0]
    var month = data[1]
    var day = data[2]
    console.log(this.data.url, this.data.name, this.data.sex, year, month, day)
    util.request("/WxUserInfo/UpdateUserInfo", {
      MemSex: this.data.sex,
      BirthYear: year,
      BirthMonth: month,
      BirthDay: day,
      Photo: this.data.url,
      NickName: this.data.name
    }, "POST", false).then((res) => {
      if (res.Msg == "修改成功") {
        this.setData({
          modal: false
        })
        util.toast("修改昵称信息成功")
        setTimeout(() => {
          wx.switchTab({
            url: '../../mycenter/mycenter',
          })
        }, 500)
      } else {
        util.toast("修改昵称信息失败")
        this.setData({
          modal: false
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})