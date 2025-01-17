const app = getApp();
let userInfo = app.globalData.userInfo; // 用户信息
const roleInfo = app.globalData.roleInfo; // 角色信息

Page({
  data: {
    cardCur: 0,
    userInfo: app.globalData.userInfo,
    swiperList: [],
  },

  onLoad: function (options) {
    var role_index = options.role_index;
    var roleInfoCopy = [...roleInfo]; // 复制一份roleInfo

    // 检查是否存在有效的 role_index
    if (
      role_index !== undefined &&
      role_index >= 0 &&
      role_index < roleInfoCopy.length
    ) {
      // 将对应索引的元素移动到数组的第一位
      const selectedRole = roleInfoCopy.splice(role_index, 1)[0];
      roleInfoCopy.unshift(selectedRole);
    }

    this.setData({
      role_index: role_index,
      swiperList: roleInfoCopy,
    });
    
    this.towerSwiper("swiperList");
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value,
    });
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current,
    });
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex =
        parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2));
      list[i].mLeft = i - parseInt(list.length / 2);
    }
    this.setData({
      swiperList: list,
    });
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX,
    });
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction:
        e.touches[0].pageX - this.data.towerStart > 0 ? "right" : "left",
    });
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == "right") {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft;
        list[i - 1].zIndex = list[i].zIndex;
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list,
      });
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft;
        list[i].zIndex = list[i - 1].zIndex;
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list,
      });
    }
  },
});
