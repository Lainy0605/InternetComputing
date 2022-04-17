// pages/habits/habitDetail/habitDetail.jsvar 
import { milisecond } from "../../../utils/utils"
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    habitDetail:"", 
    openId:"",
    index:"",
    groupHabitId:"",
    stage:""
  },

  daka: function(){
    const that = this
    var dates = milisecond(new Date());
    var canDaka = false;
    if (that.data.habitDetail.lastDaka<dates)
      canDaka = true;
    wx.showModal({
        title:"提示",
        content:"确定打卡？",
        cancelColor: '#005959',
        confirmColor:'#fc5959',
        success(res){
            if(res.confirm&&canDaka){
                var temp = that.data.habitDetail
                var temp2
                var tempDay = app.globalData.habits[that.data.index].day+1
                if(tempDay>=0 && tempDay<=3){temp2="观察期"}
                else if(tempDay>=4 && tempDay<=7){temp2="起步期"}
                else if(tempDay>=8 && tempDay<=21){temp2="养成期"}
                else if(tempDay>=22 && tempDay<=90){temp2="稳定期"}
                wx.cloud.database().collection('habits').doc(temp._id).update({
                  data:{
                      lastDaka:dates,
                      day:tempDay,
                      stage:temp2
                  },
                  success(re){
                    that.setData({
                      ["habitDetail.lastDaka"]:dates,
                      ["habitDetail.day"] : tempDay,
                      ["habitDetail.stage"] : temp2,
                      ["habitDetail.daka"] : true
                    })
                    app.globalData.habits[that.data.index].lastDaka = dates;
                    app.globalData.habits[that.data.index].day = app.globalData.habits[that.data.index].day+1;
                    app.globalData.habits[that.data.index].stage = temp2;
                    wx.showToast({
                      title: '打卡成功',
                    })
                  }
                })
            }
            else if ((!canDaka)&&(res.confirm))
            {
              wx.showToast({
                title: '您今日已打卡',
                icon: 'error'
                })
            }
        }
    })
  },

  // invite: function(e){
  //   var temp = e.currentTarget.dataset.index;
  //       wx.navigateTo({
  //           url: '../invite/invite?index='+temp,
  //           success:function(res){}
  //       })
  // },

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

//   todo: 跳转到该习惯对应的动态发送页
toPagenewPost:function(){

},

//   todo: 设置提醒时间
setRemindTime:function(){

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
        index:options.index,
        groupHabitId:res.data.groupHabitId
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
    var that = this;
    return{
        title:'快来一起养成好习惯吧！',//todo
        path:'/pages/habits/invite/invite?groupHabitId='+that.data.groupHabitId,
    }
}
})