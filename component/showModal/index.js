// component/showModal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openSet: Boolean,
    title: String,
    content: String,
    confrimText: String,
    confrimClass: String,
    titleStyle: String,
    boxStyle: String,
    colseStatus: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
     * 组件的生命周期
     */
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      //  console.log(this.properties)

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
    _cancleSet() {
      let myEventDetail = {} // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      this.triggerEvent('close', myEventDetail, myEventOption)


    },
    _confrimSet(e) {
      let myEventDetail = {
        // unionId: e.detail.unionId
      } // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      this.triggerEvent('confrim', myEventDetail, myEventOption)

    }


  }
})
/**
 *
 *  <showModal
 *    openSet="{{openSet}}"
 *    title='温馨提示'
 *    content='是否删除该条提醒?'
      bindclose='closeOpenSet'
      bindconfrim='deletePlay'
      boxStyle='height:416rpx;text-align: left;' //box的样式
      titleStyle='text-align: left;' title 样式
      colseStatus='{{true}}' //true 隐藏 是否显示取消按钮
      confrimClass='greenBtn' // greenBtn 绿色
      ></showModal>

 */
