const HABITS = wx.cloud.database().collection('habits')
var app = getApp()
var period;
Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        habits: [],
        setHabits:false, //判断是否将习惯初始化
        login:false, //判断是否登录
        index:"",
        Mstart:0
    },

    tonewHabit:function(){
        wx.navigateTo({
          url: '../newHabit/newHabit',
          success:function(res){}
        })
    },
    toHabitDetail:function(e){
        var temp = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../habitDetail/habitDetail?id='+temp,
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
        if(app.globalData.openId){
            console.log(app.globalData.openId)
            wx.showToast({
                title: '加载中',
                icon:'loading'
              })
              const that = this
            HABITS.where({
                _openid:app.globalData.openId
            })
            .get({
                success(res){
                    for(var habit of res.data){
                        habit.offset = 0
                    }
                    that.setData({
                        habits:res.data,
                        setHabits:true,
                        login:true
                    })
                    app.globalData.habits = that.data.habits                   
                    wx.hideToast({
                      success: (res) => {},
                    })
                }
            })
        }
        else{
            wx.showToast({
              title: '未登录',
              icon:'error'
            })
        }
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
        if(!this.data.login){
            this.onLoad()
        }
        else{
            this.setData({
                habits:app.globalData.habits
            })
        }
        wx.hideToast({
            success: (res) => {},
        })
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