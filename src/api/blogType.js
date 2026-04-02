import request from '@/utils/request';

// 查看文章分类
export function getBlogTypeApi () {
    return request({
        url: '/api/blogtype',
        method: 'GET'
    });
}

// 添加文章分类
export function addBlogTypeApi (data) {
    return request({
        url: '/api/blogtype',
        method: 'POST',
        data
    });
}

// 删除文章分类
export function delBlogTypeApi (id) {
    return request({
        url: `/api/blogtype/${id}`,
        method: 'DELETE'
    });
}

// 查找某一个文章分类
export function findOneBlogType (id) {
    return request({
        url: `/api/blogtype/${id}`,
        method: 'GET'
    });
}

// 更新某一个文章分类
export function updateOneBlogType (editInfo) {
    return request({
        url: `/api/blogtype/${editInfo.id}`,
        method: 'PUT',
        data: editInfo.data
    });
}