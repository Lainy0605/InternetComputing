const HABITS = wx.cloud.database().collection('habits')
const GROUPHABITS = wx.cloud.database().collection('groupHabits')
var app = getApp()
import { milisecondLast } from "../../../utils/utils"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:"",
    },
    nameInput(e){
        this.setData({
            name: e.detail.value
        })
    },
    addHabit(){
        const that = this
        if (this.data.name.length>0 && this.data.name.length<=9) {
            var dates = milisecondLast(new Date());
            GROUPHABITS.add({
                data:{
                    name:that.data.name,
                    memberIds:[]
                },
                success:function(re)
                {
                    dates = milisecondLast(new Date());
                    app.globalData.habits.push({"name":that.data.name,"day":0,"offset":0,"lastDaka":dates,"GroupHabitId":re._id});
                    HABITS.add
                    ({
                        data:{
                            name:that.data.name,
                            lastDaka:dates,
                            GroupHabitId:re._id,
                            day:0
                        },
                        success:function(res){
                            wx.cloud.database().collection('groupHabits').doc(re._id).update({
                                data:{
                                     memberIds:[res._id]
                                }
                            }),
                            wx.navigateBack({
                                delta:1
                            })
                        }
                       
                    })
                }
            })
            
        }
        else if(this.data.name.length==0){
            wx.showToast({
                title: '没有空习惯哦~',
                icon:'error'
              })
        }
        else{
            wx.showToast({
              title: '太长啦~',
              icon:'error'
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