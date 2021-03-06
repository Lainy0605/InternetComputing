// pages/habits/everydayCard/everydayCard.js

const util = require('../../../utils/utils.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numOfDaka:0,
    openID:"",
    text:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var date = util.formatDate(new Date());
    this.setData({
      date: date
    })
    var month = Number.parseInt(date[5] + date[6]);
    var day = Number.parseInt(date[8] + date[9]);
    var dateNum = month*100 + day;
    var count = month*31 + day;
    wx.cloud.database().collection('specialDateCard').where({
      month:month,
      day:day
    })
    .get({
      success(res){
        if(res.data.length==0){
          wx.cloud.database().collection('everydayCard').skip(count%54).limit(1)
          .get({
            success(re){
              console.log(re)
              that.setData({
                text:re.data[0].text
              })
            }
        })
        }
        else{
          that.setData({
            text:res.data[0].text
          })
        }
      } 
    })
    wx.cloud.database().collection('habits').where({
      _openid:app.globalData.openId,
      state:'培养中'
    })
    .get({
      success(res){
        for(var i=0;i<res.data.length;i++){
          if(res.data[i].lastDaka==dateNum){
            console.log(res.data[i])
            that.data.numOfDaka++;
            that.setData({
              numOfDaka:that.data.numOfDaka
            })
          }
        }
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