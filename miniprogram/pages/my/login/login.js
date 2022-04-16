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
        level:""
    },

    getUserInfo:function(){
        const that = this
        wx.getUserProfile({
            desc: '获取信息',
            success(res){
                wx.cloud.callFunction({
                    name:"getOpenId",
                    success(re){
                        wx.cloud.database().collection('userInfos').where({
                            _openid:re.result.openid
                        }).get({
                            success(r){
                                if(r.data.length==0){
                                    wx.cloud.database().collection('userInfos').add({
                                        data:{
                                            credits:0,
                                            level:0
                                        },
                                        success(t){
                                            that.setData({
                                                credits:0,
                                                level:0
                                            })
                                        }
                                    })
                                }
                                else{
                                    that.setData({
                                        credits:r.data[0].credits,
                                        level:r.data[0].level
                                    })
                                }
                            },
                        })
                        wx.cloud.database().collection('habits').where({
                            _openid:re.result.openid
                        })
                        .get({
                            success(r){
                                app.globalData.habits = r.data 
                                that.setData({habits:r.data})  
                                for(var habit of app.globalData.habits){
                                    if(habit.state=="培养中"){
                                        that.data.developingNumber++
                                    }
                                    else if(habit.state=="培养成功"){
                                        that.data.successNumber++
                                    }
                                    else if(habit.state=="培养失败"){
                                        that.data.failureNumber++
                                    }
                                } 
                                that.setData({
                                    developingNumber:that.data.developingNumber,
                                    successNumber:that.data.successNumber,
                                    failureNumber:that.data.failureNumber
                                })
                            }          
                        }) 
                        app.globalData.openId = re.result.openid,
                        app.globalData.userInfo = res.userInfo
                        that.setData({
                            openId:re.result.openid,
                            userInfo:res.userInfo,
                        }) 
                        wx.setStorageSync('openId', that.data.openId)
                        wx.setStorageSync('userInfo', that.data.userInfo)            
                        wx.cloud.callFunction({
                            name:"updateInfo",
                            data:{avatarUrl:that.data.userInfo.avatarUrl},
                        })
                    }
                })
            }
        })
    },

    toRules:function(){
        wx.navigateTo({
          url:'./rules/rules',
          success:function(res){}
        })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {    
        const that = this
        app.globalData.userInfo = wx.getStorageSync('userInfo')
        app.globalData.openId = wx.getStorageSync('openId')
        wx.cloud.database().collection('habits').where({
            _openid:app.globalData.openId
        })
        .get({         
            success(res){
                app.globalData.habits = res.data  
                for(var habit of app.globalData.habits){
                    if(habit.state=="培养中"){
                        that.data.developingNumber++
                    }
                    else if(habit.state=="培养成功"){
                        that.data.successNumber++
                    }
                    else if(habit.state=="培养失败"){
                        that.data.failureNumber++
                    }
                } 
                that.setData({
                    developingNumber:that.data.developingNumber,
                    successNumber:that.data.successNumber,
                    failureNumber:that.data.failureNumber
                })    
            }          
        }) 
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
                success(r){
                    that.setData({
                        credits:r.data[0].credits,
                        level:r.data[0].level
                    })
                }
            })
            for(var habit of app.globalData.habits){
                if(habit.state=="培养中"){
                    that.data.developingNumber++
                }
                else if(habit.state=="培养成功"){
                    that.data.successNumber++
                }
                else if(habit.state=="培养失败"){
                    that.data.failureNumber++
                }
            } 
            this.setData({
                developingNumber:that.data.developingNumber,
                successNumber:that.data.successNumber,
                failureNumber:that.data.failureNumber
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