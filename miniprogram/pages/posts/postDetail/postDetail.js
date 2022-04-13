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

    // oneImageLoad(e){
    //     const {width,height} = e.detail
    //     if(height >= width){this.setData({["postDetail.isHeightMode"]:true})}
    // },

    previewImg:function(e){
        wx.previewImage({
          urls: this.data.postDetail.imgList,
          current:e.currentTarget.dataset.src
        })
    },

    deletePost:function(){
        const that = this
        wx.showModal({
            title:"提示",
            content:"确定删除？",
            cancelColor: 'cancelColor',
            confirmColor:'#fc5959',
            success(res){
                if(res.confirm){
                    var temp = that.data.postDetail
                    wx.cloud.database().collection('dongtai').where({
                        _id:temp._id
                    }).remove()
                    wx.cloud.deleteFile({
                        fileList:temp.imgList,
                        success(res){
                            wx.showToast({
                            title: '删除成功',
                            })
                            wx.navigateBack({
                                delta:1
                            })
                        }
                    })
                }
             }
        })
    },

    deleteComment(e){
        const that = this
        var index = e.currentTarget.dataset.index
        if(this.data.postDetail.commentList[index].openId==this.data.openId){
            wx.showModal({
                title:"提示",
                content:"确定删除？",
                cancelColor: 'cancelColor',
                confirmColor:'#fc5959',
              success(res){
                if(res.confirm){
                    that.data.postDetail.commentList.splice(index,1)
                    wx.cloud.database().collection('dongtai').doc(that.data.postDetail._id).update({
                        data:{
                            commentList:that.data.postDetail.commentList
                        },
                        success(res){
                            that.setData({
                                ["postDetail.commentList"]:that.data.postDetail.commentList
                            })
                            wx.showToast({
                              title: '删除成功',
                              icon:"success"
                            })
                        }
                    })
                }
              }
            })
        }
    },

    like:function(){
        const that = this
        var temp = this.data.postDetail
        temp.likeList.push(app.globalData.openId)
        wx.cloud.database().collection('dongtai').doc(temp._id).update({
            data:{
                likeList: temp.likeList
            },
            success(res){
                that.setData({
                    ["postDetail"+".likeList"]:temp.likeList,
                    ["postDetail"+".like"]:true
                })
            }
        })
    },

    dislike:function(){
        const that = this
        var temp = this.data.postDetail
        var i = temp.likeList.indexOf(app.globalData.openId)
        temp.likeList.splice(i,1)
        wx.cloud.database().collection('dongtai').doc(temp._id).update({
            data:{
                likeList: temp.likeList
            },
            success(res){
                that.setData({
                    ["postDetail"+".likeList"]:temp.likeList,
                    ["postDetail"+".like"]:false
                })
            }
        })
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
                    comment.time = formatTime(new Date())
                    res.data.commentList.push(comment)
                    wx.cloud.database().collection('dongtai').doc(that.data.id).update({
                        data:{
                            commentList:res.data.commentList
                        },
                        success(re){       
                            wx.showToast({
                              title: '评论成功',
                            })
                            that.setData({
                                nothing:"",
                                ["postDetail.commentList"]:res.data.commentList
                            })
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this
        wx.cloud.database().collection('dongtai').doc(options.id).get({
            success(res){
                res.data.like = res.data.likeList.includes(app.globalData.openId) ? true :false
                that.setData({
                    id:options.id,
                    postDetail:res.data,
                    openId:app.globalData.openId
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
        return{
            title:'快来一起养成好习惯吧！',//todo
            path:'/pages/posts/postDetail/postDetail?id='+this.data.postDetail._id,
        }
    }
})