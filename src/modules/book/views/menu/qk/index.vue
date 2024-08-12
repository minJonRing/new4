<template>
    <div class="menu">
        <div class="tree ">
            <el-button type="primary" @click="handleAddRootMenu">添加目录</el-button>
            <el-button @click="handleBack">返回列表</el-button>
            <div class="d"></div>
            <div class="scroll">
                <el-tree ref="tree" :data="menu" accordion highlight-current :default-expanded-keys="expandedKeys"
                    node-key="eid" @node-click="handleNodeClick">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span class="label">{{ node.label }}</span>
                        <span class="btns">
                            <el-button v-if="data.year" type="text" icon="el-icon-edit-outline" size="mini"
                                style="color:#ef9600" @click.stop="handleEditMenu(data, node)">
                            </el-button>
                            <el-button v-if="returnFile(data)" type="text" size="mini" icon="el-icon-folder-add"
                                style="color:#67c23a" @click.stop="handleAddFile(data)">
                                期刊目录/图书
                            </el-button>
                            <el-popconfirm class="delete" title="确定删除？" placement="top" @confirm="handleDelete(data)">
                                <el-button type="text" slot="reference" icon="el-icon-delete" style="color:red"
                                    @click.stop></el-button>
                            </el-popconfirm>
                        </span>
                    </span>
                </el-tree>
                <MenuShadow v-model="menuActive" :bookId="book.id" :currentMenu="currentMenu" @addMenu="addMenu" />
            </div>
        </div>
        <div class="images">
            <el-form v-if="active" :model="form" ref="form" :rules="rules" label-width="120px" size="small">
                <el-form-item label="名称" prop="title">
                    <el-input v-model="form.title" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <Upload url="/localUpload" v-model="form.urla" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">保存</el-button>
                </el-form-item>
            </el-form>
            <div v-else>
                <el-empty description="暂无操作"></el-empty>
            </div>
        </div>
    </div>
</template>

<script>
import { ajax } from '@/api/ajax';
import { change, blur, menuGenerate } from 'tqr'

import Upload from '../upload.vue'
import MenuShadow from './menu.vue'
export default {
    name: "Menu",
    props: {
        book: {
            type: Object,
            default: () => ({ id: null })
        }
    },
    components: {
        Upload,
        MenuShadow
    },
    data() {
        return {
            menu: [],
            // 
            form: {
                bookId: null,
                id: null,
                directoryId: '',
                level: 1,
                pid: 0,
                title: "",
                sort: '',
                urls: '',
                urla: []
            },
            initFomr: {

            },
            rules: {
                archiveNumber: blur,
                title: blur,
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
                },
            },
            // active
            active: false,
            // 
            currentNode: {},
            menuActive: false,
            currentMenu: {},
            expandedKeys: []
        }
    },
    created() {
        const { id } = this.book
        this.form.bookId = id;
        this.initFomr = JSON.parse(JSON.stringify(this.form));
        this.getFile(id)
    },
    mounted() {

    },
    methods: {
        // 获取文件
        getFile(id) {
            this.$global.loading = true
            ajax({
                url: '/directoryJournalFile/getByBookId',
                data: {
                    bookId: id,
                }
            }).then(({ data }) => {
                const { list } = data;
                const file = this.filterFile(list)
                this.getMenu(id, file)
            }).finally(() => {
                this.$global.loading = false
            })
        },
        filterFile(data) {
            return data.map(el => {
                const { id, title, children } = el
                const obj = {
                    ...el,
                    eid: 'c' + id,
                    label: title,
                    children: []
                }
                if (el.children && !!el.children.length) {
                    obj.children = this.filterFile(children)
                }
                return obj
            })
        },
        // 获取目录列表
        getMenu(id, file) {
            ajax({
                url: '/directoryJournal/' + id,
                data: {
                    bookId: id
                }
            }).then(({ data }) => {
                const { map } = data;
                const list = [];
                Object.values(map).map(d => {
                    list.push(...d)
                })
                this.menu = this.menu = this.filterMenu(list, file)
            }).finally(() => {
                this.$global.loading = false
            })
        },
        // 处理menu数据
        filterMenu(data, file) {
            return data.map(el => {
                const { id, year, directory, children } = el;
                const obj = {
                    ...el,
                    label: year + '-' + directory,
                    eid: id + '',
                    children: []
                }
                if (children && children.length) {
                    obj.children = this.filterMenu(children, file)
                } else {
                    obj.children = file.filter(({ directoryId }) => directoryId == id)
                }
                return obj;
            })
        },
        // 添加顶层目录
        handleAddRootMenu() {
            this.currentMenu = {
                id: null,
                label: "",
                level: 1,
                pid: 0,
                sort: 0
            }

            this.menuActive = true;
            this.active = false;
        },
        // 节点点击
        handleNodeClick(data, node) {
            const { isLeaf } = node;
            const { directoryId, urls } = data;
            if (isLeaf) {
                if (directoryId) {
                    this.form = {
                        ...data,
                        urla: !!urls ? urls.split(',').map(i => ({ filePath: i })) : []
                    }
                    this.expandedKeys = [data.eid];
                    this.currentNode = data;
                    this.active = true
                }
            }
        },
        // 编辑目录
        handleEditMenu(data, node) {
            this.currentMenu = data;
            this.expandedKeys = [data.eid];
            this.menuActive = true;
            this.active = false;
        },
        // 添加/更新成功的数据插入到节点
        addMenu(data) {
            const { bookId, pid, upload } = data;
            if (upload) {
                this.getFile(bookId)
                return
            }
            if (pid) {
                if (!this.currentNode.children) {
                    this.$set(this.currentNode, 'children', []);
                }
                this.currentNode.children.push({ ...data, children: [] });
            } else {
                this.menu.push(data)
            }
        },
        // 删除目录
        handleDelete(data) {
            const { directoryId, id } = data;
            if (!directoryId) {
                this.$global.loading = true;
                ajax({
                    url: `/directoryJournal/${id}`,
                    method: 'delete'
                }).then(() => {
                    this.$notify.success('删除成功')
                    this.getFile(this.form.bookId)
                }).finally(() => {
                    this.$global.loading = false;
                })
            } else {
                this.$global.loading = true;
                ajax({
                    url: `/directoryJournalFile/${id}`,
                    method: 'delete'
                }).then(() => {
                    this.$notify.success('删除成功')
                    this.getFile(this.form.bookId)
                }).finally(() => {
                    this.$global.loading = false;
                })
            }
        },
        // 添加文件
        handleAddFile(data) {
            const { id, level, directoryId } = data;
            this.currentNode = data;
            let form = {
                ...JSON.parse(JSON.stringify(this.initFomr)),
                directoryId: id,
            }
            if (level) {
                form = {
                    ...form,
                    directoryId,
                    level: level + 1,
                    pid: id
                }
            }
            this.form = form;
            this.active = true;
        },
        addFile(data, add) {
            if (add) {
                if (!this.currentNode.children) {
                    this.$set(this.currentNode, 'children', []);
                }
                this.currentNode.children.push({ ...data, label: data.title, children: [] });
            } else {
                this.getFile(this.form.bookId)
            }
        },
        // 添加文件
        returnFile(data) {
            const { urls } = data
            return !urls
        },
        handleSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const { id, timea, urla } = this.form;
                    const data = {
                        ...this.form,
                        urls: urla.map(({ filePath }) => filePath).join(',')
                    };
                    this.$global.loading = true;
                    ajax({
                        url: '/directoryJournalFile',
                        method: id ? "put" : 'post',
                        data
                    })
                        .then(({ data }) => {
                            const { directoryJournalFile } = data;
                            this.addFile(directoryJournalFile, !!directoryJournalFile)
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
        width: 360px;
        border-right: 1px #d0d0d0 solid;

        .d {
            width: 100%;
            height: 1px;
            background-color: #d0d0d0;
            margin: 10px 0;
        }

        .scroll {
            position: relative;
            height: calc(100% - 49px);

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
    }

    .images {
        flex-grow: 1;
    }
}
</style>