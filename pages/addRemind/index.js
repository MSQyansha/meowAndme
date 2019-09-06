// pages/addRemind/index.js
import { get_init_projects_details, get_edit_projects_details, add_projects, 
  update_projects, delete_projects, is_follow_public} from '../../utils/config'
import { pageGo, successShowText, date_Time} from '../../utils/util'
const EditMap = require('../../utils/editMaputil')
const app= getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataStatus: false,//是否显示日期选择控件
    verify:false,
    interval:null,//index
    isCustomize:false,
    initData:null,
    parmas:{},
    openSet:false,//是否打开删除modal
    loading:false,
    edit:false,
    isFollow: false,//是否展示关注公众号引导 // true. 展示 false 不展示
    catInfo:[],
    catId:'',
    request: true,
    edit: false,//是否可修改

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'addRemind');
   
  /**
   * catId:"fab8d299-b3d2-4513-960d-d8e9277248ae"
   * projectId:"7"
   */
      
    let projectId = Number(options.projectId), 
      catId = options.catId,  //回显袋id和scheduleId
      scheduleId = options.scheduleId //页面进入类型 通过scheduleId 判断是否是编辑
    this.setData({
      projectId,
      catId,
      scheduleId,
      isCustomize: projectId == 0,
      unionId : wx.getStorageSync('union_id'),
      catInfo: wx.getStorageSync('catInfo'),
    })
    wx.setNavigationBarTitle({
      title: projectId != 0 ? EditMap.remindTypes[Number(projectId)] : '自定义'
    });

    scheduleId ? this.editDetails(catId, scheduleId) : this.initDetails(projectId)
  },

  initDetails: function (projectId) {
    let self = this
    const { catInfo } = self.data
    get_init_projects_details(projectId).then(res => {
      if (res.errcode == 0) {
        let data = res.data
        let intervalArray = EditMap.intervalArray
        self.setData({
          initData: data,
          parmas: {
            "project_id": data.id, //对应的project id
            "title": data.id ==0?'':data.title,
            "period": EditMap.intervalArray[data.default_period], //单位为 (天) 下标
            "start_time": null,
            nickname: catInfo.length == 1 ? catInfo[0].nickname : null
          },
          interval: data.default_period>=0 ? intervalArray.indexOf(intervalArray[data.default_period]) : null,
          loading: true
        }, () => {
          self.verifyParmas()
        })
      }
    })

  },

  editDetails: function (catId, scheduleId) {
    let self = this
    let { unionId} =this.data
    get_edit_projects_details(catId, scheduleId, unionId).then(res=>{
      if (res.errcode == 0) {
        let data = res.data
        let initParmas = {
          "project_id": data.project_id, //对应的project id
          "title": data.title,
          "period": data.period, //单位为 (天) 365
          "start_time": data.start_time.slice(0, -3),
          nickname: data.nickname
        }
        wx.setStorageSync('editRemind', initParmas)

        self.setData({
          initData: data,
          parmas: initParmas,
          interval: data.period>=0 ? EditMap.intervalArray.indexOf(data.period) : null,
          loading: true,
        }, () => {
          self.verifyParmas()
        })
      }
    })
  },
  confrimHandle:function(e) {
    let { catId, parmas, scheduleId, unionId, verify,request} =this.data
    if (!verify) return
    if (!request) return
    this.setData({
      request: false
    })

    parmas.start_time = date_Time(parmas.start_time) 

    if (scheduleId) {
      update_projects(parmas, catId, scheduleId, unionId).then(res => {
        if (res.errcode == 0) {
          successShowText('修改成功', 'none')
          this.isFollowPublic()
        } else {
          successShowText('修改失败', 'none')
        }
        this.setData({
          request: true
        })
      })
    } else {
      add_projects(parmas, catId, unionId).then(res => {
        if (res.errcode == 0) {
          successShowText('添加成功', 'none')
          this.isFollowPublic()

        } else {
          successShowText('添加失败', 'none')
        }
        this.setData({
          request: true
        })
      })
    }
  },

  isFollowPublic: function () {
    //true. 展示 false 不展示
    is_follow_public(this.data.unionId).then(res => {
      if (res.errcode == 0) {
        if (res.data){
          this.setData({
            isFollow: res.data
          })
        }else{
          this.goback()
        }
        
      }
    })

  },
  goback: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      remindStatus: true
    })
    pageGo('/pages/remind/index', 4)
  },

  handleEdit: function () {
    this.setData({
      edit: true
    })
  },
  cancelEdit: function () {
    this.setData({
      edit: false,
      parmas: wx.getStorageSync('editRemind'),
      interval: this.data.initData.period >= 0 ? EditMap.intervalArray.indexOf(this.data.initData.period) : null,
    })
  },
  onUnload: function () {
    wx.removeStorageSync('editRemind');
  },
  //显示日期选择
  showDateModule: function () {
    let { scheduleId, edit } = this.data
    if (scheduleId && !edit) return
    this.setData({
      dataStatus: true,
    })
  },
  //关闭日期选择
  closeDateModule: function (e) {
    let { parmas} =this.data
    if (e.detail.value){
      parmas['start_time'] = e.detail.value
    }
    this.setData({
      dataStatus: false,
      parmas
    },()=>this.verifyParmas())
  },
  changeIpt: function (e) {
    let { parmas} = this.data
    const name = e.currentTarget.dataset.name;
    const value = e.detail.value;
    parmas[name] = value
    this.setData({
      parmas
    }, () => this.verifyParmas())
  },
  bindPickerChange: function (e) {
    let { parmas, interval, catId, catInfo} = this.data
    const name = e.currentTarget.dataset.name;
    const value = e.detail.value

    if (name == 'period'){
      interval = value
      parmas[name] = EditMap.intervalArray[value]
    } else if (name =='nickname'){
      catId = catInfo[value].id
      parmas[name] = catInfo[value].nickname
    }else{
      parmas[name] = value
    }
    this.setData({
      parmas,
      interval,
      catId
    }, () => this.verifyParmas())
  },
  verifyParmas:function () {
    let self = this
    const { isCustomize, parmas } = self.data

    // console.log(parmas, 'parmas');

    let flag = true
    if (isCustomize) {
      if (parmas.title == '' || parmas.title == null || parmas.period == null || parmas.start_time == null || parmas.nickname==null) {
        flag = false
      }
    }else{
      if (parmas.period == null || parmas.start_time == null || parmas.nickname == null) {
        flag = false
      }
    } 
    self.setData({
      verify: flag
    })
    
  },
 
  deletePlay:function (e) {
    let self = this
    let { catId, scheduleId, unionId} = self.data

    delete_projects(catId, scheduleId, unionId).then(res=>{
      if (res.errcode==0){
        self.closeOpenSet()
        self.goback()
      }
    })
  },
  showOpenSet:function () {
    this.setData({
      openSet: true
    })
  },
  closeOpenSet: function () {
    this.setData({
      openSet: false
    })
  },
  showFollow: function () {
    pageGo('/pages/public/index',1)
  },
  closeFollow: function () {
    this.setData({
      isFollow: false
    })
    this.goback()
  }
})