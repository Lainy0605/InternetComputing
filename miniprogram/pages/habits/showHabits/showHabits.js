const HABITS = wx.cloud.database().collection('habits')
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        habits: [],
        setHabits:false,
        refresh:true,
        index:"",
        Mstart:0
    },

    tonewHabit:function(){
        wx.navigateTo({
          url: '../newHabit/newHabit',
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
    delete:function(e){
        var index=e.currentTarget.dataset.index

        HABITS.where({
            _id:this.data.habits[index]._id
        }).remove({})
        this.data.habits.splice(index,1)
        this.setData({
            habits:this.data.habits
        })
        app.globalData.habits=this.data.habits
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showToast({
          title: '加载中',
          icon:'loading'
        })
        const that = this
        wx.cloud.callFunction({
            name:"getOpenId",
            success(res){
                app.globalData.openId = res.result.openid
                HABITS.where({
                    _openid:res.result.openid
                })
                .get({
                    success(re){
                        for(var habit of re.data){
                            habit.offset=0;
                        }
                        that.setData({
                            habits:re.data,
                            setHabits:true,
                        })
                        app.globalData.habits = that.data.habits                   
                        wx.hideToast({
                          success: (res) => {},
                        })
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
        wx.showToast({
          title: '加载中',
          icon:'loading'
        })
        this.setData({
            refresh:true,
            habits:app.globalData.habits
        })
        wx.hideToast({
          success: (res) => {},
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            refresh:false
        })
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