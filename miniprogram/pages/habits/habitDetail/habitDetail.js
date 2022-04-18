// pages/habits/habitDetail/habitDetail.jsvar 
import { newMonth, Daka, DakaMinusOne, formatTime } from "../../../utils/utils"
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    habitDetail:"", 
    openId:"", 
    memberHabitDetail:[],
    memberNum:0,
    skipOne:false,
    skipTwo:false
  },

  buqian:function(){
    const that = this
    var temp
    var buqianNum = that.data.habitDetail.buqian-1
    wx.showModal({
      title:"提示",
      content:"本次补签需扣除20积分,确认补签吗？",
      cancelColor: '#CDF46E',
      confirmColor:"#fc5959",
      success(res){
        if(res.confirm){
          if(that.data.memberHabitDetail[0].credits>=20){
            if(that.data.skipOne==true){
              wx.cloud.database().collection('habits').doc(that.data.habitDetail._id).update({
                data:{
                  day:wx.cloud.database().command.inc(that.data.habitDetail.tempDay+1),
                  buqian:wx.cloud.database().command.inc(-1),
                  tempDay:0,
                  buqianDay:wx.cloud.database().command.push(DakaMinusOne(new Date()))
                }
              })
              temp = that.data.habitDetail.tempDay+that.data.habitDetail.day+1
            }
            else if(that.data.skipTwo==true){
              wx.cloud.database().collection('habits').doc(that.data.habitDetail._id).update({
                data:{
                  day:wx.cloud.database().command.inc(1),
                  buqian:wx.cloud.database().command.inc(-1),
                  tempDay:0,
                  buqianDay:wx.cloud.database().command.push(DakaMinusOne(new Date()))
                }
              })
              temp = that.data.habitDetail.day+1
            }
            that.setData({
              skipOne:false,
              skipTwo:false,
              ["habitDetail.day"]:temp,
              ["habitDetail.tempDay"]:0,
              ["habitDetail.buqian"]:buqianNum,
              ["memberHabitDetail[0].day"]:temp,
              ["memberHabitDetail[0].credits"]:that.data.memberHabitDetail[0].credits-20
            })
            wx.cloud.database().collection('userInfos').where({
              _openid:that.data.openId
            }).update({
              data:{
                credits:wx.cloud.database().command.inc(-20)
              }
            })
          }
          else{
            wx.showToast({
              title: '积分不足！',
            })
          }
        }
      }   
    })
  },


  daka: function(){
    const that = this
    wx.showModal({
        title:"提示",
        content:"确定打卡？",
        cancelColor: '#CDF46E',
        confirmColor:'#fc5959',
        success(res){
            if(res.confirm){
                var temp2
                var creditPlus
                var temp = that.data.habitDetail
                var tempStage = that.data.habitDetail.stage
                var tempDay = that.data.habitDetail.day+1
                var dates = Daka(new Date());
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
                      ["memberHabitDetail[0].day"]:tempDay,
                      ["memberHabitDetail[0].credits"]:that.data.memberHabitDetail[0].credits+creditPlus,
                      canDaka:false
                    })
                    wx.showToast({
                      title: '打卡成功！',
                    })
                    if(tempDay==90){
                      wx.showToast({
                        title: '习惯培养成功！积分+100',
                      })
                      wx.cloud.database().collection('habits').doc(temp._id).update({
                        data:{
                            state:"培养成功",
                            endTime:formatTime(new Date())
                        },
                      })
                      wx.cloud.database.collection('userInfos').where({
                        _openid:that.data.openId
                      }).update({
                        data:{
                          credits:wx.cloud.database().command.inc(100),
                          successNumber:wx.cloud.database().command.inc(1)
                        }
                      })
                    }
                  }
                })
            }
        }
    })
  },

  deleteUpdateDatabase(){
    const that=this
    var creditsMinus
    var stage = that.data.habitDetail.stage
    if(stage=="观察期"){creditsMinus=0}
    else if(stage=="起步期"){creditsMinus=10}
    else if(stage=="养成期"){creditsMinus=20}
    else if(stage=="稳定期"){creditsMinus=40}
    var temp = that.data.habitDetail
    wx.cloud.database().collection('habits').where({
      _id:temp._id
    }).update({
      data:{
        state:"培养失败",
        endTime:formatTime(new Date())
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
  },
  delete:function(){
    const that = this
    var creditsMinus
    var stage = that.data.habitDetail.stage
    if(stage=="观察期"){creditsMinus=0}
    else if(stage=="起步期"){creditsMinus=10}
    else if(stage=="养成期"){creditsMinus=20}
    else if(stage=="稳定期"){creditsMinus=40}
    wx.showModal({
      title:"提示",
      content:"需扣除"+creditsMinus+"积分,确定放弃吗？",
      cancelColor: '#CDF46E',
      confirmColor:'#fc5959',
      success(res){
        if(res.confirm){
          that.deleteUpdateDatabase()
          wx.showToast({
            title: '请再接再厉！',
            icon:'none',
            duration:2000,
            success(){
              setTimeout(function(){
                wx.navigateBack({
                  delta:1
                 })  
              },1500)
            }
          })       
        }
      }
    })
  },

  toPagenewPost:function(){
      wx.switchTab({
        url: '../../posts/showPosts/showPosts',
      })
  },

  //   todo: 设置提醒时间
  setRemindTime:function(){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    var dates = Daka(new Date());
    wx.showToast({
      title: '加载中',
      icon:'loading'
    })
    wx.cloud.database().collection('habits').doc(options.id).get({
      success(res){
        that.setData({
          habitDetail:res.data,
          openId:app.globalData.openId,
          canDaka:res.data.lastDaka < dates ? true : false,
        })
        if(newMonth(new Date())){
          wx.cloud.database().collection('habits').doc(options.id).update({
            data:{
              buqian:2,
              buqianDay:[]
            },
            success(res){
              that.setData({
                ["habitDetail.buqian"]:2,
                ["habitDetail.buqianDay"]:[]
              })
            }
          })
        }
        if(res.data.buqianDay.indexOf(DakaMinusOne(new Date()))==-1){
          if(dates-2==res.data.lastDaka){
            that.setData({
              skipOne:true
            })
        }
        else if(dates-3==res.data.lastDaka){
          that.setData({
            skipTwo:true
          })
        }
        else if(dates-4==res.data.lastDaka){
          wx.showToast({
            title: '连续三天未打卡，培养失败！',
          })
          that.deleteUpdateDatabase()
          return 
        }
        if(that.data.skipOne || that.data.skipTwo){
          wx.cloud.database().collection('habits').doc(options.id).update({
            data:{
              tempDay:res.data.day,
              day:0
            },
            success(re){
              that.setData({
                ["habitDetail.tempDay"]:res.data.day,
                ["habitDetail.day"]:0
              })
            }
          })
        }
        }
        wx.cloud.database().collection('habits').where({
          groupHabitId:res.data.groupHabitId
        }).get({
          success(re){
            that.setData({
              memberNum:re.data.length-1,
            })
            for(var temp of re.data){
              temp.dakaOrNot = temp.lastDaka < dates ? "false":"true"
              wx.cloud.database().collection('userInfos').where({
                _openid:temp._openid
              }).get({
                success(r){
                  temp.credits = r.data[0].credits
                  var t = that.data.memberHabitDetail
                  t.push(temp)
                  that.setData({
                    memberHabitDetail:t
                  })
                  wx.hideToast({
                    success: (res) => {},
                  })
                }
              })
            }
          }
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