// pages/message/newPost/newPost.js
var app = getApp()
import { Buttonclicked } from '../../../utils/utils'
import { formatTime,Daka } from "../../../utils/utils"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue:"",  //输入框的值
        imgList:[],     //图片本地缓存路径
        cloudimgList:[],//图片云端存储路径
        index:"",       //删除选中的图片
        clicked:false,  //是否重复提交
        canChoose:true, //图片选择上限
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
                    groupHabitId:that.data.groupHabitId,
                    time:formatTime(new Date()),
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
        const that = this
        if(this.data.inputValue || this.data.imgList.length!=0){
            Buttonclicked(this)
            for(var temp of this.data.imgList){
                await this.uploadTocloud(temp)
            }
            await this.uploadToDatabase()
            var dates = Daka(new Date())
            if(that.data.habitDetail.lastDaka < dates){
                that.daka(dates)
                wx.navigateBack({
                    delta:1
                })
            }else{
                wx.showToast({
                    title: '发布成功',
                    mask:true,
                    success(){
                        setTimeout(function(){
                            wx.navigateBack({
                                delta:1
                            })
                        },500)
                    }
                })
            }

        }
        else{
            wx.showToast({
              title: '输入不能为空',
              icon:'error',
              mask:true
            })
        }
    },

    daka: function(dates){
        const that = this
        var temp2
        var creditPlus
        var temp = that.data.habitDetail
        var tempStage = that.data.habitDetail.stage
        var tempDay = that.data.habitDetail.day+1
        console.log(111)
        if(tempDay>=0 && tempDay<=3){temp2="观察期"}
        else if(tempDay>=4 && tempDay<=7){temp2="起步期"}
        else if(tempDay>=8 && tempDay<=21){temp2="养成期"}
        else if(tempDay>=22 && tempDay<=90){temp2="稳定期"}
        if(tempStage=="观察期"){creditPlus=1}
        else if(tempStage=="起步期"){creditPlus=3}
        else if(tempStage=="养成期"){creditPlus=5}
        else if(tempStage=="稳定期"){creditPlus=8}
        wx.cloud.database().collection('userInfos').where({
            _openid:app.globalData.openId
        }).update({data:{credits:wx.cloud.database().command.inc(creditPlus)}})
        wx.cloud.database().collection('habits').doc(temp._id).update({
            data:{
                lastDaka:dates,
                day:tempDay,
                stage:temp2
            },
            success(re){
                wx.showToast({
                    title: '打卡成功！',
                    mask:true
                })
                if(tempDay==90){
                    wx.showToast({
                    title: '习惯培养成功！积分+100',
                    mask:true
                    })
                    wx.cloud.database().collection('habits').doc(temp._id).update({
                    data:{
                        state:"培养成功",
                        endTime:formatTime(new Date())
                        },
                    })
                    wx.cloud.database.collection('userInfos').where({
                        _openid:that.data.openId
                    }).update({
                        data:{
                            credits:wx.cloud.database().command.inc(100),
                            successNumber:wx.cloud.database().command.inc(1)
                        }
                    })
                }
            }
        })
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this
        wx.cloud.database().collection('habits').where({
            _openid:app.globalData.openId,
            groupHabitId:options.groupHabitId
        }).get({
            success(res){
                that.setData({
                    groupHabitId:options.groupHabitId,
                    habitDetail:res.data[0]
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