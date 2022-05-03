// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-6guoviflb21d1dda'
})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        var date = new Date();
        var myTime = repair(date.getHours()) + ':' + repair(date.getMinutes());
        console.log(myTime);
        console.log(new Date());
        const msgs = await db.collection('habits').where({
            remindTime: myTime
        }).get();

        console.log(msgs)
        // 循环消息列表依次处理下发订阅操作
        const sendPromises = msgs.data.map(async res => {
            try {
                console.log(res)
                if (res.state !== '培养成功') {
                    //上次打卡年份，如果上次在12月而现在1月就-1
                    var year = res.lastDaka / 100 === 12 && date.getmonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
                    // 发送订阅消息
                    const result = await cloud.openapi.subscribeMessage.send({
                        // 接受当前模板消息的用户openid
                        touser: res._openid,
                        // 当前下发的模板ID，不可写多个，目前只支持一个
                        templateId: 'n-qNHtl2sbZxWQStuj19B2ZhFLFWDFhyftyjqzmPHyM',
                        // 点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。 
                        // page: 'index?foo=bar' 
                        page: 'pages/habits/showHabits/showHabits',
                        // 模板所需要的键值
                        data: {
                            // 计划名称
                            thing1: {
                                value: res.name
                            },
                            // 上次打卡时间 
                            time4: {
                                value: year + '年' + parseInt(res.lastDaka / 100) + '月' + res.lastDaka % 100 + '日'
                            },
                            // 备注
                            thing3: {
                                value: res.note
                            },
                            // 完成进度
                            thing2: {
                                value: res.day + ' / 90 天'
                            },
                        }
                    })
                    return result;
                }
            } catch (e) {
                console.log(e);
                return e;
            }
        });
        return Promise.all(sendPromises);
    } catch (err) {
        console.log(err);
        return err;
    }

    function repair(i) {
        return (i >= 0 && i <= 9) ? '0' + i : i;
    }
}
