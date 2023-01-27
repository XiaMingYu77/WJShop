const util = require('../../../../utils/util.js')
Page({
  data: {
    nameValue: "",
    telValue: "",
    addressValue: "",
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: '',
    provinceid: "",
    cityid: "",
    areaid: "",
    addressId: "",
    ReceiverAddressID: "",
    btn: ''
  },
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

    console.log(options)
    if (options.address) {
      console.log(options)
      var address = options.address.split(",")
      console.log(address)
      this.setData({
        nameValue: options.name,
        telValue: options.phonenumber,
        addressValue: address[3],
        ReceiverAddressID: options.ReceiverAddressID,
        addressId: options.AddressID,
        prodetail: options.prodetail,
        flag: options.flag,
        areaInfo: address[0] + "," + address[1] + "," + address[2],
        defalut: options.IsDefault
      })
    }
    if (options.flag) {
      this.setData({
        flag: options.flag
      })
    }

    // console.log(options.AddressID)

    if (options.ReceiverAddressID) {
      this.setData({
        btn: "edit"
      })
    } else {
      this.setData({
        btn: "new"
      })
    }
    console.log(this.data.btn)

    // util.request("/WxUserAddress/GetChildrenAreas",
    //   {}, "POST", false).then((res) => {
    //     this.setData({
    //       provinces: res.data
    //     })
    //     // console.log(res.data)
    //     // console.log(this.data.provinces)
    //   })
    // util.request("/WxUserAddress/GetChildrenAreas",
    //   { AreaNo: "1001"}, "POST", false).then((res) => {
    //     this.setData({
    //       citys: res.data
    //     })
    //     // console.log(res.data)
    //     console.log(this.data.citys)
    //   })

    // util.request("/WxUserAddress/GetChildrenAreas",
    //   { AreaNo: "1001001" }, "POST", false).then((res) => {
    //     this.setData({
    //       areas: res.data
    //     })
    //     // console.log(res.data)
    //     console.log(this.data.areas)
    //   })
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
  switchchange: function(e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      this.setData({
        defalut: 1
      })
    } else {
      this.setData({
        defalut: 0
      })
    }
  },
  checkChar: function(s) {
    var illegal = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    if (illegal.test(s)) { //js的方法，适用与小程序
      return true //有非法字符，继续你的操作
    } else {
      return false //没有继续你的表演
    }
  },
  toaddress1: function() {
    // if (this.data.nameValue == '') {
    //   util.toast("请填写收货人姓名")
    //   return;
    // }
    if (this.data.nameValue.length < 2 || this.data.nameValue.length > 25) {
      util.toast("收货人长度需要在2-25个字符之间,不能包含特殊字符")
      return;
    }
    console.log(this.checkChar(this.data.nameValue))
    // if (!(/^[\u4E00-\u9FA5]{2,4}$/.test(this.data.nameValue))) {
    //   util.toast("收货人姓名长度需要在2个字符以上且不能包含非法字符")
    //   return;
    // }
    if (this.data.areaInfo == '') {
      util.toast("请选择所在地区")
      return;
    }
    // if (this.data.addressValue == '') {
    //   util.toast("请填写详细地址")
    //   return;
    // }
    if (this.data.addressValue.length < 5 || this.data.addressValue.length >120 ) {
      util.toast("详细地址长度需要在5-120个字符之间,不能包含特殊字符")
      return;
    }
    var that = this
    // wx.navigateTo({
    //   url: "../address/address"
    // })
    var addressid = that.data.provinceid + "," + that.data.cityid + "," + that.data.areaid
    var address = that.data.areaInfo + "," + that.data.addressValue;

    if (util.isMobile(that.data.telValue)) {
      util.request("/WxUserAddress/AddUserAddre",
        {
          ReceiverName: that.data.nameValue,
          ReceiverAddress: address,
          ReceiverPhone: that.data.telValue,
          IsDefault: this.data.defalut,
          AddressID: addressid
        }, "POST", false).then((res) => {
        console.log(res)
        if(res.Code==400){
          util.toast(res.Msg)
          return
        }
        console.log(this.data.flag)
        if (this.data.flag == 'true') {
          const pages = getCurrentPages()
          //声明一个pages使用getCurrentPages方法
          const perpage = pages[pages.length - 3]
          var obj = {
            ReceiverName: this.data.nameValue,
            ReceiverAddress: address,
            ReceiverPhone: this.data.telValue,
            IsDefault: "0",
            AddressID: addressid,
            ReceiverAddressID: res.Msg
          }
          perpage.setData({
            addressList: obj
          })
          wx.navigateBack({
            delta: 2
          })
          return
        }

        console.log(this.data.nameValue, this.data.telValue, this.data.addressValue)
        if (this.data.prodetail) {
          const pages = getCurrentPages()
          //声明一个pages使用getCurrentPages方法
          const perpage = pages[pages.length - 2]
          // var address = perpage.data.address
          var that = this
          util.request("/WxUserAddress/GetUserAddre", {
            IsDefault: "1"
          }, "POST", false).then((res) => {
            console.log(res)
            perpage.setData({
              address: res.data[0],
              hasaddress: false
            })
          })
          wx.navigateBack({

          })

        } else {
          console.log(111)
          // const pages = getCurrentPages()
          // //声明一个pages使用getCurrentPages方法
          // const perpage = pages[pages.length - 2]
          // console.log(perpage)
          // //声明一个当前页面
          // perpage.onLoad()
          wx.navigateBack({

          })
        }
      })

    } else {
      console.log(util.isMobile(that.data.telValue))
      util.toast("手机号格式不正确")
    }

  },
  toaddress2: function() {
    console.log(this.data.nameValue.length)
    if (this.data.nameValue.length < 2 || this.data.nameValue.length > 25) {
      util.toast("收货人长度需要在2-25个字符之间,不能包含特殊字符")
      return;
    }
    if (this.data.areaInfo == '') {
      util.toast("请选择所在地区")
      return;
    }
    // if (!(/^[\u4E00-\u9FA5]{2,4}$/.test(this.data.nameValue))) {
    //   util.toast("收货人姓名长度需要在2个字符以上且不能包含非法字符")
    //   return;
    // }
    console.log(this.data.addressValue.length)
    if (this.data.addressValue.length < 5 || this.data.addressValue.length > 120) {
      util.toast("详细地址长度需要在5-120个字符之间,不能包含特殊字符")
      return;
    }
    var that = this
    // wx.navigateTo({
    //   url: "../address/address"
    // })
    var addressid = that.data.provinceid + "," + that.data.cityid + "," + that.data.areaid
    var address = that.data.areaInfo + "," + that.data.addressValue;
    if (util.isMobile(that.data.telValue)) {
      console.log(this.data.nameValue, this.data.telValue, this.data.addressValue)
      util.request("/WxUserAddress/UpdateUserAddre",
        ({
          ReceiverName: that.data.nameValue,
          ReceiverAddress: address,
          ReceiverPhone: that.data.telValue,
          IsDefault: that.data.defalut,
          AddressID: addressid,
          ReceiverAddressID: that.data.ReceiverAddressID
        }), "POST", false).then((res) => {
        console.log(res)
        if (this.data.flag == 'true') {
          const pages = getCurrentPages()
          //声明一个pages使用getCurrentPages方法
          const perpage = pages[pages.length - 3]
          // util.request("/WxUserAddress/GetUserAddre", {
          //   IsDefault: "1"
          // }, "POST", false).then((res) => {
          //   console.log(res)

          // })
          var obj = {
            ReceiverName: that.data.nameValue,
            ReceiverAddress: address,
            ReceiverPhone: that.data.telValue,
            IsDefault: that.data.IsDefault,
            AddressID: addressid,
            ReceiverAddressID: that.data.ReceiverAddressID
          }
          perpage.setData({
            addressList: obj
          })
          wx.navigateBack({
            delta: 2
          })
          return
        }
        const pages = getCurrentPages()
        //声明一个pages使用getCurrentPages方法
        const perpage = pages[pages.length - 2]
        console.log(perpage)
        //声明一个当前页面
        perpage.onLoad()
        wx.navigateBack({

        })
      })
      // console.log(that.data.nameValue, address, that.data.telValue, that.data.IsDefault, that.data.addressid, that.data.ReceiverAddressID)
      // wx.redirectTo({
      //   url: '../address/address',
      // })
      // const pages = getCurrentPages()
      // //声明一个pages使用getCurrentPages方法
      // const perpage = pages[pages.length - 2]
      // console.log(perpage)
      // //声明一个当前页面
      // perpage.onLoad()
      // wx.navigateBack({

      // })
    } else {
      console.log(util.isMobile(that.data.telValue))
      util.toast("手机号格式不正确")
    }
  },
  filterEmoji: function (name) {
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    return str;
  },
  getInput: function(e) {
    var str = this.filterEmoji(e.detail.value)
    this.setData({
      nameValue: str
    })
  },
  getInput1: function(e) {
    this.setData({
      telValue: e.detail.value
    })
  },
  showAddressMenu: function() {
    this.setData({
      addressMenuIsShow: true
    })
    util.request("/WxUserAddress/GetChildrenAreas", {}, "POST", false).then((res) => {
      this.setData({
        provinces: res.data
      })
      var AreaNo = res.data[0].AreaNo
      util.request("/WxUserAddress/GetChildrenAreas", {
        AreaNo: AreaNo
      }, "POST", false).then((res) => {
        this.setData({
          citys: res.data
        })
        var AreaNo = res.data[0].AreaNo
        util.request("/WxUserAddress/GetChildrenAreas", {
          AreaNo: AreaNo
        }, "POST", false).then((res) => {
          this.setData({
            areas: res.data
          })
        })
      })
    })


  },
  getInput3: function(e) {
    this.setData({
      addressValue: e.detail.value
    })
  },
  selectDistrict: function(e) {
    // var that = this
    // // 如果已经显示，不在执行显示动画
    // if (that.data.addressMenuIsShow) {
    //   return
    // }
    // // 执行显示动画
    // that.startAddressAnimation(true)
  },
  // 执行动画
  // startAddressAnimation: function (isShow) {
  //   console.log(isShow)
  //   var that = this
  //   if (isShow) {
  //     // vh是用来表示尺寸的单位，高度全屏是100vh
  //     that.animation.translateY(0 + 'vh').step()
  //   } else {
  //     that.animation.translateY(40 + 'vh').step()
  //   }
  //   that.setData({
  //     animationAddressMenu: that.animation.export(),
  //     addressMenuIsShow: isShow,
  //   })
  // },
  // 点击地区选择取消按钮
  cityCancel: function(e) {
    // this.startAddressAnimation(false)
    this.setData({
      addressMenuIsShow: false
    })
  },
  // 点击地区选择确定按钮
  citySure: function(e) {
    var that = this
    // var city = that.data.city
    var value = that.data.value
    // console.log(value)
    // console.log(that.data.citys[value[1]])
    // that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    if (that.data.citys.length == 0 || that.data.areas.length == 0) {
      util.toast("请选择完整的地址信息")
      return
    }
    var areaInfo = that.data.provinces[value[0]].AreaName + ',' + that.data.citys[value[1]].AreaName + ',' + that.data.areas[value[2]].AreaName
    that.setData({
      areaInfo: areaInfo,
    })
    console.log(areaInfo)
    this.setData({
      addressMenuIsShow: false
    })
  },
  // 点击蒙版时取消组件的显示
  hideCitySelected: function(e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function(e) {
    // console.log(e)
    var value = e.detail.value
    console.log(value)
    // console.log(this.data.provinces[e.detail.value[0]].AreaNo)

    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var AreaNo1 = this.data.provinces[e.detail.value[0]].AreaNo
      util.request("/WxUserAddress/GetChildrenAreas", {
        AreaNo: AreaNo1
      }, "POST", false).then((res) => {
        this.setData({
          citys: res.data
        })
        var AreaNo = res.data[0].AreaNo
        util.request("/WxUserAddress/GetChildrenAreas", {
          AreaNo: AreaNo
        }, "POST", false).then((res) => {
          this.setData({
            areas: res.data
          })
        })
        // console.log(this.data.citys)
      })
      var id = provinces[provinceNum].AreaID
      console.log(id)
      this.setData({
        value: [provinceNum, 0, 0],
        provinceid: id
      })

    }
    if (this.data.value[1] != cityNum) {
      var AreaNo2 = this.data.citys[e.detail.value[1]].AreaNo
      console.log(this.data.citys[e.detail.value[1]].AreaNo)
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      util.request("/WxUserAddress/GetChildrenAreas", {
        AreaNo: AreaNo2
      }, "POST", false).then((res) => {
        this.setData({
          areas: res.data
        })
        console.log(res.data)
      })
      var id = citys[cityNum].AreaID
      console.log(id)
      this.setData({
        value: [provinceNum, cityNum, 0],
        cityid: id
      })

    }
    if (this.data.value[2] != countyNum) {
      // 滑动选择了区
      var id = areas[countyNum].AreaID
      console.log(id)
      this.setData({
        value: [provinceNum, cityNum, countyNum],
        areaid: id
      })
    }
    // console.log(this.data)

  }
})