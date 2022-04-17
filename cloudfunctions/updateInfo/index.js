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
        await db.collection('dongtai').where({
          _openid:cloud.getWXContext().OPENID
        }).update({
            data:{
                nickName:event.nickName,
                avatar:event.avatarUrl
            },
        })
        await db.collection('habits').where({
          _openid:cloud.getWXContext().OPENID
        }).update({
          data:{
            nickName:event.nickName,
            avatar:event.avatarUrl
          }
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