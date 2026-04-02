<template>
    <div class="app-container">
        <el-table :data="data" style="width: 100%" border>
            <el-table-column label="序号" width="60" align="center">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" width="150" align="center">
                <template slot-scope="">
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述">
                <template slot-scope="">
                </template>
            </el-table-column>
            <el-table-column label="中图预览" align="center">
                <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.midImgUrl"
                    >
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column label="大图预览" align="center">
                <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.bigImgUrl"
                    >
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
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
                            circle size="mini" 
                            icon="el-icon-edit"
                            @click="editBanner(scope.row)"    
                        >
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="请编辑信息" :visible.sync="dialogFormVisible" top="5vh">
            <el-form :model="form">
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" type="textarea" autosize></el-input>
                </el-form-item>
                <el-row type="flex" justify="center">
                    <!-- 中图 -->
                    <el-col :span="12">
                        <el-form-item label="首页中图" class="upload">
                            <Upload v-model="form.midImg" />
                        </el-form-item>
                    </el-col>
                    <!-- 大图 -->
                    <el-col :span="12">
                        <el-form-item label="首页大图" class="upload">
                            <Upload v-model="form.bigImg" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="editBannerConfirm">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getBanner, setBanner } from '@/api/banner';
    import { server_URL } from '@/UrlConfig';
    import Upload from '@/components/Upload.vue';

    export default {
        components: {
            Upload
        },
        data() {
            return {
                data: [],
                dialogFormVisible: false,
                form: {
                    id: '',
                    midImg: '',
                    bigImg: '',
                    title: '',
                    description: ''
                },
            }
        },

        async created() {
            await this.fetchData();
        },

        methods: {
            async fetchData() {
                const res = await getBanner();
                this.data = res.data;
                this.data = this.data.map(item => ({
                    ...item,
                    bigImgUrl: server_URL + item.bigImg,
                    midImgUrl: server_URL + item.midImg
                }));
                console.log(this.data);
                
            },
            editBanner (bannerInfo) {
                console.log(bannerInfo);
                
                this.form = { ...bannerInfo };
                this.dialogFormVisible = true;
            },
            async editBannerConfirm () {
                let arr = [...this.data];
                arr = arr.map(item => {
                    if (item.id === this.form.id) {
                        return this.form
                    }
                    return item;
                });
                try {
                    const res = await setBanner(arr);
                    if (res.code === 0) {
                        this.dialogFormVisible = false;
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.fetchData();
                    }
                } catch (e) {
                    this.$message({
                        message: '网络错误',
                        type: 'error'
                    });
                }
            }
        }
    }
    </script>

<style scoped lang="scss">
    .upload {
        display: flex;
        justify-content: center;
    }
</style>