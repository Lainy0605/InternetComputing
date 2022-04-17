// pages/habits/invite/invite.js
// 邀请界面，向好友发送习惯组队邀请所展示的界面，数据包括习惯的id，要求打开该页面能够获取用户星系，并成功添加该习惯
var app = getApp()
import {
  milisecondLast
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
    habits: [],
    currHabitName: "",
    isUserInGroup: false,
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
                  app.globalData.habits = r.data
                  that.setData({
                    habits: r.data,
                    hasLoginIn: true
                  })
                  console.log("用户登录成功")
                }
              })
            app.globalData.openId = re.result.openid,
              app.globalData.userInfo = res.userInfo
            that.setData({
              openId: re.result.openid,
              userInfo: res.userInfo
            })
            wx.setStorageSync('openId', that.data.openId)
            wx.setStorageSync('userInfo', that.data.userInfo)
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
    var currUserHabits = []
    HABITS.where({
      _openid: self.data.openid
    }).get({
      success(res) {
        currUserHabits = res.data
        console.log(currUserHabits)
        console.log(currUserHabits.length)
        for (let i in currUserHabits) {
          console.log(currUserHabits[i].groupHabitId, self.data.groupHabitId)
          if (currUserHabits[i].groupHabitId == self.data.groupHabitId) {
            self.data.isUserInGroup = true
            break
          }
        }

        if (self.data.isUserInGroup) {
          console.log("用户已经在群组中")
          wx.showToast({
            title: '你已添加该习惯',
            icon: 'error'
            })
        } else {
          console.log("用户不在群组中")
          var date = milisecondLast(new Date())
          HABITS.add({
            data: {
              name: self.data.currHabitName,
              lastDaka: date,
              groupHabitId: self.data.groupHabitId,
              day: 0
            },
            success(res) {
              app.globalData.habits.push({
                "name": self.data.currHabitName,
                "day": 0,
                "offset": 0,
                "lastDaka": date,
                "groupHabitId": self.data.groupHabitId,
                "_id": res._id
              })

              GROUPHABITS.doc(self.data.groupHabitId).update({
                data: {
                  memberIds: wx.cloud.database().command.push(res._id)
                }
              })
            },
            fail (res) {
              console.log("用户添加习惯失败")
            }
          })
        }
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
        console.log(res.data.name)
        that.setData({
          currHabitName: res.data.name
        })
      },
      fail: function (res) {
        console.log(res)
      }
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