// pages/my/successHabits/successHabits.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        successHabits:[],
        nums: 0,
    },

    getItemTime(item) {
        return item.substr(0, 10)
    },

    toPosts(e){
        var index= e.currentTarget.dataset.index
        app.globalData.fromSuccessHabit = true
        app.globalData.groupHabitId = this.data.successHabits[index].groupHabitId
        wx.switchTab({
          url: '../../posts/showPosts/showPosts',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this
        wx.cloud.callFunction({
            name:"getSuccessHabits",
            success(res){
                console.log(res)
                for(var item of res.result.data){
                    item.endTime = that.getItemTime(item.endTime)
                }
                that.setData({
                    successHabits:res.result.data,
                    nums:res.result.data.length
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