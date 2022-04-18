const HABITS = wx.cloud.database().collection('habits')
const GROUPHABITS = wx.cloud.database().collection('groupHabits')
var app = getApp()
import { DakaMinusOne, formatTime } from "../../../utils/utils"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:"",
        clicked:false,
    },
    nameInput(e){
        this.setData({
            name: e.detail.value
        })
    },
    addHabit(){
        const that = this
        if (this.data.name.length>0 && this.data.name.length<=9) {
            wx.showModal({
              title:'提示',
              content:'您准备好培养该习惯了吗？',
              cancelColor: '#CDF46E',
              confirmColor:'#fc5959',
              success(res){
                  if(res.confirm){
                    GROUPHABITS.add({
                        data:{
                            name:that.data.name,
                        },
                        success:function(re)
                        {
                            HABITS.add
                            ({
                                data:{
                                    name:that.data.name,
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
                                success:function(res){
                                    wx.navigateBack({
                                        delta:1
                                    })
                                }             
                            })
                        }
                    })
                  }
              }
            })      
        }
        else if(this.data.name.length==0){
            wx.showToast({
                title: '没有空习惯哦~',
                icon:'error',
                mask:true
              })
        }
        else{
            wx.showToast({
              title: '太长啦~',
              icon:'error',
              mask:true
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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