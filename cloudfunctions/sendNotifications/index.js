// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-6guoviflb21d1dda'
})

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const result = await cloud.openapi.subscribeMessage.send({
        touser:event.openId,
        templateId:'BLLbYDcc4q2nGcjNkxVCZJl_ax6P2yUFRgfcQT2Vy8U',
        page:'pages/habits/showHabits/showHabits',
        data:{
            name6:{
                value:event.nickName
            },
            thing1:{
                value:event.habitName
            },
            thing21:{
                value:"好友提醒您今天打卡哦！"
            }
        }
        })
        console.log(result)
        setTimeout(600)
        return result;
    } catch (err) {
        console.log(err);
        return err;
    }
}
