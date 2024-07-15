const app = getApp();
const baseUrl = app.globalData.baseUrl;
const appname = app.globalData.userInfo.appname;

Page({
  data: {
    PageCur: 'welcome',
    baseUrl: baseUrl,
    appname: appname
  },
  onLoad: function (options) {
    console.log('app.globalData.userInfo',app.globalData.userInfo);
    if (options.reLaunchComponent) {
      this.setData({
        PageCur: options.reLaunchComponent,
      });
    }

    if (!app.globalData.userInfo) {
      // 使用回调函数设置全局数据
      app.callback = (res) => {
        app.globalData = res;
        this.setData({
          callback: res,
        });
      }
    }
  },
  onShow: function () {
    // 如果有需要在页面展示时执行的逻辑，可以在这里处理
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: appname,
      imageUrl: baseUrl + '/uploads/app/share.jpg',
      path: '/pages/index/index'
    }
  },
});
