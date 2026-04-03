import request from '@/utils/request'

// 分页获取文章
// page 代表页码数，limit 代表每一页显示的数量
export function findBlog (page=1, limit=10) {
    return request({
        url : '/api/blog',
        method : 'GET',
        params : {
            page,
            limit
        }
    });
}

// 删除文章
export function delOneBlog(id) {
    return request({
        url : `/api/blog/${id}`,
        method : 'delete'
    })
}

// 添加文章
export function addBlog (data) {
    return request({
        url: '/api/blog',
        method: 'POST',
        data
    });
}

// 编辑文章
export function editBlog (blogInfo) {
    return request({
        url: `/api/blog/${blogInfo.id}`,
        method: 'PUT',
        data: blogInfo
    });
}

// 根据id查找某一篇文章
export function findOneBlog (id) {
    return request({
        url: `/api/blog/${id}`,
        method: 'GET'
    });
}