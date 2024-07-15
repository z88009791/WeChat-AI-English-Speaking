const app = getApp();
const baseUrl = app.globalData.baseUrl;
let userInfo = app.globalData.userInfo; // 用户信息  
const englishLevelsInfo = app.globalData.englishLevelsInfo; // 英语水平

Page({
  data: {
    userInfo: userInfo,
    englishLevelsInfo:  app.globalData.englishLevelsInfo
  },

  onLoad: function (options) {
    
    let role_id = options.role_id;
    let index = options.index;
    let english_levels_id = app.globalData.userInfo.english_levels_id;
    
    this.setData({
      englishLevelsInfo:  app.globalData.englishLevelsInfo,
      role_id: role_id,
      index: index,
      english_levels_id: english_levels_id
    });
  },

  formSubmit: function (data) {
    var level_idValue = parseInt(data.detail.value.level_id);
    var role_id = this.data.role_id;
    var index = this.data.index;
   
    var WXuserInfoToUpdate = {
      role_id: role_id,
      english_levels_id: level_idValue
    };

    wx.showLoading({
      title: "更新中...",
    });

    wx.request({
      url: baseUrl + "/api/user/WXupdate",
      method: "POST",
      data: {
        token: app.globalData.userInfo.token,
        WXuserInfoToUpdate: WXuserInfoToUpdate,
        userInfo: app.globalData.userInfo,
      },

      success: function (res) {
        wx.hideLoading();
        if (res.data.code === 1) {
          // 更新全局变量和本地缓存
          userInfo.role_id = role_id;
          userInfo.role_index = index;
          userInfo.english_levels_id = level_idValue;
          app.globalData.userInfo = userInfo;
          wx.setStorageSync("userInfo", userInfo);

          wx.showToast({
            title: "更新成功",
            icon: "success",
            duration: 2000,
            complete: function () {
              wx.navigateTo({
                url: '/pages/index/index'
              });
            },
          });
        } else {
          wx.showToast({
            title: "更新失败，请重试",
            icon: "none",
            duration: 2000,
          });
        }
      },
      fail: function (error) {
        wx.hideLoading();
        wx.showToast({
          title: "更新用户信息失败，请重试",
          icon: "none",
          duration: 2000,
        });
      },
    });
  },

  // 其他生命周期函数和事件处理函数...
});
