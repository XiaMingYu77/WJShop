const util = require('../../../utils/util.js')
Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    jiaoflag: true,
    deleteflag: true,
    upflag: false,
    modal: false
  },
  onLoad: function() {
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

    util.request('/WxMyIndex/GetFootMark', {
      datetime: "",
      PageIndex: 1,
      PageSize: 20
    }, 'GET', false).then((res) => {
      console.log(res)
      var footmark = res.data.FootMark
      for (var i = 0; i < footmark.length; i++) {
        footmark[i].checked = false
      }
      this.setData({
        datatime: res.data.Datetime,
        footmark: footmark
      })
      console.log(footmark)
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      if (month > 0 && month < 10) {
        month = '0' + month
      }
      console.log(day)
      let day = now.getDate()
      if (day > 0 && day < 10) {
        day = '0' + day
      }
      this.setData({
        today: '' + year + '-' + month + "-" + day
      })
      this.dateInit();
      this.setData({
        year: year,
        month: month,
        isToday: '' + year + '-' + month + "-" + day
      })
      console.log(this.data.isToday, this.data.today)
    })
    setTimeout(() => {
      let query = wx.createSelectorQuery()
      query.select(".date-box").boundingClientRect((rect) => {
        this.setData({
          boxtop:rect.top+10
        })
        console.log(rect)
      }).exec()
      
      query.select('#nowDay').boundingClientRect((rect) => {
        console.log(rect)
        this.setData({
          tabtop: '-' + ((rect.top -this.data.boxtop))
        })
        console.log(rect)
      }).exec()
    }, 1000)
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
  dateInit: function(setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    console.log("now" + now)
    let year = setYear || now.getFullYear();
    console.log("year" + year)
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    console.log("month" + month)
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    console.log("nextMonth" + nextMonth)
    var a = new Date(year + '/' + (month + 1) + '/' + 1)
    console.log(year + '/' + (month + 1) + '/' + 1, a)
    let startWeek = a.getDay(); //目标月1号对应的星期
    console.log("startWeek" + startWeek)
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    console.log("dayNums" + dayNums)
    let obj = {};
    let num = 0;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    console.log("arrLen" + arrLen)

    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        if (month > 0 && month < 10) {
          obj = {
            isToday: '' + year + "-" + ('0' + (month + 1)) + "-" + num,
            dateNum: num,
            weight: 5
          }
          if (num > 0 && num < 10) {
            obj = {
              isToday: '' + year + "-" + ('0' + (month + 1)) + "-" + ('0' + (num)),
              dateNum: num,
              weight: 5
            }
          }
        } else if (num > 0 && num < 10) {
          obj = {
            isToday: '' + year + "-" + ('0' + (month + 1)) + "-" + ('0' + (num)),
            dateNum: num,
            weight: 5
          }
        } else {
          obj = {
            isToday: '' + year + "-" + (month + 1) + "-" + num,
            dateNum: num,
            weight: 5
          }
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    for (let j = 0; j < this.data.datatime.length; j++) {
      var data = this.data.datatime[j]
      for (let i = 0; i < dateArr.length; i++) {
        // console.log(data.datetime)
        if (data.datetime == dateArr[i].isToday) {
          dateArr[i].selected = true
          // console.log(dateArr[i])
        }
        // console.log(this.data.today)
        if (this.data.today == dateArr[i].isToday) {
          dateArr[i].today = true
        }
      }
    }

    console.log(dateArr)
    this.setData({
      dateArr: dateArr
    })

    // let nowDate = new Date();
    // let nowYear = nowDate.getFullYear();
    // let nowMonth = nowDate.getMonth() + 1;
    // let nowWeek = nowDate.getDay();
    // let getYear = setYear || nowYear;
    // let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    // if (nowYear == getYear && nowMonth == getMonth) {
    //   this.setData({
    //     isTodayWeek: true,
    //     todayIndex: nowWeek
    //   })
    // } else {
    //   this.setData({
    //     isTodayWeek: false,
    //     todayIndex: -1
    //   })
    // }
  },
  lastMonth: function() {
    if (!this.data.jiaoflag){
      util.toast("只能查看进两个月的足迹")
      return;
    }
    console.log(111)
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1),
      jiaoflag: !this.data.jiaoflag
    })
    this.dateInit(year, month);
  },
  nextMonth: function() {
    if (this.data.jiaoflag) {
      util.toast("只能查看进两个月的足迹")
      return;
    }
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1),
      jiaoflag: !this.data.jiaoflag
    })
    this.dateInit(year, month);
  },
  clicktime: function(e) {
    setTimeout(()=>{
      let query = wx.createSelectorQuery()
      query.select('#nowDay').boundingClientRect((rect) => {
        console.log(rect)
        this.setData({
          tabtop: '-' + ((rect.top - this.data.boxtop))
        })
      }).exec()
    },1000)
    console.log(e.currentTarget.dataset.date)
    var cur = e.currentTarget.dataset.date
    var select = e.currentTarget.dataset.select
    if (!select) {
      util.toast("这一天没有足迹哦")
      return
    }
    this.setData({
      isToday: cur
    })
    util.request('/WxMyIndex/GetFootMark', {
      datetime: cur,
      PageIndex: 1,
      PageSize: 20
    }, 'GET', false).then((res) => {
      console.log(res)
      var footmark = res.data.FootMark
      for (var i = 0; i < footmark.length; i++) {
        footmark[i].checked = false
      }
      this.setData({
        footmark: footmark
      })
    })
    setTimeout(() => {
      let query = wx.createSelectorQuery()
      query.select('.nowDay').boundingClientRect((rect) => {
        console.log(rect)
        this.setData({
          tabtop: '-' + ((rect.top - 87) * 2)
        })
        console.log(rect)
      }).exec()
    }, 500)
  },
  delete: function() {
    this.setData({
      deleteflag: !this.data.deleteflag
    })
  },
  checkboxChange: function(e) {
    console.log(e)
    var cur = e.currentTarget.dataset.index
    var footmark = this.data.footmark
    footmark[cur].checked = !footmark[cur].checked
    console.log(footmark)
    this.setData({
      footmark
    })
  },
  submitdelete: function() {
    var footmark = this.data.footmark
    var str = ''
    for (var i = 0; i < footmark.length; i++) {
      if (footmark[i].checked) {
        console.log(footmark[i].Guid)
        str += footmark[i].Guid + ","
      }
    }
    if (str.length == 0) {
      util.toast("请先选择需要删除的足迹")
      this.setData({
        modal: false
      })
      return
    }
    this.setData({
      modal: true
    })
  },
  up: function() {
    console.log(this.data.tabtop)
    this.setData({
      upflag: true
    })
  },
  down: function() {
    console.log(this.data.tabtop)
    this.setData({
      upflag: false
    })
  },
  toproductdetail: function(e) {
    if (!this.data.deleteflag && this.data.footmark != '') {
      return
    }
    var cur = e.currentTarget.dataset.current
    wx.navigateTo({
      url: '../../extend-view/proDetail/proDetail?id=' + cur,
    })
  },
  hide: function() {
    this.setData({
      modal: false
    })
  },
  submit: function() {
    var footmark = this.data.footmark
    var str = ''
    for (var i = 0; i < footmark.length; i++) {
      if (footmark[i].checked) {
        console.log(footmark[i].Guid)
        str += footmark[i].Guid + ","
      }
    }
    // if(str.length==0){
    //   util.toast("请先选择需要删除的足迹")
    //   this.setData({
    //     modal: false
    //   })
    //   return  
    // }
    console.log(str)
    var reg = /,$/gi;
    str = str.replace(reg, "");
    util.request('/WxMyIndex/DelFootMark', {
      Guid: str
    }, 'GET', false).then((res) => {
      console.log(res)
      util.toast(res.Msg)
      this.setData({
        modal: false
      })
      util.request('/WxMyIndex/GetFootMark', {
        datetime: this.data.isToday,
        PageIndex: 1,
        PageSize: 20
      }, 'GET', false, true).then((res) => {
        console.log(res)
        var footmark = res.data.FootMark
        for (var i = 0; i < footmark.length; i++) {
          footmark[i].checked = false
        }
        console.log(footmark)
        this.setData({
          footmark: footmark
        })
      })
    })
  }
})