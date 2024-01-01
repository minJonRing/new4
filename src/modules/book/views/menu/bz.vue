<template>
    <div class="menu">
        <div class="tree scroll">
            <el-button type="primary" @click="handleAdd">添加目录</el-button>
            <el-button @click="handleBack">返回列表</el-button>
            <div class="d"></div>
            <el-tree :data="menu" @node-click="handleNodeClick">
                <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="label">{{ node.label }}</span>
                    <span class="btns">
                        <el-button type="text" size="mini" @click.stop="append(data)">
                            添加
                        </el-button>
                        <el-popconfirm class="delete" title="确定删除？" placement="top" @confirm="handleDelete(i, j)">
                            <el-button type="text" slot="reference" style="color:red">删除</el-button>
                        </el-popconfirm>
                    </span>
                </span> -->
            </el-tree>
        </div>
        <div class="images">
            <el-form :model="form" ref="form" :rules="rules" label-width="120px" size="small">
                <el-form-item label="发行日期" prop="date">
                    <el-date-picker v-model="form.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间">
                    </el-date-picker>

                </el-form-item>
                <el-form-item label="内容">
                    <Upload url="/upload" v-model="form.urla" />
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
import { change } from 'tqr'

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
                date: '',
                sort: '',
                urla: []
            },
            initFomr: {},
            rules: {
                date: change
            }
        }
    },
    created() {
        const { id } = this.book
        this.form.bookId = id;
        this.initFomr = { ...this.form }
        this.getMenu(id)
    },
    mounted() {

    },
    methods: {
        getMenu(id) {
            this.$global.loading = true
            ajax({
                url: '/directoryNews/' + id,
                data: {
                    bookId: id
                }
            }).then(({ data }) => {
                const { list } = data
                this.menu = list.map(i => ({ ...i, label: i.date }))
            }).finally(() => {
                this.$global.loading = false
            })
        },
        handleAdd() {
            this.form = { ...this.initFomr }
        },
        handleBack() {
            this.$router.back()
        },
        handleNodeClick(data, node) {
            const { isLeaf } = node;
            if (isLeaf) {
                const { urls } = data
                this.form = { ...data, urla: urls.split(',').map(i => ({ filePath: i })) }
            }
        },
        append(data) {
            const { id, level } = data;
            this.form = {
                ...this.initFomr,
                pid: id,
                level: level + 1,

            }
        },
        handleSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const { id, date, urla } = this.form
                    console.log(this.form)
                    const [a, b, c] = date.split('-')
                    const data = {
                        ...this.form,
                        year: a,
                        month: b,
                        day: c,
                        urls: urla.map(({ filePath }) => filePath).join(',')
                    };
                    this.$global.loading = true;
                    ajax({
                        url: '/directoryNews',
                        method: id ? "put" : 'post',
                        data
                    })
                        .then((res) => {
                            this.$notify.success('成功')
                        })
                        .finally(() => {
                            this.$global.loading = false;
                        });
                } else {
                    this.$notify.warning("必填项未填写完整，请检查！");
                    return false;
                }
            });
        }

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
  