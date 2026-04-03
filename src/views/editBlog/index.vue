<template>
    <div class="app-container">
        <div class="block">文章标题</div>
        <div style="margin-bottom: 15px;">
            <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
        </div>

        <div class="block">文章编辑</div>
        <template>
            <Editor
                ref="toastuiEditor"
                :initialValue="form.editorText"
                height="600px"
            />
        </template>
        <div class="block">文章描述</div>
        <el-input type="textarea" v-model="form.description" :rows="6"></el-input>

        <div class="upload">
            <Upload v-model="form.thumb" uploadTitle="文章头图"/>
        </div>
        
        <div class="block">选择分类</div>
        <el-select v-model="form.select" slot="prepend" placeholder="请选择" @change="changeHandle" >
            <el-option 
                v-for="item in blogType" 
                :key="item.id" 
                :label="item.name" 
                :value="item.id"
                placeholder="请选择文章分类"
            >
            </el-option>
        </el-select>
        <el-button type="primary" @click="editArticle">确认修改</el-button>
    </div>
</template>

<script>
    import '@toast-ui/editor/dist/toastui-editor.css';
    import { Editor } from '@toast-ui/vue-editor';
    import Upload from '@/components/Upload.vue';
    import { getBlogTypeApi } from '@/api/blogType'
    import { editBlog, findOneBlog } from '@/api/blog';

    export default {
        components: {
            Editor,
            Upload
        },
        data () {
            return {
                id: null,
                form: {
                    title: '',
                    editorText: '',
                    description: '', // 文章描述
                    thumb: '', // 文章图片
                    select: '' // 选择分类
                },
                blogType: [],
                imageUrl: ''
            }
        },
        async created () {
            const res = await getBlogTypeApi();
            this.blogType = res.data;

            this.id = this.$route.params.id;
            const { data } = await findOneBlog(this.id);
            this.form = data;
            this.form.select = data.category === null ? '' : data.category.id;
            this.$refs.toastuiEditor.invoke('setHTML', data.htmlContent);
        },
        methods: {
            async editArticle () {
                let html = this.$refs.toastuiEditor.invoke('getHTML');
                let markdown = this.$refs.toastuiEditor.invoke('getMarkdown');
                
                let obj = {
                    title: this.form.title,
                    description: this.form.description,
                    createDate: new Date().getTime(),
                    categoryId: this.form.select,
                    // toc 传递一个空数组过去，之后在服务器根据 markdown 的内容来生成 toc 目录
                    toc: [],
                    htmlContent: html,
                    thumb: this.form.thumb,
                    markdownContent : markdown
                }
                if (obj.title && obj.description && obj.htmlContent && obj.categoryId) {
                    const payload = {
                        id: this.form.id,
                        ...obj
                    }
                    const res = await editBlog(payload);
                    if (!res.code) {
                        this.$router.push('/blogList');
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: `${res.code}错误`
                        });
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: '请填写必要内容'
                    });
                }
            },
            changeHandle () {
                this.$forceUpdate();
            }
        }
    }
</script>

<style scoped lang="scss">
    .block {
        margin: 15px 0;
        font-weight: 100;
    }
    .upload {
        width: 178px;
        height: 208px;
    }
</style>