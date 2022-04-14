// pages/habits/habitDetail/habitDetail.jsvar 
const HABITS = wx.cloud.database().collection('habits')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    habitDetail:"", 
    openId:"",
    index:""
  },

  delete:function(){
    const that = this
    wx.showModal({
      title:"提示",
      content:"确定删除？",
      cancelColor: 'cancelColor',
      confirmColor:'#fc5959',
      success(res){
        if(res.confirm){
          var temp = that.data.habitDetail
          wx.cloud.database().collection('habits').where({
            _id:temp._id
          }).remove()    
          app.globalData.habits.splice(that.data.index,1)        
          wx.showToast({
            title: '删除成功',
          })
          wx.navigateBack({
           delta:1
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
  wx.cloud.database().collection('habits').doc(app.globalData.habits[options.index]._id).get({
    success(res){
      that.setData({
        habitDetail:res.data,
        openId:app.globalData.openId,
        index:options.index
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