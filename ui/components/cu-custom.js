const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    }, 
    isCustom: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
    reLaunchComponent: {
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      // 获取当前页面栈的长度
      const pages = getCurrentPages();
    
      // 判断 reLaunchComponent 是否存在
      if (this.data.reLaunchComponent) {
        wx.reLaunch({
          url: '/pages/index/index?reLaunchComponent=' + this.data.reLaunchComponent
        });
      } else if (pages.length === 1) {
        // 如果只有一个页面在栈中，说明没有上一页，跳转到首页
        wx.reLaunch({
          url: '/pages/index/index'
        });
      } else {
        // 否则，返回上一页
        wx.navigateBack({
          delta: 1
        });
      }
    },
    
    toHome(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
})
