App({
  onLaunch: function () {
    this.loadData((globalData) => {
      if (this.callback) {
        this.callback(globalData);
      }
    });
  },

  // 加载数据的方法
  loadData: function (callback) {
    let requestCounter = 3; // 需要完成的请求数

    const checkAllRequestsComplete = () => {
      if (--requestCounter === 0) {
        // 所有请求完成后，更新 globalData 并执行回调
        this.globalData.userInfo = wx.getStorageSync("userInfo");
        this.globalData.roleInfo = wx.getStorageSync("roleInfo");
        this.globalData.englishLevelsInfo = wx.getStorageSync("englishLevelsInfo");
        callback(this.globalData);
      }
    };

    this.wxLogin(checkAllRequestsComplete);
    this.getSystemInfo();
    this.getRoleInfo(checkAllRequestsComplete);
    this.getEenglishLevels(checkAllRequestsComplete);
  },

  // 获取角色信息
  getRoleInfo: function (callback) {
    wx.request({
      url: this.globalData.baseUrl + "/api/app/role", // 角色信息接口地址
      success: (res) => {
        wx.setStorageSync("roleInfo", res.data.data);
        callback();
      },
      fail: (err) => {
        console.error("获取角色信息失败", err);
        callback();
      },
    });
  },

  // 获取英语等级水平
  getEenglishLevels: function (callback) {
    wx.request({
      url: this.globalData.baseUrl + "/api/app/EenglishLevels", // 英语等级水平接口地址
      success: (res) => {
        wx.setStorageSync("englishLevelsInfo", res.data.data);
        callback();
      },
      fail: (err) => {
        console.error("获取英语水平失败", err);
        callback();
      },
    });
  },

  // 微信登录
  wxLogin: function (callback) {
    wx.login({
      success: (res) => {
        const code = res.code;
        this.customLogin(code, callback);
      },
      fail: (err) => {
        console.error("登录失败", err);
        callback();
      },
    });
  },

  // 将 code 发送到服务端处理
  customLogin: function (code, callback) {
    wx.request({
      url: this.globalData.baseUrl + "/api/user/WXlogin", // 服务器端登录接口地址
      method: "POST",
      data: {
        code: code,
        platform: "wechat",
      },
      success: (res) => {
        wx.setStorageSync("userInfo", res.data.data.userinfo);
        this.checkLogin();
        callback();
      },
      fail: (err) => {
        console.error("请求失败", err);
        callback();
      },
    });
  },

  // 检查登录状态
  checkLogin: function () {
    var userInfo = this.globalData.userInfo;
    if (userInfo && this.globalData.userInfo.auth === "0") {
      // 用户未授权，跳转到授权页面
    }
  },

  // 获取系统信息
  getSystemInfo: function () {
    wx.getSystemInfo({
      success: (e) => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      },
    });
  },

  globalData: {
    baseUrl: "https://i.ifruitlet.cn",
    userInfo: wx.getStorageSync("userInfo"),
    roleInfo: wx.getStorageSync("roleInfo"),
    englishLevelsInfo: wx.getStorageSync("englishLevelsInfo"),
  },
});
