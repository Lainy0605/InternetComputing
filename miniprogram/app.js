// app.js
import regeneratorUntime from './utils/runtime'
App({
  onLaunch: function () {
    this.globalData = {
      habits:[],
      openId:"",
      userInfo:{}
    };
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-6guoviflb21d1dda',
        traceUser: true,
      });
    }

    // const that = this
    // wx.cloud.callFunction({
    //   name:"getOpenId",
    //   success(res){
    //     that.globalData.openId = res.result.openid
    //     wx.setStorageSync('openId', res.result.openid)
    //   },
    // })
  },

  // onLoad:function(){
  //   const that = this
  //   wx.getUserProfile({
  //     desc: '获取信息',
  //     success(res){
  //       console.log(1111)
  //         that.globalData.userInfo = res.userInfo
  //         console.log(res.userInfo)
  //         wx.setStorageSync('userInfo', res.userInfo)
  //     },
  //     fail(err){
  //       console.log(err)
  //     }
  //   })
  //   wx.cloud.callFunction({
  //       name:"getOpenId",
  //       success(res){
  //           that.globalData.openId = res.result.openid
  //           wx.setStorageSync('openId', res.result.openid)
  //       },
  //       fail(err){
  //         console.log(err)
  //       }
  //   })
  // }
});
