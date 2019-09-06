// pages/family/catFamily/index.js
import { get_family_cat_info, get_family_list, drop_out_family, open_or_close_remind, save_fromId} from '../../../utils/config'
import { pageGo, openShare, successShowText, getConstellation} from '../../../utils/util'
const api = require('../../../utils/api.js')
Page({

   /**
    * 页面的初始数据
    */
   data: {
      isHose: false,//是否是主人
      switchStatus:true, //是否开启switch
      require:true,
      remindPrompt: false,//开启提醒提示
      deletePrompt: false,//移出提示
      deleteContent:'',
      remindContent:'',
      role: null, // 当前用户角色权限 1. 猫的主人 2. 猫的管理者
      user_nickname:'',
      familyData:[],
      catInfo:{},
      loading:false,
      reload:false,
      isLoading: false,//是否正在加载 false 可继续请求数据了 true 数据请求中
      loadMoreData: false, //主页是否可以加载更多  false 否 true 是
      loadAll: false,//是否全部加载完毕 false 否 true 是
      page_size: 10,
      page_info: {
         page_size:10,
         current_page:0
      },
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      wx.hideShareMenu();//隐藏转发按钮
      console.log(options,'catfamily-options');
      if (!wx.getStorageSync('union_id')){
         pageGo('/pages/index/index',4)
         return
      }

      let catId = options.catId, nickname = options.nickname;
      this.setData({
         catId,
         nickname,//猫咪昵称
         unionId: wx.getStorageSync('union_id')
      }, () => {
            this.getPageData()
      })
      wx.setNavigationBarTitle({
         title: nickname ? nickname + '的家庭成员' :'猫咪的家庭成员'
      }); 
   },
   onShow:function(){
      // console.log(this.data.reload,'this.data.reload');
      
      if (this.data.reload) {
         this.getPageData()
         this.setData({
            reload: false
         })
      }
   },
   //获取页面数据
   getPageData:function (params) {
      let that =this
      let { unionId, catId, page_size} = that.data
      let p1 = get_family_cat_info(unionId, catId) ;
      let p2 = get_family_list(unionId, catId, { current_page: 0, page_size: page_size });

      Promise.all([p1, p2]).then(([res1, res2])=>{
         if (res1.errcode == 0){
            let data = res1.data
            let year, month, day;
            year = data.cat.year != 0 ? data.cat.year + '岁' : ''
            month = data.cat.month != 0 ? data.cat.month + '个月' : ''
            day = data.cat.day != 0 ? data.cat.day + '天' : ''
            
            that.setData({
               catInfo: {
                  ...data.cat,
                  age : year + month + day,
                  date_of_birth: getConstellation(data.cat.date_of_birth)
               },
               "receive": data.receive, // 是否接受提醒
               "user_nickname": data.user_nickname //"请叫我小稳稳"
            })
         }
         if (res2.errcode==0){
            that.setData({
               familyData:res2.data,
               page_info: res2.page_info
            })
         }

         that.setData({
            loading:true
         })
      })
      
   },
   // 获取猫咪信息
   getFamilyCat:function (params) {
      let self = this
      const { unionId, catId } = self.data
      get_family_cat_info(unionId, catId) .then(res=>{
         if (res.errcode == 0) {
            let data = res.data
            let year, month, day;
            year = data.cat.year != 0 ? data.cat.year + '岁' : ''
            month = data.cat.month != 0 ? data.cat.month + '个月' : ''
            day = data.cat.day != 0 ? data.cat.day + '天' : ''

            this.setData({
               catInfo: {
                  ...data.cat,
                  age: year + month + day,
                  date_of_birth: getConstellation(data.cat.date_of_birth)
               },
               "receive": data.receive, // 是否接受提醒
               "user_nickname": data.user_nickname, //"请叫我小稳稳"
               loading:true

            }, () => {
               // console.log(this.data.catInfo, 'catInfo===');
            })
         }
      })
   },
   // 获取猫咪的家人信息列表
   getFamilyList: function () {
      wx.stopPullDownRefresh()
      let self = this
      const { unionId, catId, page_info, familyData} = self.data
      get_family_list(unionId, catId, { ...page_info}).then(res=>{
         
         if (res.errcode == 0 && res.data.length > 0){
            //判断是否全部加载完毕
            let loadingAll = true
            if (res.data.length < res.page_info.total_count) { //有数据
               loadingAll = false
            }
            self.setData({
               loadAll: loadingAll,
               familyData: familyData.concat(res.data),
               page_info: res.page_info
            })
         }
      })
   },
  //  查看亲属详情
  goToDetails:function(e){
     const { catInfo,catId,nickname} =this.data
     let item = e.currentTarget.dataset.item
     if (catInfo.role == 1 && item.role != 1){
        let id = item.id,
           user_name = item.nickname,
           role = item.role;
        pageGo(`/pages/family/familyDetails/index?id=${id}&user_name=${user_name}&role=${role}&catId=${catId}&cat_name=${nickname}`, 1)
     }else{
        return
     }
    
  },
   
   // 移出提示modal beigin
   showDeleteModal: function (e) {
      this.setData({
         deletePrompt: true,
         deleteContent: `真的要退出${this.data.nickname}的家庭吗？`,
      })
   },
   hideDeleteModal:function (params) {
      this.setData({
         deletePrompt:false,
         deleteContent:''
      })
   },
   //确定移出
   deleteConfrim:function () {
      let { unionId,catId} = this.data
      drop_out_family(unionId, catId).then(res => {
         if (res.errcode == 0) {
            successShowText('已退出')
            setTimeout(() => {
               let pages = getCurrentPages();
               let prevPage = pages[pages.length - 2];  //上一个页面

               //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
               prevPage.setData({
                  reload: true,
                  homeReload: true
               }, () => {
                  wx.navigateBack({
                     delta: 1
                  })
               })
            }, 500);

         } else {
            successShowText('退出失败')
         }
      })
      this.hideDeleteModal()
   },
   // 移出提示modal end
   // 关闭提醒提示modal
   showRemindModal:function (params) {
      this.setData({
         remindPrompt: true
      })
   },
   closeRemindModal: function (params) {
      this.setData({
         remindPrompt: false
      })
   },
   tabSwitch:function (e) {
      const id = e.currentTarget.id;
      const new_switch = e.detail.switch; //true 开启提醒 false 关闭提醒

      const { unionId, catId,nickname} =this.data
      this.setData({
        remindContent: new_switch ? `提醒已开启，"${nickname}"的相关提醒会通过公众号发送给你，请关注「猫咪和我」公众号。` : `提醒已关闭，您将不会收到"${nickname}"的相关提醒。`
      })
      // 请求开启关闭提醒接口 true: 接收 false: 拒收
      open_or_close_remind(unionId, catId, { "switch": new_switch}).then(res=>{
         if(res.errcode==0){
            this.showRemindModal()
            wx.setStorageSync('remind_switch', true)

            this.setData({
               receive: new_switch
            })
         }
     
      })
      
   },
   //获取formId
   userSubmit: function (e) {
      let data = {
         "appid": api.APP_ID,
         "form_id": e.detail.formId
      }

      save_fromId(data, this.data.unionId).then(res => {
         console.log('save_fromId', res.data)
      })
   },
   /**
   * 页面上拉触底事件的处理函数
   */
   onReachBottom: function () {
      let { page_info, isLoading } = this.data

      if (page_info) {
         if (page_info.current_page == (page_info.total_page - 1)) {
            console.log('最后一页');
            this.setData({
               loadMoreData: false,
               loadAll: true
            })

         } else {
            if (isLoading) return
            console.log('分页加载');
            page_info.current_page = page_info.current_page + 1
            this.setData({
               page_info,
               loadMoreData: true
            })

            this.getFamilyList();
         }
      }

   },
   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function (e) {
      const { catId, nickname, user_nickname,unionId} =this.data
      if (!unionId) return
      if (e.from == "button"){
         let title = user_nickname + '邀请你成为' + nickname + '的家人，共同记录' + nickname + '成长',
          path = `/pages/family/invitePage/index?catId=${catId}&sharingUserId=${unionId}`;
         return openShare(title, path)
      }
   },
   
})