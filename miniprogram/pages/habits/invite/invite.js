// pages/habits/invite/invite.js
// 邀请界面，向好友发送习惯组队邀请所展示的界面，数据包括习惯的id，要求打开该页面能够获取用户星系，并成功添加该习惯
var app = getApp()
import {
  DakaMinusOne, formatTime
} from "../../../utils/utils"
const HABITS = wx.cloud.database().collection('habits')
const GROUPHABITS = wx.cloud.database().collection('groupHabits')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupHabitId: "",
    userInfo: {},
    openId: "",
    currHabitName: "",
    hasLoginIn: false
  },

  getUserInfo: function () {
    const that = this
    wx.getUserProfile({
      desc: '获取信息',
      success(res) {
        wx.cloud.callFunction({
          name: "getOpenId",
          success(re) {
            wx.cloud.database().collection('habits').where({
                _openid: re.result.openid
              })
              .get({
                success(r) {
                  that.setData({
                    habits: r.data,
                    hasLoginIn: true,
                    openId: re.result.openid,
                    userInfo: res.userInfo
                  })
                }
              })
              console.log(re.result.openid,res.userInfo)
            // app.globalData.openId = re.result.openid,
            // app.globalData.userInfo = res.userInfo
            // wx.setStorageSync('openId', that.data.openId)
            // wx.setStorageSync('userInfo', that.data.userInfo)
            wx.cloud.callFunction({
              name: "updateInfo",
              data: {
                nickName: that.data.userInfo.nickName,
                avatarUrl: that.data.userInfo.avatarUrl,
              },
            })
          }
        })
      }
    })
  },

  acceptInvitation: function () {
    const self = this
    for(var temp of this.data.habits){
      if(temp.groupHabitId==self.data.groupHabitId){
        wx.showToast({
          title: '您已添加该习惯',
          icon: 'error',
          mask:true
          })
        return
      }
    }
    HABITS.add({
      data: {
        name: self.data.currHabitName,
        lastDaka: DakaMinusOne(new Date()),
        groupHabitId: self.data.groupHabitId,
        day: 0,
        stage:"观察期",
        state:"培养中",
        nickName:app.globalData.userInfo.nickName,
        avatar:app.globalData.userInfo.avatarUrl,
        buqian:2,
        buqianDay:[],
        tempDay:0,
        startTime:formatTime(new Date())
      },
      success(res) {
        wx.showToast({
          title: '添加成功',
          icon:"success",
          mask:true,
          success(){
            wx.switchTab({
              url: '../../my/login/login',
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    const that = this
    console.log(options.groupHabitId)
    this.setData({
      groupHabitId: options.groupHabitId
    }) //获取分享页来源的groupHabitID
    wx.cloud.database().collection('groupHabits').doc(options.groupHabitId).get({
      success: function (res) {
        that.setData({
          currHabitName: res.data.name
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})