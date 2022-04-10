// pages/messages.js
var app = getApp()
import { formatTime } from "../../../utils/utils"
Page({
    /**
     * 页面的初始数据
     */
    data: {
        login:false,
        openId:"",
        postList:[]
    },

    toPagenewPost:function(){
        wx.navigateTo({
          url: '../newPost/newPost',
          success:function(res){}
        })
    },

    toDetail:function(e){
        var temp = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../detail/detail?id='+temp,
            success:function(res){}
        })
    },

    deletePost:function(e){
        var index=e.currentTarget.dataset.index
        var temp = this.data.postList[index]
        this.data.postList.splice(index,1)
        const that = this
        wx.cloud.database().collection('dongtai').where({
            _id:temp._id
        }).remove()
        wx.cloud.deleteFile({
            fileList:temp.imgList,
            success(res){
                wx.showToast({
                  title: '删除成功',
                })
                that.setData({
                    postList:that.data.postList
                })
            }
        })
    },

    like:function(e){
        const that = this
        var index = e.currentTarget.dataset.index
        var temp = this.data.postList[index]
        temp.likeList.push(app.globalData.openId)
        wx.cloud.database().collection('dongtai').doc(temp._id).update({
            data:{
                likeList: temp.likeList
            },
            success(res){
                that.setData({
                    ["postList["+index+"]"+".likeList"]:temp.likeList,
                    ["postList["+index+"]"+".like"]:true
                })
            }
        })
    },

    dislike:function(e){
        const that = this
        var index = e.currentTarget.dataset.index
        var temp = this.data.postList[index]
        var i = temp.likeList.indexOf(app.globalData.openId)
        temp.likeList.splice(i,1)
        wx.cloud.database().collection('dongtai').doc(temp._id).update({
            data:{
                likeList: temp.likeList
            },
            success(res){
                that.setData({
                    ["postList["+index+"]"+".likeList"]:temp.likeList,
                    ["postList["+index+"]"+".like"]:false
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            openId:app.globalData.openId
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
        if(app.globalData.openId){
            if(!this.data.login){
                this.onLoad()
                this.data.login = true
            }
            var that = this
            wx.cloud.database().collection('dongtai').orderBy('time','desc').get({
                success(res){
                    var temp = res.data
                    for(var i of temp){
                        i.time = formatTime(new Date(i.time))
                        if(i.likeList.includes(app.globalData.openId)){
                            i.like=true
                        }
                        else{
                            i.like=false
                        }
                    }
                    that.setData({
                        postList:temp
                    })
                }
            })
        }
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
        this.onShow()
        wx.stopPullDownRefresh()
        wx.showToast({
            title: '刷新成功',
            icon:'success'
          })
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