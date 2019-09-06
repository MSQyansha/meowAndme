// pages/family/invitePage/index.js
import { add_family, invite_detail} from '../../../utils/config.js'
import { pageGo, successShowText} from '../../../utils/util'
Page({

   /**
    * 页面的初始数据
    */
   data: {
      openSet:false,
      modalContent: '',
      inviteData:null,
      type:0,//416的高度
      errcode:0
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
     console.log(options, wx.getStorageSync('union_id'),'invitePage');
      let catId = options.catId, sharingUserId = options.sharingUserId
      this.setData({
         catId,
         sharingUserId
      })
      let params={
         "sharing_user_id": sharingUserId,
         "cat_id": catId
      }
      invite_detail(params).then(res=>{
        if (res.errcode == 0){
          this.setData({
            inviteData: res.data,
          })
        } else if (res.errcode==1009){
          this.setData({
            errcode: res.errcode,
          })
        }    
      })
   },
   nextHandle:function (e) {
      let unionId = wx.getStorageSync('union_id')
      if (unionId && unionId!='null'){
        console.log('邀请 has unionid')
         this.handleReceive({ detail: { unionId: unionId}})
      }else{
        console.log('邀请 not has unionid',e)
         this.handleReceive(e)
      }
   },
   handleReceive: function (e) {
      let unionId = e.detail.unionId;
      let that = this
      const { inviteData, catId, sharingUserId} = that.data
      const params = {
         "sharing_user_id": sharingUserId,
         "cat_id": catId
      }
      add_family(unionId, params).then(res=>{
         if(res.errcode==0){
            successShowText('邀请成功','sucess')
            wx.setStorageSync('current_type', '1');  //存储判断是从接受邀请的页面回到记录页面
            wx.setStorageSync('invitePage', true)
            setTimeout(() => {
              that.handleConfrim()
            }, 1000);
         } else if (res.errcode == 1004) {//1004. 家庭成员数量多于7 1005. 被邀请者猫咪数量多于
            that.setData({
               openSet: true,
              modalContent: `${inviteData.cat_name}的家庭成员已满，无法加入。若需要加入，请关注[猫咪和我]公众号联系客服。`
            })
         } else if (res.errcode == 1005){
            that.setData({
               openSet: true,
              modalContent: `拥有的猫咪数量已满，无法加入。若需要加入，请关注[猫咪和我]公众号联系客服。`
            })
         } else if (res.errcode == 1007){
            that.setData({
               openSet: true,
               type:1,
               modalContent: `您已经是${inviteData.cat_name}的家庭成员啦～`
            })

         } else if (res.errcode == 1009) {//1009表示该猫已失效
           that.setData({
             openSet: true,
             type: 1,
             modalContent: '这只猫咪不见啦，加入家庭失败!'
           })

         } else {
            successShowText('接受邀请失败')
         }

      }) 
   },
   // 取消
   closeOpenSet:function (params) {
      this.setData({
         openSet: false
      })
   },
   //确定
   handleConfrim:function (params) {
      this.closeOpenSet()
      pageGo('/pages/index/index',4)
   },
})