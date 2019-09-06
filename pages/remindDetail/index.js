// pages/remindDetail/index.js
import { pageGo} from '../../utils/util'
import { get_remind_list_detail, delete_projects} from '../../utils/config.js'
const EditMap = require('../../utils/editMaputil')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openSet:false,
    firstList:{},
    dataList:[
      // {
      //   "record_time": "",
      //   "status": 1, // 0. 不展示按钮 1. 展示转为记录按钮
      //   "record_type": 1 // 1. 测量体重 2. 驱虫 3. 打疫苗
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'options-detail')
    let catId = options.catId, projectId = Number(options.projectId), scheduleId = options.scheduleId;
    this.setData({
      catId,
      projectId,
      // scheduleId: '00183ced-e92d-4ff3-a7b7-1c09b26ca666',
      scheduleId,
      unionId: wx.getStorageSync('union_id')
    },()=>{
      this.get_remind_detail()
    })
    wx.setNavigationBarTitle({
      title: projectId != 0 ? EditMap.remindTypes[projectId] : '自定义'
    });
  },
  get_remind_detail:function(){
    let { scheduleId, catId, unionId} =this.data
    get_remind_list_detail(scheduleId, catId, unionId).then(res=>{
      if (res.errcode == 0) {
        this.setData({
          firstList: res.data[0],
          dataList:res.data.slice(1)
        })
      }
    })
  },
  //转为记录
  goEditRecord:function (e) {
    // data - time='{{item.record_time}}'
    // data - recordtype='{{item.record_type}}'
    // data - scheduleid='{{item.schedule_id}}'
    // data - projectid='{{item.project_id}}'
    let catId = this.data.catId,
      time = e.currentTarget.dataset.time,
      scheduleid = e.currentTarget.dataset.scheduleid,
      projectid = e.currentTarget.dataset.projectid,
      eventid = e.currentTarget.dataset.eventid,
      recordtype = e.currentTarget.dataset.recordtype;
    pageGo(`/pages/addRecord/index?catId=${catId}&recordtype=${recordtype}
    &time=${time}&scheduleId=${scheduleid}&projectId=${projectid}&eventId=${eventid}`, 1)
    
  },
  
  showOpenSet: function () {
    this.setData({
      openSet: true,
    })
  },
  closeOpenSet: function (params) {
    this.setData({
      openSet: false
    })
  },
  deleteRecord: function () {
    let self = this
    let { catId, scheduleId, unionId} = self.data
    delete_projects(catId, scheduleId, unionId).then(res => {
      if (res.errcode == 0) {
        self.closeOpenSet()
        pageGo('/pages/remind/index', 4)
      }
    })
  },

})