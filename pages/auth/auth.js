const app = getApp();
const baseUrl = app.globalData.baseUrl;

Page({
 

  onLoad: function (options) {
    this.setData({
      reLaunchComponent:options.reLaunchComponent,
      userInfo: app.globalData.userInfo
    });
  },

  // 获取用户头像
  bindchooseavatar(e) {
    this.setData({
      avatarUrl: e.detail.avatarUrl
    });

  },

  // 点击保存按钮时触发的事件处理函数
  formSubmit: function (data) {
    var nicknameValue = data.detail.value.nickname; // 获取输入框中的昵称值

    // 校验昵称是否为空或不符合要求
    if (!nicknameValue || nicknameValue === 'X' || !this.isEnglishName(nicknameValue)) {
      wx.showToast({
        title: "昵称应为英文名，请重新输入",
        icon: "none",
      });
      return; // 终止函数执行
    }

    // 更新页面的昵称值
    this.setData({
      nicknameValue: nicknameValue,
    });

    // 执行将用户信息更新到服务器的操作
    this.updateUserInfoToServer();
  },

  // 判断是否为英文名的函数
  isEnglishName: function (name) {
    return /^[a-zA-Z\s]+$/.test(name);
  },

  // 将用户信息更新到服务器的函数
  updateUserInfoToServer: function () {


    var userInfoToUpdate = {
      nickname: this.data.nicknameValue,
    };

    // 如果有头像地址，则进行头像上传
    if (this.data.avatarUrl) {

      wx.uploadFile({
        url: baseUrl + '/api/app/WXuploadAvatar',
        filePath: this.data.avatarUrl,
        name: 'avatar',
        formData: {
          token: this.data.userInfo.token,
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data);

            // 检查并处理头像链接
            var avatarUrl = this.checkUrl(data.data);
            // 处理上传成功的逻辑，例如更新全局变量、提示用户等
            wx.showToast({
              title: "头像上传成功",
              icon: "success",
            });

            // 将上传成功后的头像地址保存
            app.globalData.userInfo.avatar = avatarUrl;
            userInfoToUpdate.avatar = avatarUrl;
            // 完成上传后继续更新用户信息
            this.updateUserInfoToServerAfterUpload(userInfoToUpdate);


          } catch (error) {
            console.error('JSON 解析失败', error);
            wx.showToast({
              title: "上传失败，请重试",
              icon: "none",
            });
          }
        },
        fail: (error) => {
          console.error('上传失败', error);
          wx.showToast({
            title: "上传失败，请重试",
            icon: "none",
          });
        }
      });

      return;
    }

    // 如果没有头像地址，直接更新用户信息到服务器
    this.updateUserInfoToServerAfterUpload(userInfoToUpdate);
  },

  // 上传头像后继续更新用户信息到服务器
  updateUserInfoToServerAfterUpload: function (userInfoToUpdate) {
    wx.showLoading({
      title: "更新中...",
    });

    wx.request({
      url: baseUrl + "/api/user/WXupdate",
      method: "POST",
      data: {
        userInfoToUpdate: userInfoToUpdate,
        WXuserInfoToUpdate: { auth: 1 }, // 示例中的额外数据
        userInfo: app.globalData.userInfo,
      },
      success: (res) => {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: "更新成功",
          icon: "success",
          duration: 2000,
          complete: () => {
            // 更新全局 userInfo，并返回上一页或首页
            app.globalData.userInfo.nickname = this.data.nicknameValue;
            app.globalData.userInfo.auth = 1;

            // 判断是否有上一页，如果没有则返回首页
            if (getCurrentPages().length === 1) {
              wx.reLaunch({
                url: '/pages/index/index',
              });
            } else {
              wx.navigateBack({
                delta: 1
              });
            }
          },
        });
      },
      fail: (error) => {
        wx.hideLoading();
        wx.showToast({
          title: "更新用户信息失败，请重试",
          icon: "none",
        });
      },
    });
  },


  // 检查并处理链接
  checkUrl(url) {
    // 正则表达式匹配是否包含域名
    const hasDomain = /^(http:\/\/|https:\/\/|\/\/)/.test(url);

    // 如果不含域名，则添加 baseUrl
    if (!hasDomain) {
      return baseUrl + '/' + url;
    }

    return url;
  },

});
