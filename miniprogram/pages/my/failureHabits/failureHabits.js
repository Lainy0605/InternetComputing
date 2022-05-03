// pages/my/failureHabits/failureHabits.js
const app=getApp()
const HABITS = wx.cloud.database().collection('habits')
const GROUPHABITS = wx.cloud.database().collection('groupHabits')
import {
    DakaMinusOne, formatTime
  } from "../../../utils/utils"
  
Page({

    /**
     * 页面的初始数据
     */
    data: {
        failureHabits:[],
        nums: 0
    },

    restart(e) {
        const that = this
        var index = e.currentTarget.dataset.index
        HABITS.doc(e.currentTarget.dataset.id).remove()
        GROUPHABITS.add({
            data:{
                name:that.data.failureHabits[index].name,
            },
            success:function(re)
            {
                HABITS.add
                ({
                    data:{
                        name:that.data.failureHabits[index].name,
                        lastDaka:DakaMinusOne(new Date()),
                        groupHabitId:re._id,
                        day:0,
                        state:"培养中",
                        stage:"观察期",
                        nickName:app.globalData.userInfo.nickName,
                        avatar:app.globalData.userInfo.avatarUrl,
                        buqian:2,
                        buqianDay:[],
                        tempDay:0,
                        startTime:formatTime(new Date())
                    },
                    success(r){
                        wx.switchTab({
                            url: "/pages/habits/showHabits/showHabits",
                            success: function (res) {
                                console.log("载入第一页成功")
                            },
                            fail(res) {
                                console.log("载入第一页失败")
                            }
                        })
                    }
                })
            }
        })
    },
    delete(e){
        const that = this
        wx.showModal({
          cancelColor: '#CDF46E',
          confirmColor:'#fc5959',
          content:'需要消耗50积分，确定删除吗？',
          success(res){
              if(res.confirm){
                  wx.cloud.database().collection('userInfos').where({
                      _openid:app.globalData.openId
                  }).get({
                      success(re){
                          console.log(re)
                          if(re.data[0].credits>=50){
                              wx.cloud.database().collection('userInfos').where({
                                  _openid:app.globalData.openId
                              }).update({
                                    data:{
                                        credits:wx.cloud.database().command.inc(-50)
                                    },
                                  success(r){
                                    HABITS.doc(e.currentTarget.dataset.id).remove({
                                        success(t){
                                            wx.showToast({
                                                title: '删除成功！',
                                                icon:'error'
                                            })
                                            that.onLoad()
                                        }
                                    }
                                    )
                                  }
                            })
                          }
                          else{
                              wx.showToast({
                                title: '积分不足！',
                                icon:'error'
                              })
                          }
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
        wx.showLoading({
            title: '加载中',
          })
        const that = this
        wx.cloud.callFunction({
            name:"getFailureHabits",
            success(res){
                console.log(res)
                that.setData({
                    failureHabits:res.result.data,
                    nums:res.result.data.length,
                    setNums:true
                })
                wx.hideLoading({
                    success: (res) => {},
                  })
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

    }
})