const util = require('../../../../utils/util.js')
Page({
  data: {
    isred: true,
    addressList: [],
    toggle: false,
    modal: false,
    checked: true,
    deleteinfo: {},
    actions: [],
    checked: '',
    flag: ""
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
    if (options) {
      this.setData({
        flag: options.flag
      })
    }
    util.request("/WxUserAddress/GetUserAddre", {}, "POST", false).then((res) => {
      console.log(res.data)
      var data = res.data
      for (var i = 0; i < data.length; i++) {
        if (data[i].IsDefault == '1') {
          this.setData({
            checked: i
          })
        }
      }
      this.setData({
        addressList: res.data
      })
      if (res.data.length == 0) {
        this.setData({
          isred: false
        })
      }
    })
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
  onShow() {
    console.log(111)
    util.request("/WxUserAddress/GetUserAddre", {}, "POST", false).then((res) => {
      console.log(res.data)
      var data = res.data
      for (var i = 0; i < data.length; i++) {
        if (data[i].IsDefault == '1') {
          this.setData({
            checked: i
          })
        }
      }
      this.setData({
        addressList: res.data
      })
      if (res.data.length == 0) {
        this.setData({
          isred: false
        })
      }
    })
  },
  chooseaddress: function(e) {
    console.log(1111)
    // console.log(e.currentTarget.dataset.current)
    var data = e.currentTarget.dataset.current
    // let str = JSON.stringify(data);
    let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
    let prevPage = pages[pages.length - 2]; // 上一页的数据，也可以输出来看看有什么东西
    /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，
后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */
    prevPage.setData({
      addressList: data,
    })
    /** 返回上一页 这个时候数据就传回去了 可以在上一页的onShow方法里把 value 输出来查看是否已经携带完成 */
    wx.navigateBack({})
  },
  editAddr(index, addressType) {
    wx.navigateTo({
      url: `../editAddress/editAddress?flag=` + this.data.flag
    })
  },
  edit: function(e) {
    // console.log(e.currentTarget.dataset.current)
    console.log(this.data.addressList[e.currentTarget.dataset.current1])
    var information = this.data.addressList[e.currentTarget.dataset.current1];
    var name = information.ReceiverName;
    var phonenumber = information.ReceiverPhone;
    var address = information.ReceiverAddress;
    var IsDefault = information.IsDefault;
    var ReceiverAddressID = information.ReceiverAddressID;
    var AddressID = information.AddressID
    var defalut= e.currentTarget.dataset.default
    wx.navigateTo({
      url: `../editAddress/editAddress?name=${name}&phonenumber=${phonenumber}&address=${address}&IsDefault=${IsDefault}&ReceiverAddressID=${ReceiverAddressID}&AddressID=${AddressID}&flag=${this.data.flag}&defalut=${defalut}`,
    })
  },
  delete: function(e) {
    this.setData({
      modal: true,
      deleteinfo: this.data.addressList[e.currentTarget.dataset.current2],
      deleteindex: e.currentTarget.dataset.current
    })
  },
  hide: function(e) {
    this.setData({
      modal: false
    })
  },
  clickdelete: function() {
    console.log(this.data.deleteinfo.ReceiverAddressID)
    var id = this.data.deleteinfo.ReceiverAddressID
    util.request("/WxUserAddress/DeleteUserAddre",
      ({
        id: id
      }), "POST", false, true).then((res) => {
      console.log(res)
      var addressList = this.data.addressList
      // console.log(addressList)
      for (var i = 0; i < addressList.length; i++) {
        if (addressList[i].ReceiverAddressID == id) {
          console.log(this.data.deleteindex)
          console.log(addressList[i])
          addressList.splice(this.data.deleteindex, 1)
        }
      }
      this.setData({
        modal: false,
        addressList: addressList
      })
      const pages = getCurrentPages()
      //声明一个pages使用getCurrentPages方法
      const perpage = pages[pages.length - 1]
      //声明一个当前页面
      perpage.onLoad()
    }) 
  },
  default: function(e) {
    console.log(this.data.addressList[e.currentTarget.dataset.default])
    var id = this.data.addressList[e.currentTarget.dataset.default].ReceiverAddressID;
    console.log(e.currentTarget.dataset.default)
    util.request("/WxUserAddress/SetIsDefault",
      ({
        id: id
      }), "POST", false).then((res) => {
      console.log(res)
    })

    this.setData({
      checked: e.currentTarget.dataset.default
    })
  }
})