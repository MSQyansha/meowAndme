// component/getuserinfo/index.js
const app = getApp();
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		// login:Boolean,//判断是登陆授权还是按钮授权 true 登陆授权 false 按钮授权
	},

	/**
	 * 组件的初始数据
	 */
	data: {
    hasUserInfo: false,
    isAuthToast: false
	},
	/**
	 * 组件所在页面的生命周期
	 */
	pageLifetimes: {
		show: function() {
			// 页面被展示
      this.verifyUnionId()
			
		},
		hide: function() {
			// 页面被隐藏
		},
		resize: function(size) {
			// 页面尺寸变化
		}
	},
	/**
	 * 组件的生命周期
	 */
	lifetimes: {
		attached: function() {
			// 在组件实例进入页面节点树时执行
			// console.log('getusetinfo==attached')
      this.verifyUnionId()
		},
		detached: function() {
			// 在组件实例被从页面节点树移除时执行
			// console.log( 'detached' )
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
    verifyUnionId:function(){
      let unionId = wx.getStorageSync('union_id');
      if (unionId && unionId != 'null' && unionId != '') {
        this.setData({
          hasUserInfo: true
        });
      } else {
        this.setData({
          hasUserInfo: false
        });
      }
      console.log('unionid===', this.data.hasUserInfo, unionId);

    },
		//小程序授权 获取用户信息
		_getUserInfo: function(e) {
			console.log(e, 'eee');
			let that = this;
			app.getUserInfoAll(e, res => {
				that.setData({
					hasUserInfo: res.hasUserInfo,
					userInfo: res.userInfo,
					unionId: res.unionId
				});
				console.log(res.unionId, '_getUserInfo');
				this._normalevent(res.unionId);
			});
		},
		_normalevent(unionId) {
			// e.detail.unionId
			let myEventDetail = {
				unionId: unionId
			}; // detail对象，提供给事件监听函数
			let myEventOption = {}; // 触发事件的选项
			this.triggerEvent('nextevent', myEventDetail, myEventOption);
		},
		showAuthToast() {
			this.setData({
				isAuthToast: true
			});
		},
    clearToast() {
      console.log('clearToast==')
      let that = this
      that.setData({
        isAuthToast: false
      })
    }
	}
});
/***
 * nextevent:授权成功时候的操作
 * 方法不需要在 properties中定义
 * nextHandle:function (e) {
      let unionId = wx.getStorageSync('union_id')
      if (unionId && unionId!='null'){
         this.handleReceive({ detail: { unionId: unionId}})
      }else{
         this.handleReceive(e)
      }
   },
*/
