// pages/login/rules/rules.js

// 规则应当直接写在 JavaScript 的数据内，直接填写html 代码即可
const htmlSnip = `
    <p>1.培养习惯</p>
    <ol start=''>
        <li>观察期：+1积分</li>
        <li>起步期：+3积分</li>
        <li>养成期：+5积分</li>
        <li>稳定期：+8积分</li>
    </ol>
    <p>二： 补打卡</p>
    <ol start=''>
        <li>每月可补打卡两次，每次补打卡 -20 积分</li>
    </ol>
    <p>三： 放弃培养</p>
    <ol start=''>
        <li>观察期：-0积分</li>
        <li>起步期：-10积分</li>
        <li>养成期：-20积分</li>
        <li>稳定期：-40积分</li>
    </ol>
    <p>四：连续打卡 90 天，即认为培养成功，将该习惯纳入培养成功系列</p>
    <p>五：可花费 50 积分删除一条培养失败的习惯记录</p>
    <p>七：连续三天未打卡视作培养失败</p>
    <p>八：连续两天未打卡，会发送推送消息列入预警</p>
    <p>九：允许用户因为不可抗力的原因跳过一天</p>
    <p>&nbsp;</p>
`

Page({
    /**
     * 页面的初始数据
     */
      data: {
          htmlSnip,
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