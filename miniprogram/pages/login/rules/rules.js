// pages/login/rules/rules.js

// 规则应当直接卸载 JavaScript 的数据内，直接填写html 代码即可
const htmlSnip = `
    <p>一：打卡</p>
    <ol start=''>
        <li>观察期：+1</li>
        <li>起步期：+3</li>
        <li>养成期：+5</li>
        <li>稳定期：+8</li>

    </ol>
    <p>二： 补打卡</p>
    <ol start=''>
        <li>每月有两次补打卡机会，每次补打卡扣除 12 积分</li>

    </ol>
    <p>三： 删除习惯</p>
    <ol start=''>
        <li>观察期或者起步期删除习惯扣除 15 积分</li>
        <li>养成期或者稳定期删除习惯扣除 25 积分</li>

    </ol>
    <p>四：连续打卡 90 天，即认为培养成功，将该习惯纳入培养成功系列</p>
    <p>五：可花费 100 积分烧出一条培养失败的习惯记录</p>
    <p>六：组队习惯可以设置积分池，当天未打卡的成员将扣除 <mjx-container class="MathJax" jax="SVG" style="position: relative;"><svg
                xmlns="http://www.w3.org/2000/svg" width="15.528ex" height="2.262ex" role="img" focusable="false"
                viewBox="0 -750 6863.2 1000" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                style="vertical-align: -0.566ex;">
                <defs>
                    <path id="MJX-2-TEX-N-31"
                        d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z">
                    </path>
                    <path id="MJX-2-TEX-N-30"
                        d="M96 585Q152 666 249 666Q297 666 345 640T423 548Q460 465 460 320Q460 165 417 83Q397 41 362 16T301 -15T250 -22Q224 -22 198 -16T137 16T82 83Q39 165 39 320Q39 494 96 585ZM321 597Q291 629 250 629Q208 629 178 597Q153 571 145 525T137 333Q137 175 145 125T181 46Q209 16 250 16Q290 16 318 46Q347 76 354 130T362 333Q362 478 354 524T321 597Z">
                    </path>
                    <path id="MJX-2-TEX-N-2F"
                        d="M423 750Q432 750 438 744T444 730Q444 725 271 248T92 -240Q85 -250 75 -250Q68 -250 62 -245T56 -231Q56 -221 230 257T407 740Q411 750 423 750Z">
                    </path>
                    <path id="MJX-2-TEX-N-2217"
                        d="M229 286Q216 420 216 436Q216 454 240 464Q241 464 245 464T251 465Q263 464 273 456T283 436Q283 419 277 356T270 286L328 328Q384 369 389 372T399 375Q412 375 423 365T435 338Q435 325 425 315Q420 312 357 282T289 250L355 219L425 184Q434 175 434 161Q434 146 425 136T401 125Q393 125 383 131T328 171L270 213Q283 79 283 63Q283 53 276 44T250 35Q231 35 224 44T216 63Q216 80 222 143T229 213L171 171Q115 130 110 127Q106 124 100 124Q87 124 76 134T64 161Q64 166 64 169T67 175T72 181T81 188T94 195T113 204T138 215T170 230T210 250L74 315Q65 324 65 338Q65 353 74 363T98 374Q106 374 116 368T171 328L229 286Z">
                    </path>
                </defs>
                <g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)">
                    <g data-mml-node="math">
                        <g data-mml-node="mn">
                            <use data-c="31" xlink:href="#MJX-2-TEX-N-31"></use>
                            <use data-c="30" xlink:href="#MJX-2-TEX-N-30" transform="translate(500,0)"></use>
                        </g>
                        <g data-mml-node="mtext" transform="translate(1000,0)"><text data-variant="normal"
                                transform="scale(1,-1)" font-size="884px" font-family="serif">积</text></g>
                        <g data-mml-node="mtext" transform="translate(1883.8,0)"><text data-variant="normal"
                                transform="scale(1,-1)" font-size="884px" font-family="serif">分</text></g>
                        <g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(2767.5,0)">
                            <g data-mml-node="mo">
                                <use data-c="2F" xlink:href="#MJX-2-TEX-N-2F"></use>
                            </g>
                        </g>
                        <g data-mml-node="mtext" transform="translate(3267.5,0)"><text data-variant="normal"
                                transform="scale(1,-1)" font-size="884px" font-family="serif">成</text></g>
                        <g data-mml-node="mtext" transform="translate(4151.3,0)"><text data-variant="normal"
                                transform="scale(1,-1)" font-size="884px" font-family="serif">员</text></g>
                        <g data-mml-node="mo" transform="translate(5257.2,0)">
                            <use data-c="2217" xlink:href="#MJX-2-TEX-N-2217"></use>
                        </g>
                        <g data-mml-node="mtext" transform="translate(5979.4,0)"><text data-variant="normal"
                                transform="scale(1,-1)" font-size="884px" font-family="serif">日</text></g>
                    </g>
                </g>
            </svg></mjx-container>
        <script type="math/tex">10 积分/成员*日</script> ，存入积分池的积分待培养成功即可领取
    </p>
    <p>七：连续三天未打卡视作培养失败</p>
    <p>八：连续两天未打卡，会发送推送消息列入预警</p>
    <p>九：允许用户因为不可抗力的原因跳过一天</p>
    <p>十：若组队习惯培养失败，可以支付20积分，立即重新开始</p>
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