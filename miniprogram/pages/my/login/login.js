// pages/login/login.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{},
        openId:"",
        developingNumber:0,
        successNumber:0,
        failureNumber:0,
        credits:0,
        level:"",
        levelValue:""
    },

    setlevelValue(successNumber){
        if(successNumber==0){this.data.levelValue="习惯小白",this.data.level = 0}
        else if(1<=successNumber && successNumber<5){this.data.levelValue="习惯新手",this.data.level = 1}
        else if(5<=successNumber && successNumber<10){this.data.levelValue="习惯？？",this.data.level = 2}
        else if(10<=successNumber && successNumber<20){this.data.levelValue="习惯精英",this.data.level = 3}
        else if(20<=successNumber && successNumber<50){this.data.levelValue="习惯大师",this.data.level = 4}
        else if(50<=successNumber){this.data.levelValue="习惯王者",this.data.level = 5}
        this.setData({
            levelValue:this.data.levelValue,
            level:this.data.level
        })
    },

    getUserInfo:function(){
        const that = this
        wx.getUserProfile({
            desc: '获取信息',
            success(res){
                wx.cloud.callFunction({
                    name:"getOpenId",
                    success(re){
                        app.globalData.openId = re.result.openid,
                        app.globalData.userInfo = res.userInfo
                        that.setData({
                            openId:re.result.openid,
                            userInfo:res.userInfo,
                        }) 
                        that.onShow()
                        wx.setStorageSync('openId', that.data.openId)
                        wx.setStorageSync('userInfo', that.data.userInfo)            
                        wx.cloud.callFunction({
                            name:"updateInfo",
                            data:{avatarUrl:that.data.userInfo.avatarUrl,nickName:that.data.userInfo.nickName},
                        })
                    }
                })
            }
        })
    },

    toRules:function(){
        wx.navigateTo({
          url:'../../my/rules/rules',
          success:function(res){}
        })
    },
    
    toING(){
        wx.navigateTo({
            url: '../../my/successHabits/successHabits',
            success:function(res){}
          })
    },
    toSuccessHabits(){
        wx.navigateTo({
          url: '../../my/successHabits/successHabits',
          success:function(res){}
        })
    },

    toFailureHabits(){
        wx.navigateTo({
            url: '../../my/failureHabits/failureHabits',
            success:function(res){}
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {    
        app.globalData.userInfo = wx.getStorageSync('userInfo')
        app.globalData.openId = wx.getStorageSync('openId')
        this.setData({
            userInfo:app.globalData.userInfo,
            openId:app.globalData.openId,
        })   
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
        if(app.globalData.openId){
            const that = this
            wx.cloud.database().collection('userInfos').where({
                _openid:app.globalData.openId
            }).get({
                success(res){
                    if(res.data.length==0){
                         wx.cloud.database().collection('userInfos').add({
                            data:{
                                credits:0,
                                successNumber:0
                            },
                            success(t){
                                that.setData({
                                    credits:0,
                                    successNumber:0
                                })
                            }
                        })
                    }
                    else{
                        that.setData({credits:res.data[0].credits})
                        that.setlevelValue(res.data[0].successNumber)
                    }
                },
            })          
            wx.cloud.callFunction({
                name:"getHabits",
                success(res){
                    var temp1=0;var temp2=0;var temp3=0
                    for(var habit of res.result.data){
                        if(habit.state=="培养中"){temp1++}
                        else if(habit.state=="培养成功"){temp2++}
                        else if(habit.state=="培养失败"){temp3++}
                    } 
                    that.setData({
                        developingNumber:temp1,
                        successNumber:temp2,
                        failureNumber:temp3
                    })      
                },
                fail(e){
                    console.log(e)
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