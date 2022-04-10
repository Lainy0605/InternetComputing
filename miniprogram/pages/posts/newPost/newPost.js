// pages/message/newPost/newPost.js
var app = getApp()
import { Buttonclicked } from '../../../utils/utils'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue:"",
        imgList:[],
        cloudimgList:[],
        index:"",
        clicked:false,
        canChoose:true,
    },
    
    getValue(e){
        this.setData({
            inputValue:e.detail.value
        })
    },

    chooseImage(){
        const that = this
        wx.chooseMedia({
            mediaType:['image'],
            count: 9-that.data.imgList.length,
            success(res){
                const temp = that.data.imgList.concat(res.tempFiles)
                var t = !(temp.length==9)
                console.log(t)
                that.setData({
                  imgList: temp,
                  canChoose:t
                })
            }
          })
    },

    deleteImg(e){
        var index=e.currentTarget.dataset.index
        this.data.imgList.splice(index,1)
        this.setData({
            imgList:this.data.imgList,
            canChoose:true
        })
    },

    uploadTocloud(temp){
        const that = this
        return new Promise(function(resolve,reject){
            wx.cloud.uploadFile({
                cloudPath:Date.now()+'.jpg',
                filePath: temp.tempFilePath,
                success(res){
                    that.data.cloudimgList.push(res.fileID)
                    resolve('success')
                },
            })
        })
    },
    uploadToDatabase(){
        const that = this
        return new Promise(function(resolve,reject){
            wx.cloud.database().collection('dongtai').add({
                data:{
                    nickName:app.globalData.userInfo.nickName,
                    avatar:app.globalData.userInfo.avatarUrl,
                    text:that.data.inputValue,
                    imgList:that.data.cloudimgList,
                    time:Date.now(),
                    commentList:[],
                    likeList:[],
                },
                success(res){
                    resolve('success')
                }
            })
        })
    },
    async send(){
        if(this.data.inputValue){
            Buttonclicked(this)
            for(var temp of this.data.imgList){
                await this.uploadTocloud(temp)
            }
            await this.uploadToDatabase()
            wx.navigateBack({
                delta:1
            })
            wx.showToast({
              title: '发布成功',
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