const app = getApp();
const appname = app.globalData.userInfo.appname;
const baseUrl = app.globalData.baseUrl;


Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    baseUrl:baseUrl,
    appname:appname
  },
  onLoad: function () { },
  pageBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
