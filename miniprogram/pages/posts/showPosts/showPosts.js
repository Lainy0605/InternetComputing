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
        postList:[],
        habitsList:[],
        currentTab:0,
        current_groupHabitId:"",
        skipNumber:0
    },

    ChangeTab(e){
        var index = e.currentTarget.dataset.index;
        if(index==0){
            this.setData({
                currentTab:index,
                current_groupHabitId:"",
                skipNumber:0
            })
            this.getMyPosts()
        }
        else{
            this.setData({
                currentTab:index,
                current_groupHabitId:this.data.habitsList[index].groupHabitId,
                skipNumber:0
            })
            this.getPosts(this.data.current_groupHabitId)
        }
    },

    toPagenewPost:function(){
        wx.navigateTo({
          url: '../newPost/newPost?groupHabitId='+this.data.current_groupHabitId,
          success:function(res){}
        })
    },

    toDetail:function(e){
        var temp = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../postDetail/postDetail?id='+temp,
            success:function(res){}
        })
    },

    previewImg:function(e){
        const imgList = this.data.postList[e.currentTarget.dataset.index].imgList
        const current = e.currentTarget.dataset.src
        wx.previewImage({
          urls: imgList,
          current:current
        })
    },

    // oneImageLoad(e){
    //     var index = e.currentTarget.dataset.index
    //     const {width,height} = e.detail
    //     if(height >= width){this.setData({["postList["+index+"].isHeightMode"]:true})}
    // },

    deletePost:function(e){
        const that = this
        wx.showModal({
            title:"提示",
            content:"确定删除？",
            cancelColor: '#CDF46E',
            confirmColor:'#fc5959',
            success(res){
                if(res.confirm){
                    var index=e.currentTarget.dataset.index
                    var temp = that.data.postList[index]
                    that.data.postList.splice(index,1)
                    wx.cloud.database().collection('dongtai').where({
                        _id:temp._id
                    }).remove()
                    wx.cloud.deleteFile({
                        fileList:temp.imgList,
                        success(res){
                            wx.showToast({
                            title: '删除成功',
                            mask:true,
                            })
                            that.setData({
                                postList:that.data.postList
                            })
                        }
                    })
                }
            }
        })
    },

    like:function(e){
        const that = this
        var index = e.currentTarget.dataset.index
        var temp = this.data.postList[index]
        that.setData({
            ['postList['+index+'].likeClicked']:true
        })
        setTimeout(function(){
            that.setData({
                ['postList['+index+'].likeClicked']:false
            })
        },600)
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
        that.setData({
            ['postList['+index+'].dislikeClicked']:true
        })
        setTimeout(function(){
            that.setData({
                ['postList['+index+'].dislikeClicked']:false
            })
        },600)
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

    getMyPosts(){
        const that = this
        return new Promise(function(resolve,reject){
            wx.cloud.database().collection('dongtai').where({
                _openid:app.globalData.openId
            }).skip(that.data.skipNumber).orderBy('time','desc').get({
                success(res){
                    for(var i of res.data){
                        i.like = i.likeList.includes(app.globalData.openId) ? true : false
                        i.likeClicked = false
                        i.dislikeClicked = false
                    }
                    if(that.data.skipNumber!=0){
                        if(res.data.length==0){
                            wx.showToast({
                              title: '已经没有更多啦~',
                              icon:'none',
                              mask:true
                            })
                        }
                        else{
                            that.setData({
                                postList:that.data.postList.concat(res.data),
                            })
                        }
                    }
                    else{
                        that.setData({
                            postList:res.data,   
                        })
                    }
                  resolve('success')
                }
            })
        })
    },

    getPosts(groupHabitId){
        const that = this
        return new Promise(function(resolve,reject){
            wx.cloud.database().collection('dongtai').where({
                groupHabitId:groupHabitId
            }).skip(that.data.skipNumber).orderBy('time','desc').get({
                success(res){
                    for(var i of res.data){
                        i.like = i.likeList.includes(app.globalData.openId) ? true : false
                        i.likeClicked = false
                        i.dislikeClicked = false
                    }
                    if(that.data.skipNumber!=0){
                        if(res.data.length==0){
                            wx.showToast({
                              title: '已经没有更多啦~',
                              icon:'none',
                              mask:true
                            })
                        }
                        else{
                            that.setData({
                                postList:that.data.postList.concat(res.data),
                            })
                        }
                    }
                    else{
                        that.setData({
                            postList:res.data,   
                        })
                    }
                    resolve('success')
                }
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {
        const that = this
        wx.showToast({
            title: '加载中',
            icon:'loading',
            mask:true
          })
        if(app.globalData.openId){
            wx.cloud.database().collection('habits').where({
                _openid:app.globalData.openId,
                state:"培养中"
            }).get({
                success(re){
                    var temp = [{"name":"我的"}]
                    temp = temp.concat(re.data)
                    that.setData({
                        habitsList:temp
                    })
                }
            })
            await this.getMyPosts()
            this.setData({
                login:true,
                openId:app.globalData.openId,
            })
        }
        wx.hideToast({
            success: (res) => {},
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
        const that = this
        if(app.globalData.openId){
            if(!this.data.login){
                this.onLoad()
            }
            else{
                wx.cloud.database().collection('habits').where({
                    _openid:app.globalData.openId,
                    state:"培养中"
                }).get({
                    success(re){
                        var temp = [{"name":"我的"}]
                        temp = temp.concat(re.data)
                        that.setData({
                            habitsList:temp
                        })
                    }
                })
                if(this.data.currentTab==0){
                    this.getMyPosts()
                }
                else{
                    this.getPosts(this.data.current_groupHabitId)
                }
            }
        }
        else{
            wx.showToast({
              title: '未登录',
              icon:'error',
              mask:true
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
    async onPullDownRefresh() {
        this.setData({
            skipNumber:0
        })
        if(this.data.currentTab==0){
            await this.getMyPosts()
        }
        else{
            await this.getPosts(this.data.current_groupHabitId)
        }
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    async onReachBottom() {
        this.setData({
            skipNumber:this.data.postList.length
        })
        if(this.data.currentTab==0){
            await this.getMyPosts()
        }
        else{
            await this.getPosts(this.data.current_groupHabitId)
        }
        this.setData({
            skipNumber:0
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
        if(e.from==='button'){
            var index = e.target.dataset.index
            return{
                title:'快来一起养成好习惯吧！', //todo
                path:'/pages/posts/postDetail/postDetail?id='+this.data.postList[index]._id,
                // imageUrl:'../../../images/1.png', //todo
            }
        }
    }
})