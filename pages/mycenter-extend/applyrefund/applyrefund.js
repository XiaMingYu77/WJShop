// pages/mycenter-extend//applyrefund/applyrefund.js
const util = require('../../../utils/util.js')
var i = 0
var str = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popupShow: false,
    popupShow1: false,
    activeindex1: '0',
    activeindex2: '0',
    information: "",
    lastArea: 140,
    images: [],
    imgurl: '',
    modal: false,
    key1: 0,
    key2: 0,
    content1: "我要退款",
    content2: "",
    reason: ['我要退款', '我要退货退款', '我要换货'],
    tips: ['退款', '退货退款', '换货'],
    status: ['未收到货', '已收到货'],
    statuscontent: '',
    statusindex: '',
    activeindex1: 0,
    activeindex2: '',
    chargebackid: '',
    choosemodelflag: false,
    selectedCurrent: [],
    selectedAttr: [],
    selectedname: [],
    areatext: '必填,请您详情填写申请说明',
    multiShow: true,
    modal1:false
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

    var memid = wx.getStorageSync("MemID")
    var person = wx.getStorageSync("name")
    this.setData({
      memid,
      person
    })

    console.log(options.orderid, options.price)
    this.setData({
      orderid: options.orderid,
      price: options.price,
      changeflag:options.changeflag
    })
    if (options.chargebackid) {
      this.setData({
        chargebackid: options.chargebackid
      })
    }

    util.request("/WxProOrders/GetUserOrderInfo", {
      OrderId: this.data.orderid
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        order: res.data,
        orderpro: res.data.OrderProduct[0],
        goodsid: res.data.OrderProduct[0].GoodsID,
        proid: res.data.OrderProduct[0].ProductID,
        reQuantity: res.data.OrderProduct[0].Quantity
      })
    })

    // util.request("/WxRefundOrder/GetRefundRemark", {
    //   Type: 1
    // }, "POST", false).then((res) => {
    //   console.log(res)
    //   this.setData({
    //     reason: res.data
    //   })
    // })

    // util.request("/WxRefundOrder/GetRefundRemark", {
    //   Type: 3
    // }, "POST", false).then((res) => {
    //   console.log(res)
    //   this.setData({
    //     reason1: res.data
    //   })
    // })

    var phone = wx.getStorageSync("userid")
    this.setData({
      phone
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
  hidePopup: function() {
    this.setData({
      popupShow: false,
      popupShow1: false,
      popupShow2: false,
    })
  },
  applytype: function() {
    this.setData({
      popupShow: true
    })
  },
  applyreason: function() {
    console.log(this.data.statusindex)
    if (this.data.activeindex1 == 0 && this.data.statusindex === '') {
      util.toast("请选择商品状态")
      return;
    }
    this.setData({
      popupShow1: true
    })
  },
  showstatus: function() {
    this.setData({
      popupShow2: true
    })
  },
  choosereason1: function(e) {
    var current = e.currentTarget.dataset.current;
    console.log(current)
    var index = e.currentTarget.dataset.index;
    if (index == '2') {
      //获取商品详情
      util.request("/WxProductData/GetProductInfo", {
        id: this.data.proid
      }, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          infoModel: res.data.InfoModel,
          storage: res.data.InfoModel.Storage,
          marketPrice: res.data.InfoModel.MarketPrice,
        })
        console.log(this.data.storage)
        var productrule = JSON.parse(this.data.infoModel.ProductRule)
        console.log(productrule)
        this.setData({
          productrule: productrule
        })
      })
    }
    if (this.data.activeindex1 != index) {
      this.setData({
        content2: '',
        activeindex2: '',
        statusindex: '',
        statuscontent: ''
      })
    }
    this.setData({
      activeindex1: index,
      content1: this.data.reason[index],
      popupShow: false
    })
    console.log(this.data.key1)
    if (index != 0) {
      util.request("/WxOrderChargeback/GetOrderChargebackReasonList", {
        type: this.data.activeindex1,
        state: '-1'
      }, "GET", false).then((res) => {
        console.log(res)
        this.setData({
          reason1: res.data[0].nodes,
          statusindex:'-1'
        })
      })
    }
  },
  choosereason2: function(e) {
    var current = e.currentTarget.dataset.current;
    console.log(current)
    var index = e.currentTarget.dataset.index;
    this.setData({
      activeindex2: index,
      content2: current,
      popupShow1: false
    })
    console.log(this.data.activeindex2)
  },
  choosestatus: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    if (this.data.statusindex != index) {
      this.setData({
        content2: '',
        activeindex2: ''
      })
    }
    this.setData({
      statusindex: index,
      statuscontent: this.data.status[index],
      popupShow2: false
    })
    util.request("/WxOrderChargeback/GetOrderChargebackReasonList", {
      type: this.data.activeindex1,
      state: this.data.statusindex
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        reason1: res.data[0].nodes
      })
    })
  },
  // submit1: function() {
  //   this.setData({
  //     content1: this.data.reason[this.data.activeindex1].Value,
  //     popupShow: false
  //   })
  // },
  // submit2: function() {
  //   this.setData({
  //     content2: this.data.reason1[this.data.activeindex2].Value,
  //     popupShow1: false
  //   })
  //   console.log(this.data.content2)
  // },
  getDataBindTap: function(e) {
    var information = e.detail.value; //输入的内容
    var value = e.detail.value.length; //输入内容的长度
    console.log(value)
    var lastArea = 140 - value; //剩余字数
    var that = this;
    that.setData({
      information: information,
      lastArea: lastArea
    })
  },
  chooseImage: function(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log(i)
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        this.setData({
          images: images.length <= 5 ? images : images.slice(0, 5)
          // images:images
        })
        console.log(images)
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
    // that.data.images[i]
    var quantity = that.data.reQuantity
    if (that.data.activeindex1 == '2') {
      quantity = that.data.value
    }
    var goodid = this.data.goodsid
    var goodid1 = this.data.goodsid1
    // if (that.data.activeindex1 == '2') {
    //   goodid1 = that.data.goodsid1
    // }
    var price = that.data.orderpro.SubPrice
    if (that.data.activeindex1 == '2') {
      price = 0
    }
    console.log(quantity)
    if (this.data.images.length == 0) {
      console.log(that.data.chargebackid, that.data.memid,that.data.statusindex, that.data.activeindex2)
      util.request('/WxOrderChargeback/ChargebackApplyFor', {
        ChargebackId: that.data.chargebackid,
        OrderId: that.data.orderid,
        OrdersNo: that.data.order.OrderNo,
        GoodsRejected: that.data.activeindex1,
        RefundAmount: price,
        DrawbackCause: that.data.activeindex2,
        Drawbackexplain: that.data.information,
        UploadingUrl: str,
        OrderReceipt: that.data.statusindex,
        ProductID: that.data.orderpro.ProductID,
        reQuantity: quantity,
        GoodID: goodid,
        NewProductID: that.data.orderpro.ProductID,
        NewGoodID: that.data.goodsid1,
        OporManager: that.data.person,
        MemID: that.data.memid
      }, 'POST', false).then((res) => {
        console.log(res)
        that.setData({
          modal: false
        })
        util.toast(res.Msg)
        if (res.Msg == '操作成功') {
          util.toast("申请" + that.data.tips[that.data.activeindex1]+"成功")
          if(that.data.changeflag=='true'){
            wx.navigateBack({
              delta:2
            })
          }else{
            setTimeout((res) => {
              wx.reLaunch({
                url: '../drawback/drawback?flag=true',
              })
            }, 500)
          } 
          
        }
      })
      return;
    }
    // console.log(i)
    wx.uploadFile({
      url: util.interfaceUrl() + '/WxUploadImg/UploadImageHandler',
      filePath: that.data.images[i],
      name: 'image', //文件对应的参数名字(key)
      formData: data, //其它的表单信息
      success: function(res) {},
      complete: function(complete) {
        console.log(complete)
        var data1 = JSON.parse(complete.data).data[0]
        console.log(data1,i)
        str += data1 + ","
        i++
        if (i == that.data.images.length) {
          wx.hideLoading()
          util.toast("图片上传完成")
          util.request('/WxOrderChargeback/ChargebackApplyFor', {
            ChargebackId: that.data.chargebackid,
            OrderId: that.data.orderid,
            OrdersNo: that.data.order.OrderNo,
            GoodsRejected: that.data.activeindex1,
            RefundAmount: price,
            DrawbackCause: that.data.activeindex2,
            Drawbackexplain: that.data.information,
            UploadingUrl: str,
            OrderReceipt: that.data.statusindex,
            ProductID: that.data.orderpro.ProductID,
            reQuantity: quantity,
            GoodID: goodid,
            NewProductID: that.data.orderpro.ProductID,
            NewGoodID: that.data.goodsid1,
            OporManager: that.data.person,
            MemID: that.data.memid
          }, 'POST', false).then((res) => {
            console.log(res)
            that.setData({
              modal: false
            })
            util.toast(res.Msg)
            if (res.Msg == '操作成功') {
              util.toast("申请" + that.data.tips[that.data.activeindex1] + "成功")
              if (that.data.changeflag == 'true') {
                wx.navigateBack({
                  delta: 2
                })
              } else {
                setTimeout((res) => {
                  wx.reLaunch({
                    url: '../drawback/drawback?flag=true',
                  })
                }, 500)
              }
            }
          })
        } else if (i < that.data.images.length) { //若图片还没有传完，则继续调用函数
          that.up()
        }
      },
      fail:function(res){
        wx.hideLoading()
        util.toast("图片上传失败,请重新选择图片")
        this.setData({
          images:[]
        })
        console.log('图片上传失败')
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
    // var arr=str.split(',')
    // arr.splice(idx, 1)
    // str=''
    // for(var i=0;i<arr.length;i++){
    //   str += arr[i]+","
    // }
    // console.log(arr)
    // console.log(str,i)
    // console.log(images)
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
  hide: function() {
    console.log(1111)
    this.setData({
      modal: false
    })
  },
  submit: function() {
    console.log(this.data.key1, this.data.key2, this.data.information)
    if (this.data.content1 == "") {
      util.toast("请选择申请类型")
      return
    }
    console.log(this.data.status)
    if (this.data.activeindex1 == 0 && this.data.statusindex === '') {
      util.toast("请选择商品状态")
      return
    }
    if (this.data.content2 == "") {
      util.toast("请选择申请原因")
      return
    }
    if (this.data.information == "") {
      util.toast("请填写申请说明")
      return
    }
    // if (!util.isMobile(this.data.phone)) {
    //   util.toast("请输入正确的手机号")
    //   return
    // }
    this.setData({
      modal: true,
      modal1:true
    })
  },
  confirm: function() {
    this.up()
  },
  phonechange: function(e) {
    var phone = e.detail.value
    console.log(phone)
    this.setData({
      phone
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
  showpromodal: function() {
    this.setData({
      choosemodelflag: true,
      modal1:true
    })
  },
  hide: function() {
    this.setData({
      choosemodelflag: false,
      modal1: false
    })
  },
  choosemodel: function(e) {
    this.setData({
      value: 1
    })
    console.log(e.currentTarget.dataset.current);
    console.log(e.currentTarget.dataset.name);

    var nowCurrent = this.data.selectedCurrent;
    var nowAttr = this.data.selectedAttr;
    var selectedname = this.data.selectedname;
    nowCurrent[e.currentTarget.dataset.current - 1] = e.currentTarget.dataset.current;
    nowAttr[e.currentTarget.dataset.current - 1] = e.currentTarget.dataset.attrIndex;
    selectedname[e.currentTarget.dataset.current - 1] = e.currentTarget.dataset.name
    this.setData({
      selectedCurrent: nowCurrent,
      selectedAttr: nowAttr,
      selectedname: selectedname
    })
    console.log(this.data.selectedCurrent, this.data.selectedAttr, this.data.selectedname)
    var modalstr = ''
    for (var i = 0; i < this.data.selectedname.length; i++) {
      if (this.data.selectedname[i] !== undefined) {
        modalstr += this.data.selectedname[i] + ","
      }
    }
    var reg = /,$/gi;
    modalstr = modalstr.replace(reg, "");
    console.log(modalstr)
    this.setData({
      modalstr: modalstr
    })
    util.request("/WxProductData/GetProductGoodInfo", {
      proid: this.data.proid,
      vailS: modalstr
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        storage: res.data.Storage,
        goodsid1: res.data.GoodID
      })
    })
  },
  choosemodalsubmit: function() {
    var num = 0
    var that = this
    for (var i = 0; i < this.data.productrule.length; i++) {
      if (this.data.productrule[i].specName) {
        num = num + 1
      }
    }
    // console.log(num)
    var r = this.data.selectedname.filter(function(s) {
      return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
    });
    // console.log(r.length)
    if (this.data.storage <= 0) {
      util.toast("该规格库存不足")
      return
    }
    
    if (r.length !== num) {
      util.toast("请完整选择规格");
      return;
    }

    this.setData({
      choosemodelflag: false,
      modal1:false
    })
    console.log(this.data.modalstr, this.data.reQuantity)
  },
  change1: function(e) {
    console.log(e.detail.value)
    this.setData({
      value: e.detail.value
    })
  },
  hidemodal: function() {
    this.setData({
      modal: false,
      modal1:false
    })
  },
  ifshowArea: function(e) {
    var t_show = e.currentTarget.dataset.show == "yes" ? true : false;
    if (t_show) {
      this.setData({　　　　　　
        areatext: this.data.information ? this.data.information : "必填,请您详情填写申请说明"　　
      });
      this.setData({
        multiShow: t_show
      })
    } else {
      this.setData({
        multiShow: t_show
      })
    }
  }
})