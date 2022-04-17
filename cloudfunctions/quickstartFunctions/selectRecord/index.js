const cloud = require('wx-server-sdk');

cloud.init({
  env: 'cloud1-6guoviflb21d1dda'
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  await db.collection('habits').where({
    _openid:event.openId
  }).get({
    success(res){
      return{
        habits:res.data
      }
    }
  });
};
