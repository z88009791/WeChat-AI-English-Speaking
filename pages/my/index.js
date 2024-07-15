const app = getApp();

// 确保 app.globalData 存在
if (!app.globalData) {
  app.globalData = {};
}

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    callback: {
      type: Object,
      value: {},
      observer(newVal) {
        if (!app.globalData.baseUrl && newVal.baseUrl) {
          app.globalData = Object.assign({}, app.globalData, newVal);
          this.setData({
            baseUrl: app.globalData.baseUrl,
            userInfo: app.globalData.userInfo,
            appname: app.globalData.userInfo.appname,
            qrcodeUrls: [
              app.globalData.baseUrl + "/uploads/qrcode/1.jpg",
              app.globalData.baseUrl + "/uploads/qrcode/2.jpg",
              app.globalData.baseUrl + "/uploads/qrcode/3.jpg",
              app.globalData.baseUrl + "/uploads/qrcode/4.jpg",
              app.globalData.baseUrl + "/uploads/qrcode/5.jpg",
              app.globalData.baseUrl + "/uploads/qrcode/6.jpg",
            ],
          });
          this.refreshData(); // 确保在数据更新后调用 refreshData
        }
      }
    }
  },
  data: {
    userInfo: {},
    baseUrl: "",
    appname: "",
    modalName: null,
    qrcodeUrls: [],
    vipExpiry: null,
  },
  lifetimes: {
    attached() {
      // 初次渲染时，如果 app.globalData 已经存在，直接使用
      if (app.globalData.baseUrl) {
        this.setData({
          baseUrl: app.globalData.baseUrl,
          userInfo: app.globalData.userInfo,
          appname: app.globalData.userInfo.appname,
          qrcodeUrls: [
            app.globalData.baseUrl + "/uploads/qrcode/1.jpg",
            app.globalData.baseUrl + "/uploads/qrcode/2.jpg",
            app.globalData.baseUrl + "/uploads/qrcode/3.jpg",
            app.globalData.baseUrl + "/uploads/qrcode/4.jpg",
            app.globalData.baseUrl + "/uploads/qrcode/5.jpg",
            app.globalData.baseUrl + "/uploads/qrcode/6.jpg",
          ],
        });
      }
      this.setData({
        vipExpiry: this.isVipExpired(),
      });
    },
  },
  methods: {
    // 判断VIP是否过期
    isVipExpired() {
      const userInfo = this.data.userInfo;
      const currentTimeStamp = Date.now(); // 获取当前时间戳
      const vipExpiryTimeStamp = userInfo.vipExpiry * 1000; // 获取 VIP 到期时间戳
      if (currentTimeStamp > vipExpiryTimeStamp) {
        return false; // 过期
      } else {
        const date = new Date(vipExpiryTimeStamp); // 转换为 Date 对象
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return year + "-" + month + "-" + day;
      }
    },
    handleContact(e) {
      console.log("客服指定的路径", e.detail.path);
      console.log("客服指定的查询参数", e.detail.query);
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target,
      });
    },
    hideModal(e) {
      this.setData({
        modalName: null,
      });
    },
    showQrcode() {
      const baseUrl = this.data.baseUrl;
      let qrcodeId = this.data.userInfo.role_id || 1;
      const current = baseUrl + `/uploads/qrcode/${qrcodeId}.jpg`;

      wx.previewImage({
        urls: this.data.qrcodeUrls,
        current,
      });
    },
    numDH() {
      let i = 0;
      const that = this;
      function numDH() {
        if (i < 20) {
          setTimeout(function () {
            that.setData({
              starCount: i,
              forksCount: i,
              visitTotal: i,
            });
            i++;
            numDH();
          }, 20);
        } else {
          that.setData({
            starCount: that.coutNum(3000),
            forksCount: that.coutNum(484),
            visitTotal: that.coutNum(24000),
          });
          wx.hideLoading();
        }
      }
      numDH();
    },
  },
});
