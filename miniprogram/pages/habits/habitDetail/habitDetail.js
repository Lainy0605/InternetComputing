// pages/habits/habitDetail/habitDetail.jsvar 
import { newMonth, Daka, DakaMinusOne, formatTime } from "../../../utils/utils"
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        habitDetail: "",
        openId: "",
        memberHabitDetail: [],
        memberNum: 0,
        skipOne: false,
        skipTwo: false,
        remindTime: "",
        myIndex:0
    },

    buqian: function () {
        const that = this
        var temp
        var buqianNum = that.data.habitDetail.buqian - 1
        wx.showModal({
            title: "提示",
            content: "本次补签需扣除20积分,确认补签吗？",
            cancelColor: '#CDF46E',
            confirmColor: "#fc5959",
            success(res) {
                if (res.confirm) {
                    if (that.data.memberHabitDetail[0].credits >= 20) {
                        if (that.data.skipOne == true) {
                            wx.cloud.database().collection('habits').doc(that.data.habitDetail._id).update({
                                data: {
                                    day: wx.cloud.database().command.inc(that.data.habitDetail.tempDay + 1),
                                    buqian: wx.cloud.database().command.inc(-1),
                                    tempDay: 0,
                                    buqianDay: wx.cloud.database().command.push(DakaMinusOne(new Date())),
                                    lastDaka: DakaMinusOne(new Date())
                                }
                            })
                            temp = that.data.habitDetail.tempDay + that.data.habitDetail.day + 1
                        }
                        else if (that.data.skipTwo == true) {
                            wx.cloud.database().collection('habits').doc(that.data.habitDetail._id).update({
                                data: {
                                    day: wx.cloud.database().command.inc(1),
                                    buqian: wx.cloud.database().command.inc(-1),
                                    tempDay: 0,
                                    buqianDay: wx.cloud.database().command.push(DakaMinusOne(new Date())),
                                    lastDaka: DakaMinusOne(new Date())
                                }
                            })
                            temp = that.data.habitDetail.day + 1
                        }
                        that.setData({
                            skipOne: false,
                            skipTwo: false,
                            ["habitDetail.day"]: temp,
                            ["habitDetail.tempDay"]: 0,
                            ["habitDetail.buqian"]: buqianNum,
                            ["memberHabitDetail["+that.data.myIndex+"].day"]: temp,
                            ["memberHabitDetail["+that.data.myIndex+"].credits"]: that.data.memberHabitDetail[that.data.myIndex].credits - 20
                        })
                        wx.cloud.database().collection('userInfos').where({
                            _openid: that.data.openId
                        }).update({
                            data: {
                                credits: wx.cloud.database().command.inc(-20)
                            }
                        })
                    }
                    else {
                        wx.showToast({
                            title: '积分不足！',
                            icon: 'none',
                            mask: true
                        })
                    }
                }
            }
        })
    },


    daka: function () {
        const that = this
        if (this.data.skipOne || this.data.skipTwo) {
            wx.showModal({
                cancelColor: '#CDF46E',
                confirmColor: '#fc5959',
                content: "打卡成功将不可补签，确认打卡吗？",
                success(res) {
                    if (res.confirm) {
                        app.globalData.fromHabit = true,
                            app.globalData.groupHabitId = that.data.habitDetail.groupHabitId
                        wx.switchTab({
                            url: '../../posts/showPosts/showPosts',
                        })
                    }
                }
            })
        }
        else {
            app.globalData.fromHabit = true,
                app.globalData.groupHabitId = that.data.habitDetail.groupHabitId
            wx.switchTab({
                url: '../../posts/showPosts/showPosts',
            })
        }
    },

    deleteUpdateDatabase() {
        const that = this
        var creditsMinus
        var stage = that.data.habitDetail.stage
        if (stage == "观察期") { creditsMinus = 0 }
        else if (stage == "起步期") { creditsMinus = 10 }
        else if (stage == "养成期") { creditsMinus = 20 }
        else if (stage == "稳定期") { creditsMinus = 40 }
        var temp = that.data.habitDetail
        wx.cloud.database().collection('habits').where({
            _id: temp._id
        }).update({
            data: {
                state: "培养失败",
                endTime: formatTime(new Date())
            }
        })
        wx.cloud.database().collection('userInfos').where({
            _openid: that.data.openId
        }).update({
            data: {
                credits: wx.cloud.database().command.inc(-creditsMinus)
            },
        })
        wx.cloud.database().collection('groupHabits').doc(temp.groupHabitId).get({
            success(res) {
                if (res.data._openid == that.data.openId) {
                    wx.cloud.database().collection('groupHabits').doc(temp.groupHabitId).remove()
                    wx.cloud.callFunction({
                        name: "dissolutionGroup",
                        data: { groupHabitId: temp.groupHabitId }
                    })
                }
                else { wx.cloud.database().collection('habits').doc(temp._id).update({ data: { groupHabitId: "" } }) }
            }
        })
        wx.showToast({
            title: '培养失败！',
            icon: 'none',
            duration: 1500,
            mask: true,
            success() {
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1000)
            }
        })
    },
    delete: function () {
        const that = this
        var creditsMinus
        var stage = that.data.habitDetail.stage
        if (stage == "观察期") { creditsMinus = 0 }
        else if (stage == "起步期") { creditsMinus = 10 }
        else if (stage == "养成期") { creditsMinus = 20 }
        else if (stage == "稳定期") { creditsMinus = 40 }
        wx.showModal({
            title: "提示",
            content: "需扣除" + creditsMinus + "积分,确定放弃吗？",
            cancelColor: '#CDF46E',
            confirmColor: '#fc5959',
            success(res) {
                if (res.confirm) {
                    that.deleteUpdateDatabase()
                }
            }
        })
    },

    toPagenewPost: function () {
        wx.switchTab({
            url: '../../posts/showPosts/showPosts',
        })
    },

    remindOthers:function(e){
        var that = this
        var index = e.currentTarget.dataset.index
        wx.cloud.callFunction({
            name:"sendNotifications",
            data:{
                openId: that.data.memberHabitDetail[index]._openid,
                nickName: app.globalData.userInfo.nickName,
                habitName:that.data.habitDetail.name,
            },
            success(res){
                if(res.result.errCode==undefined){
                    wx.showToast({
                        title: '提醒成功',
                        icon:"success"
                    })   
                }
                else if(res.result.errCode==43101){
                    wx.showToast({
                      title: '对方授权不足',
                      icon:'error',
                      mask:true
                    })
                }
            }
        })
    },
    /**
     * 用于在中断或失败的情形下将页面上的提醒时间设回修改前
     */
    setBackRemindTime: function () {
        wx.cloud.database().collection('habits').doc(this.data.habitDetail._id).get()
            .then(result => {
                if (result.data.remindTime) {
                    this.setData({
                        ["habitDetail.remindTime"]: result.data.remindTime,
                        remindTime: result.data.remindTime,
                    })
                }
                else {
                    this.setData({
                        ["habitDetail.remindTime"]: "",
                        remindTime: "",
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    },
    // 用于阻止授权请求弹窗出来得比我的温馨提示还快，事实证明，完全没用。
    // blockPopUpWindow() {
    //     while (showPromptModal) { }
    // },
    /**
     * 点击返回按钮隐藏，并将提醒时间设回修改前
     */
    back: function () {
        this.setBackRemindTime()
        this.setData({
            showModal: false
        })
    },
    /**
     * 获取input输入值
     */
    wish_put: function (e) {
        this.setData({
            textV: e.detail.value
        })
    },

    closePromptModal: function () {
        this.setData({
            showPromptModal: false
        })
    },

    //   todo: 设置提醒时间
    bindTimeChange: function (e) {
        //用户自定义设置时间
        this.setData({
            time: e.detail.value,
            ["habitDetail.remindTime"]: e.detail.value,
            remindTime: e.detail.value,
            //显示弹窗
            showModal: true
        })
    },

    setRemindTime: function () {
        const that = this
        // 点击确定按钮获取input值并且关闭弹窗
        if (!that.data.textV) {
            wx.showToast({
                duration: 500,
                title: '输入不能为空!',
                icon: 'error',
                mask: true
            })
            return
        }
        else if (that.data.textV.length >= 20) {
            wx.showToast({
                duration: 500,
                title: '备注太长啦!',
                icon: 'error',
                mask: true
            })
            return
        }
        that.setData({
            showModal: false,
        })

        //授权请求
        const TEMPLATE_ID = 'n-qNHtl2sbZxWQStuj19B2ZhFLFWDFhyftyjqzmPHyM' //模板ID
        wx.getSetting({
            withSubscriptions: true,
            success(re) {
                console.log(re.authSetting)
                console.log(re.subscriptionsSetting)
                console.log(re.subscriptionsSetting[TEMPLATE_ID])
                if (typeof (re.subscriptionsSetting[TEMPLATE_ID]) == 'undefined' || re.subscriptionsSetting[TEMPLATE_ID] === 'accept') {//accept->总是允许，reject->总是拒绝，猜测undefined可以代表啥都没选的
                    //显示温馨提示弹窗
                    that.setData({
                        showPromptModal: true
                    })
                    // that.blockPopUpWindow()//懒得思考，出此下策。
                }
                else if (re.subscriptionsSetting[TEMPLATE_ID] === 'reject') {
                    that.setData({
                        isShowSetModal: true
                    })
                }
            }
        })
        if (wx.requestSubscribeMessage) {
            wx.requestSubscribeMessage({
                tmplIds: [TEMPLATE_ID],
                success(res) {
                    if (res[TEMPLATE_ID] === 'accept') {
                        //用户点击同意
                        //写进数据库
                        var temp = that.data.habitDetail
                        wx.cloud.database().collection('habits').doc(temp._id).update({
                            data: {
                                note: that.data.textV,
                                remindTime: that.data.remindTime
                            }
                        })
                            .then(() => wx.showToast({
                                title: '设置成功！',
                                icon: 'success',
                                mask: true,
                                duration: 2000,
                            })
                            )
                    } else if (res[TEMPLATE_ID] === 'reject') {
                        //用户点击拒绝
                        that.setBackRemindTime()
                        that.setData({
                            showPromptModal: false
                        })
                        wx.showToast({
                            title: '获取权限失败！',
                            icon: 'error',
                            mask: true,
                        })
                        //这个地方，有可能，因为前面写了那个用户授权判断的if-else，变成冗余了也说不定。
                        wx.getSetting({
                            withSubscriptions: true,
                            success(re) {
                                if (re.subscriptionsSetting[TEMPLATE_ID] !== 'accept') {
                                    //显示引导设置弹窗
                                    that.setData({
                                        isShowSetModal: true
                                    })
                                }
                            }
                        })
                    } else {
                        that.setBackRemindTime()
                        wx.showToast({
                            title: '授权订阅消息失败',
                            icon: 'none',
                            mask: true
                        })
                    }
                },
                fail(res) {
                    console.log(res.errCode)
                    that.setBackRemindTime()
                    //20004:用户关闭了主开关，无法进行订阅,引导开启
                    if (res.errCode == 20004) {
                        //显示引导设置弹窗
                        that.setData({
                            isShowSetModal: true
                        })
                    } else {
                        //其他错误信息码
                        wx.showModal({
                            title: '发生未知错误',
                            content: res.errMsg,
                            showCancel: false
                        })
                    }
                }
            });
        } else {
            that.setBackRemindTime()
            wx.showModal({
                //基础库2.4.4后才支持订阅模板消息
                title: '提示',
                content: '请更新您微信版本，来获取订阅消息功能',
                showCancel: false
            })
        }
    },

    checkSetting: function () {
        const TEMPLATE_ID = 'n-qNHtl2sbZxWQStuj19B2ZhFLFWDFhyftyjqzmPHyM' //模板ID
        wx.getSetting({
            withSubscriptions: true,
            success(re) {
                if (re.subscriptionsSetting[TEMPLATE_ID] !== 'accept') {
                    //继续显示引导设置弹窗
                    wx.showToast({
                        title: '授权失败！',
                        icon: "none",
                        mask: true
                    })
                }
                else {
                    this.setData({
                        isShowSetModal: false
                    })
                }
            }
        })
    },

    closeSetModal: function () {
        console.log(222)
        this.setData({
            isShowSetModal: false
        })
    },

    deleteRemindTime: function () {
        const that = this
        wx.showModal({
            title: "提示",
            content: "您要取消设置此提醒时间吗？",
            cancelColor: '#EBA13E',
            confirmColor: '#fc5959',
            success(res) {
                if (res.confirm) {
                    var temp = that.data.habitDetail
                    wx.cloud.database().collection('habits').doc(temp._id).update({
                        data: {
                            note: "",
                            remindTime: ""
                        }
                    })
                    that.setData({
                        remindTime: "",
                        ["habitDetail.remindTime"]: "",
                        time: "00:00"
                    })
                    wx.showToast({
                        title: '取消设置成功~',
                    })
                }
            }
        })
    },
    getChances(){
        const TEMPLATE_ID = 'BLLbYDcc4q2nGcjNkxVCZJl_ax6P2yUFRgfcQT2Vy8U'
        wx.requestSubscribeMessage({
          tmplIds: [TEMPLATE_ID],
          success(res){
              if(res[TEMPLATE_ID] === 'accept'){
                  wx.showToast({
                    title: '授权成功！',
                    icon:'success'
                  })
              }
              else if(res[TEMPLATE_ID] === 'reject'){
                wx.showToast({
                    title: '授权失败！',
                    icon:'error'
                  })
              }      
          }
        })
    },
    getCredits(openId) {
        const that = this
        return new Promise(function (resolve, reject) {
            wx.cloud.database().collection('userInfos').where({
                _openid: openId
            }).get({
                success(res) {
                    that.setData({
                        credits: res.data[0].credits
                    })
                    resolve(res.data[0].credits)
                }
            })
        })
    },

    async getAllCredits(data, dates) {
        const that = this
        var count = 0
        for (var temp of data) {
            temp.dakaOrNot = temp.lastDaka < dates ? false : true
            await that.getCredits(temp._openid).then(function (credits) {
                temp.credits = credits
            })
            if(temp._openid == that.data.openId){
                that.setData({
                    myIndex:count
                })
            }
            count++
        }
        that.setData({
            memberHabitDetail: data
        })
        wx.hideToast({
            success: (res) => { },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const that = this
        var dates = Daka(new Date());
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true
        })
        wx.cloud.database().collection('habits').doc(options.id).get({
            success(res) {
                that.setData({
                    habitDetail: res.data,
                    openId: app.globalData.openId,
                    canDaka: res.data.lastDaka < dates ? true : false,
                })
                if (newMonth(new Date())) {
                    wx.cloud.database().collection('habits').doc(options.id).update({
                        data: {
                            buqian: 2,
                            buqianDay: []
                        },
                        success(res) {
                            that.setData({
                                ["habitDetail.buqian"]: 2,
                                ["habitDetail.buqianDay"]: []
                            })
                        }
                    })
                }
                if (res.data.buqianDay.indexOf(DakaMinusOne(new Date())) == -1) {
                    if (dates - 2 == res.data.lastDaka) {
                        that.setData({
                            skipOne: true
                        })
                    }
                    else if (dates - 3 == res.data.lastDaka) {
                        that.setData({
                            skipTwo: true
                        })
                    }
                    else if (dates - 4 >= res.data.lastDaka) {
                        wx.showToast({
                            title: '连续三天未打卡',
                            icon: 'none',
                            duration: 2000,
                            mask: true,
                            success() {
                                setTimeout(function () {
                                    that.deleteUpdateDatabase()
                                }, 800)
                            }
                        })
                    }
                    if ((that.data.skipOne || that.data.skipTwo) && res.data.day!=0) {
                        wx.cloud.database().collection('habits').doc(options.id).update({
                            data: {
                                tempDay: res.data.day,
                                day: 0
                            },
                            success(re) {
                                console.log(res.data.day)
                                that.setData({
                                    ["habitDetail.tempDay"]: res.data.day,
                                    ["habitDetail.day"]: 0
                                })
                            }
                        })
                    }
                }
                wx.cloud.database().collection('habits').where({
                    groupHabitId: res.data.groupHabitId
                }).get({
                    success(re) {
                        that.setData({
                            memberNum: re.data.length - 1,
                        })
                        that.getAllCredits(re.data, dates)
                    }
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
    var that = this;
    if(that.data.memberNum>19){
        wx.showToast({
          title: '培养人数达上限',
          icon: 'error',
          mask:true
          })
    }
    else{
      return{
        title:'快来一起养成好习惯吧！',//todo
        path:'/pages/habits/invite/invite?groupHabitId='+that.data.habitDetail.groupHabitId,
    }
    }
  }
})
