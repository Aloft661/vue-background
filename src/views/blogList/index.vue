<template>
    <div class="app-container">
        <el-table :data="data" style="width: 100%" border>
            <el-table-column label="序号" width="60" align="center">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="title" width="150" label="文章名称" align="center">
                <template slot-scope="scope">
                    <el-popover 
                        placement="top-start" 
                        title="博客预览图" 
                        width="230" 
                        trigger="hover"
                    >
                        <el-image 
                            style="width: 200px" 
                            :src="scope.row.thumb" 
                            fit="contain"
                            :preview-src-list="srcList"
                        >
                        </el-image>
                        <a 
                            href="#" 
                            target="_blank" 
                            @click.prevent="goToTitleHandle(scope.row)" 
                            slot="reference"
                        >
                            {{scope.row.title }}
                        </a>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="description" width="150" label="文章描述" align="center">
                <template slot-scope="">
                </template>
            </el-table-column>
            <el-table-column prop="scanNumber" width="150" label="浏览数" align="center">
                <template slot-scope="">
                </template>
            </el-table-column>
            <el-table-column prop="commentNumber" width="150" label="评论量" align="center">
                <template slot-scope="">
                </template>
            </el-table-column>
            <el-table-column width="150" label="所属分类" align="center">
                <template slot-scope="scope">
                    {{ scope.row.category === null ? '未分类' : scope.row.category.name  }}
                </template>
            </el-table-column>
            <el-table-column prop="createDate" width="230" label="创建日期" align="center">
                <template slot-scope="scope">
                    {{ scope.row.createDate }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="2000">
                        <el-button type="primary" circle size="mini" icon="el-icon-edit" @click="editBlog(scope.row)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="2000">
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="delBlog(scope.row)">
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 30px"
            background
            :page-size="eachPage"
            :page-sizes="[5, 10, 20]"
            layout="prev, pager, next, total, ->, sizes, jumper"
            :total="count"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            @prev-click="prevClickHandle"
            @next-click="nextClickHandle"
        >
        </el-pagination>
    </div>
</template>

<script>
    import { findBlog, delOneBlog } from '@/api/blog';
    import { formatDate } from '@/utils/tools';
    import { server_URL, frontEnd_URL } from '@/UrlConfig';
    export default {
        data() {
            return {
                data: [],
                srcList: [], // 预览图链接数组
                eachPage: 5, // 每一页显示的条数
                currentPage: 1, // 当前页码，默认进来是第一页
                totalPage: 0, // 总页数
                count: 0, // 数据总条数
            }
        },
        async created() {
            await this.fetchData();
        },
        methods: {
            async fetchData() {
                const res = await findBlog(this.currentPage, this.eachPage);
                this.data = res.data.rows.map((item => ({
                    ...item,
                    createDate: formatDate(item.createDate),
                    thumb: server_URL + item.thumb
                })));
                this.count = res.data.total;
                this.totalPage = Math.ceil(this.count / this.eachPage);
                if (this.currentPage > this.totalPage) {
                    this.currentPage = this.totalPage;
                    this.fetchData();
                 }
            },
            goToTitleHandle(blogInfo) {
                window.open(`${frontEnd_URL}/article/${blogInfo.id}`);
            },
            async delBlog (blogInfo) {
                try {
                    await this.$confirm(
                        "删除该文章会将该文章下面的评论一并删除，是否继续?",
                        "是否删除此篇文章",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }
                    );
                } catch (e) {
                    // 用户点取消，不删
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                    return;
                }
                
                try {
                    const res = await delOneBlog(blogInfo.id);
                    if (!res.code) {
                        await this.fetchData();
                        this.$message({
                            type: "success",
                            message: "删除成功"
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: "删除失败,请联系相关人员"
                        })
                    }
                } catch (e) {
                    this.$message({
                        type: "error",
                        message: "网络错误"
                    })
                }
            },
            editBlog (blogInfo) {
                this.$router.push(`/editBlog/${blogInfo.id}`);
            },
            sizeChangeHandle (pagerNum) {
                this.eachPage = parseInt(pagerNum);
                this.currentPage = 1;
                this.fetchData();
            },
            currentChangeHandle (pageNum) {
                this.currentPage = parseInt(pageNum);
                this.fetchData();
            },
            prevClickHandle () {
                this.currentPage -= 1;
            },
            nextClickHandle () {
                this.currentPage += 1;
            },
        }
    }
</script>

<style></style>