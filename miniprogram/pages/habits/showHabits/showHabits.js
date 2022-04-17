const HABITS = wx.cloud.database().collection('habits')
var app = getApp()
var period;
Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        habits: [],
        openId:"",
        index:"",
        Mstart:0,
    },

    tonewHabit:function(){
        wx.navigateTo({
          url: '../newHabit/newHabit',
          success:function(res){}
        })
    },
    
    toHabitDetail:function(e){
        var temp = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '../habitDetail/habitDetail?index='+temp,
            success:function(res){}
        })
    },

    touchStart:function(e){
        this.setData({
            index: e.currentTarget.dataset.index,
            Mstart: e.changedTouches[0].pageX
        })
    },
    touchMove:function(e){
        let list = this.data.habits;
        let move = this.data.Mstart-e.changedTouches[0].pageX;
        list[this.data.index].offset = move > 0 ? -move : 0;
        this.setData({
            habits:list
        })
    },
    touchEnd:function(e){
        let list = this.data.habits;
        let move = this.data.Mstart-e.changedTouches[0].pageX;
        list[this.data.index].offset = move >100 ? -180:0;
        this.setData({
            habits:list
        })
    },

    getHabits(){
        const that = this
        return new Promise(function(resolve,reject){
            wx.cloud.database().collection('habits').where({
                _openid:app.globalData.openId
            }).get({
                success(res){
                    // for(var habit of res.data){
                    //     var temp = habit.day
                    //     var temp2 = "";    
                    //     if(temp>=0 && temp<=3){temp2="观察期"}
                    //     else if(temp>=4 && temp<=7){temp2="起步期"}
                    //     else if(temp>=8 && temp<=21){temp2="养成期"}
                    //     else if(temp>=22 && temp<=90){temp2="稳定期"}
                    //     habit.stage=temp2
                    // }
                    that.setData({
                        habits:res.data,
                    })
                    app.globalData.habits = res.data
                    resolve('success')
                }
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
   async  onLoad() {
        wx.showToast({
          title: '加载中',
          icon:'loading'
        })
        if(app.globalData.openId){
            await this.getHabits()
            this.setData({
                login:true,
                openId:app.globalData.openId
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
                this.setData({
                    habits:app.globalData.habits
                })
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