// pages/login/login.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        openId:""
    },

    getUserInfo:function(){
        const that = this
        wx.getUserProfile({
            desc: '获取信息',
            success(res){
                wx.cloud.callFunction({
                    name:"getOpenId",
                    success(re){
                        that.setData({
                            openId:re.result.openid,
                            userInfo:res.userInfo
                        }) 
                        app.globalData.openId = that.data.openId
                        app.globalData.userInfo = that.data.userInfo
                        wx.setStorageSync('openId', that.data.openId)
                        wx.setStorageSync('userInfo', that.data.userInfo)               
                        wx.cloud.callFunction({
                            name:"updateInfo",
                            data:{
                                nickName:that.data.userInfo.nickName,
                                avatarUrl:that.data.userInfo.avatarUrl,
                            },
                        })
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {    
        const that = this
        app.globalData.userInfo = wx.getStorageSync('userInfo')
        app.globalData.openId = wx.getStorageSync('openId')
        this.setData({
            userInfo:app.globalData.userInfo,
            openId:app.globalData.openId
        })
        console.log(111)

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (options) {

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