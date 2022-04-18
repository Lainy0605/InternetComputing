// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env:'cloud1-6guoviflb21d1dda'
}
)
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        await db.collection('habits').where({
            groupHabitId:event.groupHabitId
        }).update({
            data:{
                groupHabitId:""
            },
        })
        return {
          success: true,
        };
      } catch (e) {
        return {
          success: false,
          errMsg: e
        };
      }
}