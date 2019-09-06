// pages/family/catList/index.js
import { pageGo, openShare, successShowText} from '../../../utils/util'
import { get_cat_familys, delete_cat} from '../../../utils/config'

Page({

   /**
    * 页面的初始数据
    */
   data: {
      loading:false,
      dataList:[],
      reload: false,//其他页面返回到该页面时是否重新加载 
      homeReload:false,//首页是否重新加载
      deletePage:0,//0 第一次提示 1 第二次提示
      deletePrompt:false,
      deleteContent:''
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      console.log('onLoad');
      
      let union_id = wx.getStorageSync('union_id')
      if (!union_id) {
         pageGo('/pages/index/index', 4)
         return
      }else{
         this.setData({
            unionId: union_id
         }, () => this.getCatFamilys())
      }
      
   },
   onShow:function () {
      // console.log(this.data.reload,'reload');
      if (this.data.reload) {
         this.getCatFamilys()
         this.setData({reload: false})
      }
      
   },
   onUnload: function () {
      // console.log('onUnload homeReload', this.data.homeReload);
      if (this.data.homeReload){
         let pages =  getCurrentPages();
         let prevPage = pages[pages.length - 2];  //上一个页面
         prevPage.setData({
            showStatus:true
         })
         this.setData({
            homeReload:false
         })
      }
   },
   getCatFamilys:function () {
      const { unionId} =this.data
      get_cat_familys(unionId).then(res=>{
         if(res.errcode==0){
            this.setData({
               dataList:res.data,
               loading:true
            })
         }
      })
   },
   //去编辑猫咪信息
   goToEdit: function (e) {
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index ;
      pageGo(`/pages/addCat/index?id=${id}&current_index=${index}`, 1)
   },
   //查看猫咪的家庭
   goCatFamily:function(e){
      let catId = e.currentTarget.dataset.id ,
         nickname = e.currentTarget.dataset.nickname;
      pageGo(`/pages/family/catFamily/index?catId=${catId}&nickname=${nickname}`, 1)

   },
  //  删除猫咪
  deleteCat:function(e){
     const nickname =  e.currentTarget.dataset.nickname
     this.setData({
        catId: e.currentTarget.dataset.id,
        nickname: nickname,
        deletePrompt: true,
        deletePage:0,
        deleteContent: `是否删除"${nickname}"的猫咪档案`
     })
  },

   hideDeleteModal:function () {
      this.setData({
         deletePrompt: false,
         deletePage: 0,
         deleteContent: ''
      })
   },
   deleteConfrim:function () {
      let { deletePage, catId, unionId,dataList} =this.data
      
      if (deletePage==0){
         this.setData({
            deletePrompt: true,
            deletePage: 1,
            deleteContent: '删除后不可恢复，请再次确定是否真的要删除!'
         })
      }else{
         // console.log('确定删除', unionId, catId, dataList);
         let that = this

         delete_cat(unionId, catId).then(res=>{
            if (res.errcode == 0) {
               successShowText('删除成功')
               setTimeout(() => {
                  let delete_index = dataList.findIndex(v => v.cat_id == catId)
                  dataList.splice(delete_index, 1)
                  that.setData({
                     dataList
                  })
                  // that.getCatFamilys()
                  that.hideDeleteModal()
                  let pages = getCurrentPages();
                  let prevPage = pages[pages.length - 2];  //上一个页面
                  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                  prevPage.setData({
                     showStatus: true
                  })
                  wx.setStorageSync('remind_switch', true)//刷刷新提醒页面
               }, 500);
              
            } else {
               successShowText('删除失败')
               setTimeout(() => {
                  that.hideDeleteModal()
               }, 500);
            }
            
           
         })

        
         
      }
      
   },
   /**
    * 用户点击右上角分享
    */
   // onShareAppMessage: function (e) {
   //    const { unionId, dataList} =this.data
   //    if(!unionId) return
   //    const catId = e.target.dataset.catid
   //    const dataItem = dataList.find(v => v.cat_id == catId) 
   //    if (e.from == "button" ){
   //       let title = dataItem.user_nickname + '邀请你成为' + dataItem.nickname + '的家人，共同记录' + dataItem.nickname + '成长',
   //          path = `/pages/family/invitePage/index?catId=${catId}&sharingUserId=${unionId}`,
   //          imageUrl = '/images/illustrator_4_share.png'
            
   //       return openShare(title, path, imageUrl)
   //    }
   // }
})
