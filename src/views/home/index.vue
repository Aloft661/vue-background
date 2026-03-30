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
                        :src="scope.row.midImg"
                    >
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column label="大图预览" align="center">
                <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.bigImg"
                    >
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <el-tooltip 
                    class="item" 
                    effect="dark" 
                    content="编辑" 
                    placement="top"
                    :hide-after="2000"
                >
                    <el-button type="primary" circle size="mini" icon="el-icon-edit"></el-button>
                </el-tooltip>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { getBanner } from '@/api/banner';
    import { server_URL } from '@/UrlConfig';
    export default {
        data() {
            return {
                data: [],
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
                    bigImg: server_URL + item.bigImg,
                    midImg: server_URL + item.midImg
                }));
                console.log(this.data);
            },
        }
    }
    </script>

<style scoped lang="scss"></style>