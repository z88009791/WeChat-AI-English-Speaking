const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    callback: {
      type: Object,
      value: {},
      observer(newVal) {
        // 当 properties 数据变化时，更新 app.globalData
        if (typeof newVal === 'object' && newVal !== null) { // 检查 newVal 是否为对象类型且不为 null
          app.globalData = newVal;
          this.setData({
            baseUrl: app.globalData.baseUrl,
            userInfo: app.globalData.userInfo,
            roleInfo: app.globalData.roleInfo,
          });
          this.refreshData(); // 确保在数据更新后调用 refreshData
        } else {
          // 如果收到了非对象类型的值，则将 callback 设置为 null
          this.setData({
            callback: null
          });
        }
      }
    }
  },
  data: {
    baseUrl: "",
    userInfo: {},
    roleInfo: [],
    myroleInfo: {}
  },
  lifetimes: {
    attached() {
      // 初次渲染时，调用 refreshData
      if (Object.keys(app.globalData.userInfo).length > 0) {
        this.setData({
          baseUrl: app.globalData.baseUrl,
          userInfo: app.globalData.userInfo,
          roleInfo: app.globalData.roleInfo,
        });
        this.refreshData();
        
      }
    },
  },
  methods: {
    refreshData() {
      const userInfo = app.globalData.userInfo;
      const roleInfo = app.globalData.roleInfo;
      const role_index = app.globalData.userInfo.role_index;

      if (app.globalData.userInfo && role_index !== undefined) {
        this.setData({
          myroleInfo: roleInfo[role_index],
          role_index:role_index
        });
      } else if (app.globalData.userInfo && app.globalData.userInfo.role_id) {
        const index = app.globalData.roleInfo.findIndex(
          (item) => item.id === app.globalData.userInfo.role_id
        );
        if (index !== -1) {
          app.globalData.userInfo.role_index = index;
          this.setData({
            role_index:index,
            myroleInfo: app.globalData.roleInfo[index],
          });
        }
      } else {
        this.setData({
          role_index:0,
          myroleInfo: roleInfo[0],
        });
      }
    },
  },
});
