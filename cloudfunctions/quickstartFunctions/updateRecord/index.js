const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(3)
    await db.collection('dongtai').where({
      _openid:event.openId
    })
    .update({
      nickName:111,
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
};
