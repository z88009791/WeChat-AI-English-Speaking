// 获取小程序实例
const app = getApp();
// 获取全局变量 baseUrl
const baseUrl = app.globalData.baseUrl;
let userInfo = app.globalData.userInfo;
const roleInfo = app.globalData.roleInfo; // 角色信息
// 获取录音管理器
const recorderManager = wx.getRecorderManager();
// 创建音频上下文
const audioContext = wx.createInnerAudioContext();

// 滚动到最后的聊天位置
function scrollToBottom() {
  wx.createSelectorQuery()
    .select("#chat")
    .boundingClientRect(rect => {
      wx.pageScrollTo({
        scrollTop: rect.bottom,
      });
    })
    .exec();
}

Page({
  data: {
    baseUrl: baseUrl,
    typing: true, // 对方正在输入
    userInfo: app.globalData.userInfo, // 用户信息
    is_clock: false, // 是否录音中
    InputBottom: 0, // 输入框距离底部的距离
    chatData: null, // 聊天数据
    role: null, // 用户角色
    timer: null, // 定时器
    currentAudioUrl: "", // 当前播放的音频 URL
    audioPlaying: false, // 是否正在播放音频
    chathistoryData: [], // 聊天历史数据数组【页面显示】
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    milliseconds: 0, // 用于计时
    seconds: 0, // 用于计时
  },

  // 关闭聊天窗口
  closeChat() {
    console.log(this.data.chathistoryData);
    wx.request({
      url: `${baseUrl}/api/app/closeChat`,
      method: "POST",
      data: {
        token: app.globalData.userInfo.token,
        chat_id: this.data.chat_id,
        user_id: app.globalData.userInfo.id,
        chat_history: this.data.chathistoryData
      },
      success: () => {
        wx.navigateBack({ delta: 1 }); // 返回上一页的层数，这里假设是返回上一页
      },
      fail: err => {
        console.error("关闭聊天请求失败", err);
      }
    });
  },

  // 播放音频
  toggleAudio(event) {
    const url = event.currentTarget.dataset.url;
    const index = event.currentTarget.dataset.index;
    let chathistoryData = this.data.chathistoryData;
    chathistoryData[index].unread = false;

    if (url === this.data.currentAudioUrl) {
      if (this.data.audioPlaying) {
        this.setData({ audioPlaying: false });
        this.pauseAudio();
      } else {
        this.setData({ audioPlaying: true });
        this.playAudio();
      }
    } else {
      this.setData({
        currentAudioUrl: url,
        audioPlaying: true,
      });
      this.playAudio(url);
    }

    // 更新按钮的样式类名
    chathistoryData.forEach((item, i) => {
      item.play = i === index ? (this.data.audioPlaying ? "on" : "off") : "off";
    });

    // 更新数据
    this.setData({ chathistoryData });
  },

  // 播放音频
  playAudio(url = this.data.currentAudioUrl) {
    const encodedUrl = encodeURI(url);
    audioContext.src = encodedUrl;
    wx.setInnerAudioOption({
      obeyMuteSwitch: false,
      success: () => audioContext.play(),
      fail: () => audioContext.play(),
    });
    audioContext.onStop(() => this.setData({ audioPlaying: false }));
    audioContext.onPause(() => this.setData({ audioPlaying: false }));
    audioContext.onEnded(() => this.setData({ audioPlaying: false }));
  },

  // 暂停音频
  pauseAudio() {
    audioContext.pause();
  },

  // 转换为文字
  totext(e) {
    const index = e.currentTarget.dataset.index;
    let chathistoryData = this.data.chathistoryData;
    chathistoryData[index].totext = false;
    this.setData({ chathistoryData });
    scrollToBottom();
  },

  // 显示模态框
  showModal(e) {
    const advice = e.currentTarget.dataset.string;
    this.setData({
      advice: advice,
      modalName: e.currentTarget.dataset.target,
    });
  },

  // 隐藏模态框
  hideModal() {
    this.setData({
      modalName: null,
    });
  },

  // 输入框聚焦
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height,
    });
  },

  // 输入框失焦
  InputBlur() {
    this.setData({
      InputBottom: 0,
    });
  },

  // 页面加载
  onLoad(options) {
    this.setData({ loadModal: true });
    wx.request({
      url: `${baseUrl}/api/app/chat`,
      method: "POST",
      data: {
        token: app.globalData.userInfo.token,
        userInfo: app.globalData.userInfo,
        scene_id: options.scene_id,
      },
      success: res => {
        const chatData = res.data.data;
        chatData.talk.totext = true;
        chatData.talk.unread = true;
        chatData.talk.play = "off";
        const chathistoryData = this.data.chathistoryData.concat(chatData.talk);
        this.setData({
          typing: false,
          chat_id: chatData.chat_id,
          chatData: chatData,
          role: chatData.role,
          user: chatData.user,
          scene: chatData.scene,
          chathistoryData: chathistoryData,
          loadModal: false,
        });
        scrollToBottom();
      },
      fail: err => {
        this.setData({ loadModal: false });
        console.error("请求失败", err);
      },
    });

    this.setData({
      timer: setInterval(() => {
        this.setData({
          milliseconds: this.data.milliseconds + 1,
        });
        if (this.data.milliseconds >= 100) {
          this.setData({
            seconds: this.data.seconds + 1,
            milliseconds: 0,
          });
        }
      }, 10),
    });

    audioContext.onStop(() => this.updatePlayState());
    audioContext.onPause(() => this.updatePlayState());
    audioContext.onEnded(() => this.updatePlayState());
  },

  // 页面卸载时清除定时器
  onUnload() {
    clearInterval(this.data.timer);
  },

  // 更新播放状态
  updatePlayState() {
    const index = this.data.chathistoryData.findIndex(item => item.play === "on");
    if (index !== -1) {
      this.setData({
        [`chathistoryData[${index}].play`]: "off",
      });
    }
  },

  // 处理录音开始事件
  handleRecordStart(e) {
    scrollToBottom();
    this.setData({
      is_clock: true,
      startPoint: e.touches[0],
      recording: true,
      seconds: 0,
      milliseconds: 0,
    });

    const options = {
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 24000,
      format: "mp3",
    };

    recorderManager.start(options);

    recorderManager.onStop(res => this.onStop(res));
  },

  // 处理录音停止事件
  handleRecordStop() {
    recorderManager.stop();
    this.setData({
      recording: false,
      cancelrecord: false,
    });
  },

  // 处理成功的返回数据
  handleSuccessResponse(responseData) {
    const lastRecordIndex = this.data.chathistoryData.length - 1;
    const chathistoryData = [...this.data.chathistoryData];
    chathistoryData[lastRecordIndex].content = responseData[0].content;
    chathistoryData[lastRecordIndex].audio = responseData[0].audio;
    this.setData({
      typing: false,
      chathistoryData: chathistoryData.concat(responseData[1]),
    });
  },

  // 处理错误的返回数据
  handleErrorResponse(responseData) {
    const lastRecordIndex = this.data.chathistoryData.length - 1;
    const chathistoryData = [...this.data.chathistoryData];
    chathistoryData[lastRecordIndex].content = responseData.msg.usertalk.content;
    chathistoryData[lastRecordIndex].audio = responseData.msg.usertalk.audio;
    this.setData({
      typing: false,
    });

    wx.showToast({
      title: responseData.msg.msg,
      icon: "error",
      duration: 2000,
    });
  },

  // 监听录音停止事件
  onStop(res) {
    if (res.duration < 1000) {
      wx.showToast({
        title: "时间太短了",
        icon: "error",
        duration: 1000,
      });
    } else {
      const { tempFilePath } = res;
      const tempData = {
        role: "user",
        tempFilePath: tempFilePath,
        duration: (res.duration / 1000).toFixed(1),
        content: "",
        audio: "",
        totext: true,
        unread: true,
        play: "off",
      };
      this.setData({
        typing: true,
        chathistoryData: this.data.chathistoryData.concat(tempData),
      });

      wx.uploadFile({
        url: `${baseUrl}/api/app/talk`,
        filePath: tempFilePath,
        name: "file",
        formData: {
          token: app.globalData.userInfo.token,
          chat_id: this.data.chat_id,
          chathistory: JSON.stringify(this.data.chathistoryData),
        },
        success: event => {
          const responseData = JSON.parse(event.data);
          if (responseData.code === 1) {
            this.handleSuccessResponse(responseData.data); // 修改这里，传递返回的数据
          } else {
            this.handleErrorResponse(responseData);
          }
          scrollToBottom();
        },
        fail: err => {
          console.error("上传录音文件失败", err);
        }
      });
    }
  },
});
