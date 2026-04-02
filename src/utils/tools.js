// 工具函数库
/**
 * 
 * @param {Number} dateStr 时间戳
 */
function getWeekDay (dateStr) {
    const date = new Date(dateStr).getDay();
    const weekDays = ['星期天' ,'星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    return weekDays[date];
}
/**
 * 
 * @param {String} timestamp 时间戳
 */
export function formatDate (timestamp) {
    const date = new Date(+timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    let str = `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second} ${getWeekDay(date)}`;

    return str;
}
