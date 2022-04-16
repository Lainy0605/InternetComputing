// pages/habits/invite/invite.js
// 邀请界面，向好友发送习惯组队邀请所展示的界面，数据包括习惯的id，要求打开该页面能够获取用户星系，并成功添加该习惯
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupHabitId:"",
    inviteeOpenID:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.groupHabitId)
    this.setData({
       groupHabitId:options.groupHabitId
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