const util = require('../../../utils/util.js')
Page({
  data: {
    searchRecord: [],
    hot: [
      "德利赫特",
      "托雷斯",
      "早安D站",
      "D站观点",
      "德利赫特",
      "美洲杯",
      "华为手机",
      "C罗",
      "自热火锅",
      "2019退役球星",
      "女神大会"
    ],
    value: "",
    showActionSheet: false,
    tips: "确认清空搜索历史吗？",
    modal: false,
    button: [{
      text: "取消",
      type: 'gray'
    }, {
      text: "确定"
    }]
  },
  onLoad: function(options) {
    var hotsearch = JSON.parse(options.hotsearch)
    console.log(hotsearch)
    this.setData({
      placeholder: options.key,
      hotsearch: hotsearch
    })
    this.openHistorySearch()
  },
  openHistorySearch: function() {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [], //若无储存则为空
    })
  },
  search: function(e) {
    // if (this.isNull(this.data.value)) {
    //   util.toast('请输入你要搜索的东西')
    //   return
    // }
    var that = this
    var inputVal = this.data.value
    console.log(inputVal)
    if (this.isNull(inputVal)) {
      inputVal = this.data.placeholder
    }
    console.log(inputVal)
    var searchRecord = this.data.searchRecord
    var flag = true
    for (var i = 0; i < searchRecord.length; i++) {
      if (searchRecord[i].value == inputVal) {
        flag = false
      }
    }

    if (inputVal == '') {
      //输入为空时的处理
      util.toast('请输入你要搜索的东西')
    } else {

      //将搜索值放入历史记录中,只能放前五条
      if (searchRecord.length < 10) {
        if (flag) {
          searchRecord.unshift({
            value: inputVal,
            id: searchRecord.length
          })
        }
      } else {
        if (flag) {
          searchRecord.pop() //删掉旧的时间最早的第一条
          searchRecord.unshift({
            value: inputVal,
            id: searchRecord.length
          })
        }
      }
      //将历史记录数组整体储存到缓存中
      wx.setStorageSync('searchRecord', searchRecord)
      wx.navigateTo({
        url: `../../extend-view1/searchdetail/searchdetail?searchKey=${inputVal}`
      })
    }
  },
  isNull: function(str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    //为空或纯空格为 true    有值为false
    console.log(re.test(str))
    return re.test(str);
  },
  tosearch: function(e) {
    if (this.data.modal) {
      return
    }
    var cur = e.currentTarget.dataset.current
    wx.navigateTo({
      url: `../../extend-view1/searchdetail/searchdetail?searchKey=${cur}`
    })
  },
  tosearch1: function(e) {
    var inputVal = e.currentTarget.dataset.current
    console.log(inputVal)
    var searchRecord = this.data.searchRecord
    var flag = true
    for (var i = 0; i < searchRecord.length; i++) {
      if (searchRecord[i].value == inputVal) {
        flag = false
      }
    }

    if (inputVal == '') {
      //输入为空时的处理
      util.toast('请输入你要搜索的东西')
    } else {

      //将搜索值放入历史记录中,只能放前五条
      if (searchRecord.length < 10) {
        if (flag) {
          searchRecord.unshift({
            value: inputVal,
            id: searchRecord.length
          })
        }
      } else {
        if (flag) {
          searchRecord.pop() //删掉旧的时间最早的第一条
          searchRecord.unshift({
            value: inputVal,
            id: searchRecord.length
          })
        }
      }
    }
    //将历史记录数组整体储存到缓存中
    wx.setStorageSync('searchRecord', searchRecord)
    this.setData({
      value: inputVal
    })
    wx.navigateTo({
      url: `../../extend-view1/searchdetail/searchdetail?searchKey=${inputVal}`
    })
  },
  deletekey: function(e) {
    this.setData({
      deleteindex: e.currentTarget.dataset.index,
      modal: true
    })
  },
  input: function(e) {
    let value = e.detail.value;
    this.setData({
      value: value
    })
  },
  cleanKey: function() {
    this.setData({
      value: ''
    });
  },
  closeActionSheet: function() {
    console.log("取消")
    this.setData({
      showActionSheet: false
    })
  },
  openActionSheet: function() {
    this.setData({
      showActionSheet: true
    })
  },
  itemClick: function(e) {
    console.log("确定")
    let index = e.detail.index;
    console.log(index)
    if(index==1){
      this.setData({
        showActionSheet: false,
        searchRecord: []
      })
      wx.setStorageSync('searchRecord', "")
    }else{
      this.setData({
        showActionSheet: false
      })
    }
  },
  hide: function() {
    this.setData({
      modal: false
    })
  },
  handleClick: function(e) {
    let index = e.detail.index;
    if (index === 0) {
      this.hide()
    } else {
      var deleteindex = this.data.deleteindex
      var searchRecord = this.data.searchRecord
      console.log(searchRecord)
      searchRecord.splice(deleteindex, 1)
      console.log(searchRecord)
      wx.setStorageSync('searchRecord', searchRecord)
      this.setData({
        searchRecord,
        modal: false
      })
    }

  }
})