import { formatTime } from "../../../utils/utils"
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        postDetail:"",
        inputValue:"",  
        openId:"",
        id:""
    },

    getValue(e){
        this.data.inputValue = e.detail.value
    },

    send(){
        const that = this
        if(this.data.inputValue){
            wx.cloud.database().collection('dongtai').doc(that.data.id).get({
                success(res){
                    var comment = {}
                    comment.openId = app.globalData.openId
                    comment.nickName = app.globalData.userInfo.nickName
                    comment.avatar = app.globalData.userInfo.avatarUrl
                    comment.text = that.data.inputValue
                    comment.time = new Date()
                    res.data.commentList.push(comment)
                    wx.cloud.database().collection('dongtai').doc(that.data.id).update({
                        data:{
                            commentList:res.data.commentList
                        },
                        success(re){       
                            wx.showToast({
                              title: '评论成功',
                            })
                            that.reDetail()
                        }
                    })
                }
            })
        }
        else{
            wx.showToast({
              title: '输入不能为空',
              icon:'error'
            })
        }
    },

    reDetail(){
        const that = this
        wx.cloud.database().collection('dongtai').doc(that.data.id).get({
            success(res){
                var temp = res.data
                temp.time = formatTime(new Date(temp.time))
                if(temp.commentList){
                    for(var comment of temp.commentList)
                        comment.time = formatTime(new Date(comment.time))
                }
                that.setData({
                    postDetail:temp,
                    openId:app.globalData.openId
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id:options.id
        })
        this.reDetail()
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