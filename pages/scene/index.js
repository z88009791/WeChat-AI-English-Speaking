const app = getApp();
const baseUrl = app.globalData.baseUrl;
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    scene: "",
    baseUrl: baseUrl,
  },
  lifetimes: {
    created: function () {
      wx.request({
        url: baseUrl + "/api/app/scene",
        method: "GET",
        success: (res) => {
          this.setData({
            scene: res.data.data,
          });
        },
        fail: (err) => {
          console.error(err);
        },
      });
    },
  },
});