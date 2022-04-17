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
        cancelColor: '#CDF46E',
        confirmColor:'#fc5959',
        success(res){
            if(res.confirm&&canDaka){
                var temp2
                var creditPlus
                var temp = that.data.habitDetail
                var tempStage = that.data.habitDetail.stage
                var tempDay = that.data.habitDetail.day+1
                if(tempDay>=0 && tempDay<=3){temp2="观察期"}
                else if(tempDay>=4 && tempDay<=7){temp2="起步期"}
                else if(tempDay>=8 && tempDay<=21){temp2="养成期"}
                else if(tempDay>=22 && tempDay<=90){temp2="稳定期"}
                if(tempStage=="观察期"){creditPlus=1}
                else if(tempStage=="起步期"){creditPlus=3}
                else if(tempStage=="养成期"){creditPlus=5}
                else if(tempStage=="稳定期"){creditPlus=8}
                wx.cloud.database().collection('userInfos').where({
                    _openid:app.globalData.openId
                }).update({
                  data:{
                    credits:wx.cloud.database().command.inc(creditPlus)
                  }
                })
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
                    wx.showToast({
                      title: '打卡成功！',
                    })
                    if(tempDay==90){
                      wx.showToast({
                        title: '习惯培养成功！',
                      })
                    }
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

  delete:function(){
    const that = this
    var creditsMinus
    var stage = that.data.habitDetail.stage
    if(stage=="观察期"){creditsMinus=0}
    else if(stage="起步期")(creditsMinus=10)
    else if(stage="养成期")(creditsMinus=20)
    else if(stage="稳定期")(creditsMinus=40)
    wx.showModal({
      title:"提示",
      content:"需扣除"+creditsMinus+"积分,确定放弃？",
      cancelColor: '#CDF46E',
      confirmColor:'#fc5959',
      success(res){
        if(res.confirm){
          var temp = that.data.habitDetail
          wx.cloud.database().collection('habits').where({
            _id:temp._id
          }).update({
            data:{
              state:"培养失败"
            }
          })
          wx.cloud.database().collection('userInfos').where({
            _openid:that.data.openId
          }).update({
            data:{
              credits:wx.cloud.database().command.inc(-creditsMinus)
            },
          })   
          wx.cloud.database().collection('groupHabits').doc(temp.groupHabitId).get({
                success(res){
                  if(res.data._openid==that.data.openId){
                    wx.cloud.database().collection('groupHabits').doc(temp.groupHabitId).remove()
                  }
                  else{
                    var index = res.data.memberIds.indexOf(temp._id)
                    res.data.memberIds.splice(index,1)
                    wx.cloud.database().collection('groupHabits').doc(temp.groupHabitId).update({
                      data:{
                        memberIds:res.data.memberIds
                      }
                    })
                  }
                }
          })    
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
  wx.cloud.database().collection('habits').doc(options.id).get({
    success(res){
      that.setData({
        habitDetail:res.data,
        openId:app.globalData.openId,
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
        path:'/pages/habits/invite/invite?groupHabitId='+that.data.habitDetail.groupHabitId,
    }
  }
})