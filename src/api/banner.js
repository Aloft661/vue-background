import request from "@/utils/request";

// 获取首页标语
export function getBanner () {
    return request({
        url: '/api/banner',
        method: 'GET'
    });
}

// 设置首页标语
export function setBanner (data) {
    return request({
        url: '/api/banner',
        method: 'POST',
        data
    })
}