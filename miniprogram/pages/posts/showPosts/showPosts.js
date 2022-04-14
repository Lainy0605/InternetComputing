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
        currentHabit_id:""
    },

    ChangeTab(e){
        var index = e.currentTarget.dataset.index;
        this.setData({
            currentTab:index,
            currentHabit_id:this.data.habitsList[index].id
        })
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
            cancelColor: 'cancelColor',
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

    getPosts(){
        const that = this
        return new Promise(function(resolve,reject){
            wx.cloud.database().collection('dongtai').orderBy('time','desc').get({
                success(res){
                    for(var i of res.data){
                        i.like = i.likeList.includes(app.globalData.openId) ? true : false
                    }
                    that.setData({
                        postList:res.data,   
                        habitsList:app.globalData.habits                 
                    })
                    resolve('success')
                }
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {
        wx.showToast({
            title: '加载中',
            icon:'loading'
          })
        if(app.globalData.openId){
            await this.getPosts()
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
        if(app.globalData.openId){
            if(!this.data.login){
                this.onLoad()
            }
            else{
                this.getPosts()
            }
        }
        else{
            wx.showToast({
              title: '未登录',
              icon:'error'
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
        await this.getPosts()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

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
                imageUrl:'../../../images/1.png', //todo
            }
        }
    }
})