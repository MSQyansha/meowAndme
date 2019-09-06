// component/modal_types/index.js
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      modalStatus: Boolean,//是的打开moal
      projects: Object,//内容
      row: String, //几行
      title: String,
      popUpHeight: String,//弹出框的高度

   },

   /**
    * 组件的初始数据
    */
   data: {
      animationData: {}
   },
   /**
    * 组件的方法列表
    */
   methods: {
      //显示对话框
      showModal: function() {
         // 显示遮罩层
         var animation = wx.createAnimation({
            duration: 300,
            timingFunction: "linear",
            delay: 0
         })
         this.animation = animation
         animation.translateY(300).step()
         this.setData({
            animationData: animation.export(),
            showModalStatus: true
         })
         setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
               animationData: animation.export()
            })
         }.bind(this), 200)
      },
      //隐藏对话框
      _hideModal() {
         // 隐藏遮罩层
         var animation = wx.createAnimation({
            duration: 300,
            timingFunction: "linear",
            delay: 0
         })
         this.animation = animation
         animation.translateY(300).step()
         this.setData({
            animationData: animation.export(),
         })
         setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
               animationData: animation.export(),
               modalStatus: false
            })
            let myEventDetail = {} // detail对象，提供给事件监听函数
            let myEventOption = {} // 触发事件的选项
            this.triggerEvent('close', myEventDetail, myEventOption)
         }.bind(this), 200)
      },
      _goto(e) {
         let myEventDetail = {
            id: e.currentTarget.dataset.id
         } // detail对象，提供给事件监听函数
         let myEventOption = {} // 触发事件的选项
         this.triggerEvent('go', myEventDetail, myEventOption)
      }
   }
})

/**
 * 
 * <modal_types
   modalStatus='{{addRecord}}'
   title='选择添加类型' 
   projects='{{projects}}'
   popUpHeight='412'
   row='1'
   bindclose='hideAddRecord' 
   bindgo='gotoAddRecord'></modal_types>
 */