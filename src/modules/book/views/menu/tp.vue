<template>
    <div class="menu">
        <div class="tree scroll">
            <el-button type="primary" @click="handleAdd">添加目录</el-button>
            <el-button @click="handleBack">返回列表</el-button>
            <div class="d"></div>
            <el-tree :data="menu" @node-click="handleNodeClick">
            </el-tree>
        </div>
        <div class="images">
            <el-form :model="form" ref="form" :rules="rules" label-width="120px" size="small">
                <el-form-item label="名称" prop="label">
                    <el-input v-model="form.label" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="拍摄者" prop="generateName">
                    <el-input v-model="form.generateName" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="拍摄地" prop="place">
                    <el-input v-model="form.place" placeholder="请输入" clearable></el-input>
                </el-form-item>

                <el-form-item label="拍摄时间" prop="photoTime">
                    <el-date-picker v-model="form.photoTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="内容" prop="urla">
                    <Upload url="/localUpload" v-model="form.urla" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ajax } from '@/api/ajax';
import { change, blur } from 'tqr'

import Upload from './upload.vue'
export default {
    name: "Menu",
    props: {
        book: {
            type: Object,
            default: () => ({ id: null })
        }
    },
    components: {
        Upload
    },
    data() {
        return {
            menu: [],
            form: {
                bookId: null,
                id: null,
                label: '',
                generateName: '',
                photoTime: '',
                place: '',
                sort: '',
                urla: [],
                urls: ""
            },
            initFomr: {

            },
            rules: {
                label: blur,
                urla: change
            }
        }
    },
    created() {
        const { id } = this.book
        this.form.bookId = id;
        this.initFomr = JSON.parse(JSON.stringify(this.form))
        this.getMenu(id)
    },
    mounted() {

    },
    methods: {
        getMenu(id) {
            this.$global.loading = true
            ajax({
                url: '/directoryImage/' + id,
                data: {
                    bookId: id
                }
            }).then(({ data }) => {
                const { list } = data;
                this.menu = list
            }).finally(() => {
                this.$global.loading = false
            })
        },
        handleAdd() {
            this.form = JSON.parse(JSON.stringify(this.initFomr))
        },

        handleNodeClick(data, node) {
            const { isLeaf } = node;
            if (isLeaf) {
                const { urls } = data
                this.form = { ...data, urla: urls ? urls.split(',').map(i => ({ filePath: i })) : [] }
            }
        },
        handleSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const { bookId, id, urla } = this.form
                    const data = {
                        ...this.form,
                        urls: urla.map(({ filePath }) => filePath).join(',')
                    };
                    this.$global.loading = true;
                    ajax({
                        url: '/directoryImage',
                        method: id ? "put" : 'post',
                        data
                    })
                        .then((res) => {
                            this.$notify.success('成功')
                            this.getMenu(bookId)
                        })
                        .finally(() => {
                            this.$global.loading = false;
                        });
                } else {
                    this.$notify.warning("必填项未填写完整，请检查！");
                    return false;
                }
            });
        },
        handleBack() {
            this.$router.back()
        },

    }
};
</script>

<style lang="scss" scoepd>
.menu {
    display: flex;
    height: 100%;

    .tree {
        width: 240px;
        border-right: 1px #d0d0d0 solid;

        .d {
            width: 100%;
            height: 1px;
            background-color: #d0d0d0;
            margin: 10px 0;
        }

        .el-tree {
            .el-tree-node {


                .el-tree-node__content {
                    display: flex;

                    .custom-tree-node {
                        flex-grow: 1;
                        width: 215px;
                        display: flex;
                        align-items: center;
                        padding-right: 10px;
                        line-height: 1;

                        .label {
                            flex-grow: 1;
                            font-size: 12px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }

                        .btns {
                            flex-shrink: 0;

                            .delete {
                                margin-left: 10px;
                            }
                        }
                    }
                }

            }
        }
    }

    .images {
        flex-grow: 1;
    }
}
</style>