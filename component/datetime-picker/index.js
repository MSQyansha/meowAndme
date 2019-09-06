// component/datetime-picker/index.js
const DateUtil= require('./dateTimePicker')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dateValue:String,
    dataStatus:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    dateTimeArray: null,
    dateTime: null,//[]
    startYear: new Date().getFullYear(),
    endYear: 2050,
    // dataStatus: false,//秒杀时间选择
    // dateValue:'2019-09-09 15:00',//初始化时间
    isWeek:true,//是否选择星期
    height: 50,//每picker-view-column的高度 可以自定义从外曾传入
  },
  /**
       * 组件的生命周期
       */
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      // 获取完整的年月日 时分秒，以及默认显示的数组
      const { startYear, endYear, isWeek, dateValue} = this.data
      let obj = DateUtil.dateTimePicker(startYear, endYear, isWeek, dateValue);
      // 精确到分的处理，将数组的秒去掉
      obj.dateTimeArray.pop();
      obj.dateTime.pop();

      this.setData({
        dateTimeArray: obj.dateTimeArray,
        dateTime: obj.dateTime
      });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //取消
    _cancelDateModule:function (params) {
      let myEventDetail = { } // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      this.triggerEvent('close', myEventDetail, myEventOption)
    },
    
    //确定
    _confirmDateModule:function (params) {
      let self =this
      const { isWeek, dateTimeArray, dateTime } = self.data 

  
      let year = dateTimeArray[0][dateTime[0]],
        mont = dateTimeArray[1][dateTime[1]] ,
        date = isWeek ? dateTimeArray[2][dateTime[2]].slice(0,2) : dateTimeArray[2][dateTime[2]] ,
        hour = dateTimeArray[3][dateTime[3]],
        minu = dateTimeArray[4][dateTime[4]];
      let _parmasDate = year + '-' + mont + '-' + date + ' ' + hour + ':' + minu;


      if (new Date(DateUtil.getNowDate().replace(/\-/g, '/')).getTime() + 9 * 60 * 1000 >= new Date(_parmasDate.replace(/\-/g, '/')).getTime() ) {
        wx.showToast({
          title: '时间不可选，请选择后续时间哦~',
          icon: 'none'
        });
        return
      }

      let myEventDetail = {
        value: _parmasDate
      } // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      self.triggerEvent('close', myEventDetail, myEventOption)

      self.setData({
        dateValue: _parmasDate
      })
    },
    

    _bindChange: function (e) {
      // console.log(e.detail.value, 'bindChange');//[9, 8, 1, 20, 11]
      let { dateTime, dateTimeArray, isWeek} = this.data
      const indexVal = e.detail.value //value为数组，表示 picker-view 内的 picker-view-column 当前选择的是第几项（下标从 0 开始）
      const days = isWeek ? DateUtil.getWeekDay(dateTimeArray[0][indexVal[0]], dateTimeArray[1][indexVal[1]]) : DateUtil.getMonthDay(dateTimeArray[0][indexVal[0]], dateTimeArray[1][indexVal[1]])
    
      dateTime = indexVal;
      dateTimeArray[2] = days

      this.setData({
        dateTime,
        dateTimeArray
      })

      
    },
  }
})

/**
 * index.js
 data:{
    dataStatus: false,//是否显示日期选择控件
    remindTime:null
 }

 //显示日期选择
  showDateModule: function () {
    this.setData({
      dataStatus: true,
    })
  },
  //关闭日期选择
  closeDateModule: function (e) {
    if (e.detail.value){
      remindTime = e.detail.value
    }
    this.setData({
      dataStatus: false,
      remindTime
    })
  },
 * index.html
  <datetime-picker dataStatus='{{dataStatus}}' dateValue="{{parmas.remindTime}}" bindclose='closeDateModule' ></datetime-picker>

 
 */
