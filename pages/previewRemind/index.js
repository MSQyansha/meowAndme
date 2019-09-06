// pages/addRemind/index.js
import {  get_cat_list,get_edit_projects_details} from '../../utils/config'
import { pageGo } from '../../utils/util.js'
const EditMap = require('../../utils/editMaputil')
const utilStorage = require('../../utils/storage.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasCatInfo:true,
    isCustomize:false,
    interval:'',
    parmas:{},
    loading:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'addRemind');

    //该页面只做回显

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
    let that = this
    let unionId = e.detail.unionId
    get_cat_list({ current_page: 0, page_size: 6 }, unionId).then(res => {
      if (res.errcode == 0 && res.data.length > 0) {
        utilStorage.put('catInfo', res.data, 1800) //30分钟过期
        that.setData({
          hasCatInfo: true,
        }, () => {
            that.editDetails(unionId)
        })
      } else {
        that.setData({ hasCatInfo: false, loading: true })
      }
    })
  },
  editDetails: function (unionId) {
    let self = this
    let { catId, scheduleId } = self.data
    get_edit_projects_details(catId, scheduleId, unionId).then(res=>{
      if (res.errcode == 0) {
        let data = res.data
        let projectId = data.project_id
        wx.setNavigationBarTitle({
          title: projectId != 0 ? EditMap.remindTypes[Number(projectId)] : '自定义'
        });
        self.setData({
          parmas :data,
          interval: data.period>=0 ? EditMap.intervalArray.indexOf(data.period) : null,
          loading: true,
          isCustomize: projectId == 0,
        })

      }
    })
  },
  //转为记录
  goEditRecord: function (e) {
    let { parmas, catId, scheduleId}= this.data
    pageGo(`/pages/addRecord/index?catId=${catId}&recordtype=${parmas.record_type}&time=${parmas.start_time}&scheduleId=${scheduleId}&projectId=${parmas.project_id}&nickname=${parmas.nickname}`, 1)
  },
})