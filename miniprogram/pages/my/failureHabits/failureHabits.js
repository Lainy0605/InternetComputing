// pages/my/failureHabits/failureHabits.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        failureHabits:[],
        nums: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this
        //todo
        wx.cloud.database().collection('habits').where({
            _openid:app.globalData.openId,
            state:"培养失败"
        }).get({
            success(res){
                that.setData({
                    failureHabits:res.data,
                })
                that.setData({
                    nums: that.data.failureHabits.length,
                })
                console.log(res.data[0])
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