// pages/public/index.js
import { get_cat_list, get_edit_projects_details } from '../../utils/config'
import {  formatTime } from '../../utils/util.js'
const EditMap = require('../../utils/editMaputil')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasCatInfo: false,
    parmas:{
      title:"体内驱虫",
      start_time: "2019-08-11 16:30:00".slice(0, -3),
      period: EditMap.intervalArray.indexOf(90),
      now_time: formatTime(new Date(),'MD')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'options-public')
    let that = this;
    let catId = options.catId,
      scheduleId = options.scheduleId //schedules id值
    this.setData({
      catId,
      scheduleId,
    })

    let unionId = wx.getStorageSync('union_id')
    if (unionId && unionId != 'null') {//有unionid 
      that.getCatInfo({ detail: { unionId: unionId } })
    } else {
      that.setData({ hasCatInfo: false, loading: true })
    }
  },
  //获取猫咪信息
  getCatInfo: function (e) {
    console.log('getCatInfo', e.detail.unionId)
    let that = this
    let unionId = e.detail.unionId
    get_cat_list({ current_page: 0, page_size: 1 }, unionId).then(res => {
      if (res.errcode == 0 && res.data.length > 0) {
        that.setData({
          hasCatInfo: true,
        })
      } else {
        that.setData({ hasCatInfo: false, loading: true })
      }
    })
  },
  editDetails: function (unionId) {
    let self = this
    let { catId, scheduleId } = self.data
    get_edit_projects_details(catId, scheduleId, unionId).then(res => {
      if (res.errcode == 0) {
        let data = res.data

        self.setData({
          parmas: {
            now_time: formatTime(new Date(),'MD'),
            "project_id": data.project_id, //对应的project id
            "title": data.title,
            "period": EditMap.intervalArray.indexOf(data.period), //单位为 (天) 365
            "start_time": data.start_time.slice(0,-3),
          },
          loading: true,
        })
      }
    })
  },
})