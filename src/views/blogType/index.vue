<template>
    <div class="app-container">
        <div style="margin-top: 15px;">
            <el-input 
                placeholder="请输入要添加的分类,左边选择该分类的等级" 
                v-model="input" 
                class="input-with-select blogAndInput"
            >
                <el-select v-model="select" slot="prepend" placeholder="请选择">
                    <el-option label="1" value="1"></el-option>
                    <el-option label="2" value="2"></el-option>
                    <el-option label="3" value="3"></el-option>
                    <el-option label="4" value="3"></el-option>
                    <el-option label="5" value="3"></el-option>
                </el-select>
            </el-input>
            <el-button 
                type="primary" 
                style="margin-left: 10px;" 
                @click="addBlogType"
            >
                添加
            </el-button>
        </div>
        <el-table :data="data" style="width: 100%" border>
            <el-table-column label="序号" width="60" align="center">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="博客类别" align="center">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column label="文章数量" align="center">
                <template slot-scope="scope">
                    {{ scope.row.articleCount }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                    <el-tooltip 
                        class="item" 
                        effect="dark" 
                        content="编辑" 
                        placement="top" 
                        :hide-after="2000"
                    >
                        <el-button 
                            type="primary" 
                            circle 
                            size="mini" 
                            icon="el-icon-edit" 
                            @click="editBlogType(scope.row)"
                        >
                        </el-button>
                    </el-tooltip>
                    <el-tooltip 
                        class="item" 
                        effect="dark" 
                        content="删除" 
                        placement="top" 
                        :hide-after="2000"
                    >
                        <el-button 
                            type="danger" 
                            circle 
                            size="mini" 
                            icon="el-icon-delete" 
                            @click="delBlogType(scope.row)"
                        >
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="编辑文章分类" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="分类名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="排序等级">
                    <el-select v-model="form.order" placeholder="分类等级">
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBlogType">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getBlogTypeApi,
        addBlogTypeApi,
        delBlogTypeApi,
        updateOneBlogType,
        findOneBlogType
    } from '@/api/blogType';
    export default {
        data() {
            return {
                data: [],
                input: '',
                select: '1',
                dialogFormVisible: false,
                form: {
                    name: '',
                    order: ''
                }
            }
        },
        async created() {
            await this.fetchData();
        },
        methods: {
            async fetchData() {
                try {
                    const res = await getBlogTypeApi();
                    this.data = res.data;   
                } catch (e) {
                    this.$message({
                        type: 'error',
                        message: '网络错误'
                    });
                }
            },
            async addBlogType () {
                if (this.input.length > 0) {
                    try {
                        const res = await addBlogTypeApi({ 
                            name: this.input, 
                            order: this.select 
                        });
                        if (!res.code) {
                            await this.fetchData();
                            this.$message({
                                type: 'success',
                                message: '添加分类成功'
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: '添加分类失败,请联系相关人员'
                            });
                        }
                    } catch (e) {
                        this.$message({
                            type: 'error',
                            message: '网络错误'
                        })
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: '分类名称不能为空'
                    });
                }
            },
            async editBlogType ({ id }) {
                const res = await findOneBlogType(id);
                this.form = res.data;
                this.dialogFormVisible = true;
            },
            async confirmBlogType () {
                await updateOneBlogType({
                    id: this.form.id,
                    data: this.form
                });
                await this.fetchData();
                this.$message({
                    type: 'success',
                    message: '更新分类成功'
                });
                this.dialogFormVisible = false;
            },
            async delBlogType ({ id }) {
                try {
                    await this.$confirm(
                        "删除该分类后,该分类下面的所以文章将变为未分类状态,是否继续?",
                        "是否删除此文章分类",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: '取消',
                            type: "warning"
                        }
                    );
                } catch (e) {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                    return;
                }
                
                try {
                    const res = await delBlogTypeApi(id);
                    if (!res.code) {
                        await this.fetchData();
                        await this.$message({
                            type: "success",
                            message: "删除成功"
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: "删除失败,请联系相关人员"
                        });
                    }
                } catch (e) {
                    this.$message({
                        type: "error",
                        message: "网络错误"
                    });
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .blogAndInput {
        width: 400px;
        margin-bottom: 20px;
    }
</style>