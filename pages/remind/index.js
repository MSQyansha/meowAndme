//index.js
//获取应用实例
import { pageGo, getConstellation} from '../../utils/util'
const Config = require('../../utils/config')
const EditMap = require('../../utils/editMaputil')
const app = getApp()
const api=require('../../utils/api.js')
const utilStorage = require('../../utils/storage.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remindStatus:false,
    isIphoneX: app.globalData.systemInfo.model.slice(0, 8) == "iPhone X" ? true : false,
    tabbar: {},
    status:2,//0: 没有猫咪 1:没有提醒计划  2 有猫咪有计划
    addpaly:false,//是否显示添加类型 
    projects: [], //类型列表
    remindList:[
      // {
      //   "id": "23f2650f-fd52-4c68-9092-52be71564b55",
      //   "project_id": 1,
      //   "title": "测量体重",
      //   "period": 7,
      //   "start_time": "2019-07-25 12:03:00",
      //   "nickname": "小白鞋啊",
      //   "week": 1,
      //   "week_day": 4,
      //   "remain_day": 1,
      //   "type": 1 // 1. 近两周内, week及week_day字段有效 2. 两周后, remain_day字段有效

      // },

    ],
    page_info:{},
    loading:false,//页面是否加载完毕
    isLoading: false,//是否正在加载 false 可继续请求数据了 true 数据请求中
    loadMoreData: false, //主页是否可以加载更多  false 否 true 是
    loadAll: false ,//是否全部加载完毕 false 否 true 是
    page_size:10,
    isFollow: false,//是否展示关注公众号引导 // true. 展示 false 不展示
    windowHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProjects();
    this.handleShow('onLoad')
  },
 
  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    wx.stopPullDownRefresh()

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }

    //已经授权的判断是否有猫咪信息
    console.log('onShow', this.data.remindStatus, wx.getStorageSync('remind_switch'))
    if (this.data.remindStatus || wx.getStorageSync('remind_switch')) {
      this.handleShow()
    }else{

      let remind_list = utilStorage.get('remind_list'),
        remind_page = utilStorage.get('remind_page');

      if (remind_list && remind_page) {
        console.log('has store');
        this.setData({
          remindList: remind_list,
          page_info: remind_page
        })
      }else{
        console.log('not has store');
        this.handleShow()
      }
    }

  },
  handleShow: function (options) {
    /** 
         * 1 判断是否有猫咪信息
         * 2 判断是否有提醒计划
        */
    if (options !='onLoad'){
      this.setData({
        loadMoreData: false,
        loading: false,
        loadAll: false,
        addpaly: false,
        remindStatus: false,
        remindList: [],
        page_info: {}
      })
    }

    if (wx.getStorageSync('remind_switch')){
      wx.removeStorageSync('remind_switch')
    }
   
    let unionId = wx.getStorageSync('union_id')
    if (unionId && unionId != 'null') {
      this.getInitData({ detail: { unionId: unionId } })
    } else {
      this.setData({ status:0,  loading: true })
    }
  },
  //授权 判断是否有猫咪信息 如果有 正常流程 如果没有 跳转到添加页面
  goToAdd: function (e) {
    if (this.data.status==0) {
      let unionId = e.detail.unionId
      Config.get_cat_list({ current_page: 0, page_size:1 }, unionId).then(res => {
        if (res.errcode == 0 && res.data.length > 0) {//有
          this.handleShow()
        } else {
          pageGo(`/pages/addCat/index?first=true`, 1)
        }
      })
    }
  },
  //授权成功之后 判断是否有猫咪信息 
  getInitData: function (e){
    let self = this;
    let unionId = e.detail.unionId
    self.setData({ unionId })
   
    Config.get_cat_list({ current_page: 0, page_size: 6 }, unionId).then(res => {
      if (res.errcode == 0 && res.data.length > 0) {
         // 判断是否是多只猫咪 
         
         this.setData({
            catId: res.data.length==1? res.data[0].id:null
         })
         let catInfo = utilStorage.get('catInfo')
         if (!catInfo){
            let data = res.data
            let newData = data.map(item => {
               let year, month, day;
               year = item.year != 0 ? item.year + '岁' : ''
               month = item.month != 0 ? item.month + '个月' : ''
               day = item.day != 0 ? item.day + '天' : ''
               return {
                  ...item,
                  date_of_birth: getConstellation(item.date_of_birth),
                  age: year + month + day,
               }
            })
            utilStorage.put('catInfo', newData, 300) //存储猫咪信息 5分钟过期
         }
        self.getRemindList(self.data.page_size) //获取列表
        self.isFollowPublic() //判断是否关注公众号
      } else {
        utilStorage.remove('catInfo')
        utilStorage.remove('remind_list')
        utilStorage.remove('remind_page')
        self.setData({ //没有猫咪信息
          status: 0,
          loading: true
        })
      }
    })
  },
  /**获取提醒项目列表 */
  getProjects:function () {
    Config.get_projects_list().then(res=>{
      if (res.errcode==0){
        this.setData({
          projects:res.data
        })
      }
    })
  },
  //是否展示提醒观众号内容
  isFollowPublic:function(){
    //true. 展示 false 不展示
    Config.is_follow_public(this.data.unionId).then(res => {
      if (res.errcode == 0) {
        this.setData({
          isFollow: res.data
        })
      }
    })

  },
  //获取提醒列表
  getRemindList: function (page_size) {
    wx.stopPullDownRefresh()
    let self = this
    // id,  current_page, page_size
    const { page_info, remindList } = self.data

    self.setData({ isLoading: true })

    let parmas = {
      current_page: 0,
      page_size: page_size,
    }
    if (page_size) {//初始化
      parmas.page_size = page_size
    } else {//获取更多
      parmas.current_page = page_info.current_page
      parmas.page_size = page_info.page_size
    }

    Config.get_remind_list(parmas, this.data.unionId).then(res=>{
      let data = res.data
      if (res.errcode == 0 && data.length>0){
        //判断是否全部加载完毕
        let loadingAll = true
        if (data.length < res.page_info.total_count) { //有数据
          loadingAll = false
        } 
        
        self.setData({
          loadAll: loadingAll
        })
        
        let newData = data.map(item => {
          return {
            ...item,
            period: EditMap.intervalMap.find(v => v.status == item.period).name
          }
        })
        // type 1 两周计划  type 2 后续计划
        self.setData({
          remindList: page_size ? newData : remindList.concat(newData),
          page_info: res.page_info,
          status: 2,
          isLoading:false,
          loading: true
        },()=>{

          utilStorage.put('remind_list', self.data.remindList, 60) //1分钟过期
          utilStorage.put('remind_page', res.page_info, 60) //1分钟过期

        })
      }else{
        self.setData({ status: 1, loading: true})
      }
    })
    
  },
  // 编辑
  gotoEditPlay:function (e) {
    let catId = e.currentTarget.dataset.catid,
      scheduleId = e.currentTarget.dataset.scheduleid,
      projectId = e.currentTarget.dataset.projectid

    pageGo(`/pages/addRemind/index?catId=${catId}&projectId=${projectId}&scheduleId=${scheduleId}`, 1)
    this.hideAddpaly()
  },
  showAddpaly:function (params) {
    this.setData({
      addpaly:true
    })
    
  },

  hideAddpaly: function () {
    this.setData({
      addpaly: false
    })
  },

  /**新增 */
  gotoaddRemind:function (e) {
      const { catId } = this.data
      let id = e.detail.id;
      //区分是一只猫咪还是多只猫咪。一只猫咪时要带catId值
      pageGo(catId ? `/pages/addRemind/index?catId=${catId}&projectId=${id}` : `/pages/addRemind/index?projectId=${id}`, 1)

      this.hideAddpaly()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {    
    let { page_info, isLoading} = this.data

    if (page_info){
      if (page_info.current_page == (page_info.total_page - 1)) {
        this.setData({
          loadMoreData: false,
          loadAll: true
        })

      } else {
        if (isLoading) return
        page_info.current_page = page_info.current_page + 1
        this.setData({
          page_info,
          loadMoreData: true
        })

        this.getRemindList();
      }
    }
    
  },
  //获取formId
  userSubmit:function(e){
    let data = {
      "appid": api.APP_ID,
      "form_id": e.detail.formId
    }

    Config.save_fromId(data,this.data.unionId).then(res=>{
      console.log('save_fromId',res.data)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },  
})


