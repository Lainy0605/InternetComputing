const formatTime = date => {
    const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
    
      return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute].map(formatNumber).join(':')}`
}
const milisecond = date => {
    const year = date.getFullYear()
      const month = date.getMonth() -1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
    
    if (0 >= (month)){    /**//* 1..12 -> 11,12,1..10 */
        month += 12;      /**//* Puts Feb last since it has leap day */
        year -= 1;
    }
    var nowDate = (((
        (parseInt(year/4) - parseInt(year/100) + parseInt(year/400) + parseInt(367*month/12) + day) +
        year*365 - 719499
     )*24 + hour /**//* now have hours */
  )*60 + minute /**//* now have minutes */
)*60 + second; /**//* finally seconds */
    // console.log(nowDate)   
    return nowDate-nowDate%(24*60*60);
}
const milisecondLast = date => {
    const year = date.getFullYear()
      const month = date.getMonth() -1
      const day = date.getDate()-1
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
    
    if (0 >= (month)){    /**//* 1..12 -> 11,12,1..10 */
        month += 12;      /**//* Puts Feb last since it has leap day */
        year -= 1;
    }
    var nowDate = (((
        (parseInt(year/4) - parseInt(year/100) + parseInt(year/400) + parseInt(367*month/12) + day) +
        year*365 - 719499
     )*24 + hour /**//* now have hours */
  )*60 + minute /**//* now have minutes */
)*60 + second; /**//* finally seconds */
    // console.log(nowDate)   
    return nowDate-nowDate%(24*60*60);
}
    
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

const Buttonclicked = self =>{
    self.setData({
        clicked:true
    })
    setTimeout(function(){
        self.setData({
            clicked:false
        })
    },600)
}


module.exports = {
    formatTime:formatTime,
    Buttonclicked:Buttonclicked,
    milisecond:milisecond,
    milisecondLast:milisecondLast
}
