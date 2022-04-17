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
        return await db.collection('habits').where({
            _openid:cloud.getWXContext().OPENID
        }).get()
      } catch (e) {
        return {
          success: false,
          errMsg: e
        };
      }
}