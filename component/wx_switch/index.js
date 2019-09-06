// component/wx_switch/index.js
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      id:String,
      isOn:Boolean,
      onTintColor:String
   },

   /**
    * 组件的初始数据
    */
   data: {
      isClick:true
   },
   /**
        * 组件的生命周期
        */
   lifetimes: {
      attached: function () {
         // 在组件实例进入页面节点树时执行
         console.log(this.properties.isOn,'ddd')

      },
      detached: function () {
         // 在组件实例被从页面节点树移除时执行
         // console.log( 'detached' )
      },
   },

   /**
    * 组件的方法列表
    */
   methods: {
      _tapSwitch() {
         let myEventDetail = {
            switch: !this.data.isOn
         }// detail对象，提供给事件监听函数
         let myEventOption = {} // 触发事件的选项
         this.triggerEvent('switch', myEventDetail, myEventOption)
      }
   }
})
