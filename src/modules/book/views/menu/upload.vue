<template>
    <div class="e-upload">
        <template v-if="(fileList && fileList.length) || !read">
            <el-upload key="1" v-if="!read" v-loading="loading" :element-loading-text="progress + '%'"
                class="e-avatar-uploader" action="#" :limit="limit" :show-file-list="false" multiple
                :before-upload="beforeAvatarUpload" :http-request="handleUploadLearnSignVoucherFileChange"
                :attr-icon="'注:只能上传' + type.join()" :style="{ width: '100%', height: '80px' }">
                <i class="el-icon el-icon-upload2" />
            </el-upload>
            <transition-group tag="div" class="container">
                <div v-for="(i, j) in fileList" :key="i.filePath" class="item" :style="{ width, height }"
                    draggable="true" @dragstart="handleDragStart($event, i)"
                    @dragover.prevent="handleDragOver($event, i)" @dragenter="handleDragEnter($event, i)"
                    @dragend="handleDragEnd($event, i)">
                    <el-popconfirm v-if="!read" class="delete" title="确定删除？" placement="top"
                        @confirm="handleDelete(i, j)">
                        <el-button type="danger" slot="reference">删除</el-button>
                    </el-popconfirm>
                    <el-image :src="i.filePath" fit="cover"
                        :preview-src-list="fileList.map(({ filePath }) => filePath)">
                        <div slot="error" class="image-slot">
                            <a class="tip-text" :href="i.filePath" target="_blank">
                                {{ `点击下载《${i.fileName || "未命名文件"}》` }}
                            </a>
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </div>
            </transition-group>
        </template>
        <template v-else>
            <div class="item" :style="{ width, height }">
                <el-image fit="cover">
                    <div slot="error" class="image-slot">
                        <a class="tip-text">未上传任何文件</a>
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
            </div>
        </template>
    </div>
</template>

<script>
import { rulesT } from "tqr";
import { Notification } from "element-ui";
import { mapGetters } from "vuex";
export default {
    name: "UploadProT",
    props: {
        // 赋值的值
        model: rulesT.Any,
        // 是否只读
        read: rulesT.Boolean,
        // 上传地址
        url: rulesT.String,
        // 删除地址
        deleteUrl: rulesT.String,
        // 文件类型
        type: {
            type: Array,
            default: () => ["image", 'jpg', 'png'],
        },
        // 文件大小
        size: {
            type: Number,
            default: 5,
        },
        // 最大上传文件个数
        limit: {
            type: Number,
            default: 99,
        },
        // 对返回的数据进行处理 {fileName,filePath}
        filterData: {
            type: Function,
        },
        // 上传模块的宽高 ，显示图片的宽高
        width: {
            type: String,
            default: "140px",
        },
        height: {
            type: String,
            default: "210px",
        },
    },
    model: {
        prop: "model",
        event: "change",
    },
    data() {
        return {
            loading: false,
            progress: 0,
            // dragging
            ending: null,
            dragging: null,
            // 
            // baseURL: ""
        };
    },
    computed: {
        fileList: {
            get() {
                return this.model;
            },
            set(data) {
                this.$emit("change", data);
            },
        },
        ...mapGetters(['local'])
    },
    created() {
        // this.baseURL = ''
    },
    methods: {
        beforeAvatarUpload(file) {
            const isType =
                this.type.filter((i) => {
                    return (
                        new RegExp(i).test(file.type) ||
                        i === file.name.replace(/.+(?=\.)|\./g, "")
                    );
                }).length > 0;
            const isSize = file.size / 1024 / 1024 < this.size;
            if (!isType) {
                this.$message.error(`请上传格式正确的文件(${this.type.join(",")})!`);
            }
            if (!isSize) {
                this.$message.error(`上传文件大小不能超过${this.size}MB!`);
            }
            return isType && isSize;
        },
        handleUploadLearnSignVoucherFileChange(files) {
            this.loading = true;
            const { file } = files;
            let formData = new FormData();
            formData.append("file", file);
            this.$AJAX({
                url: this.url,
                method: "post",
                data: formData,
                onUploadProgress: ({ loaded, total }) => {
                    this.progress = Math.ceil((loaded / total) * 100);
                },
            })
                .then(({ data }) => {
                    const { url } = data;
                    const _url = this.local ? `/library${url}` : url;
                    this.fileList.push({ filePath: _url, ...data });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete(item, i) {
            this.fileList.splice(i, 1);
        },
        // 拖拽
        handleDragStart(e, item) {
            this.dragging = item
        },
        handleDragEnd(e, item) {
            if (this.ending.filePath === this.dragging.filePath) {
                return
            }

            let newItems = [...this.fileList]
            const src = newItems.indexOf(this.dragging)
            const dst = newItems.indexOf(this.ending)
            newItems.splice(src, 1, ...newItems.splice(dst, 1, newItems[src]))

            this.fileList = newItems
            this.$nextTick(() => {
                this.dragging = null
                this.ending = null
            })
        },
        handleDragOver(e) {
            // 首先把div变成可以放置的元素，即重写dragenter/dragover
            e.dataTransfer.dropEffect = 'move'// e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
        },
        handleDragEnter(e, item) {
            e.dataTransfer.effectAllowed = 'move'// 为需要移动的元素设置dragstart事件
            this.ending = item
        }
    },
};
</script>

<style lang="scss" scoped>
.e-upload {

    .e-avatar-uploader {
        position: relative;
        margin: 3px 6px 3px 0;


        ::v-deep .el-upload {
            display: block;
            width: 100%;
            height: 100%;
            box-sizing: border-box;

            .el-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                box-sizing: border-box;
                cursor: pointer;
                font-size: 28px;
                color: #8c939d;
                width: 100%;
                height: 100%;
                transition-duration: 600ms;
                opacity: 0.6;

                &:hover {
                    border-color: #409eff;
                    color: #409eff;
                }
            }
        }

        &::after {
            position: absolute;
            bottom: 3px;
            left: 0;
            pointer-events: none;
            content: attr(attr-icon);
            font-size: 12px;
            color: #999;
            width: 100%;
            padding: 0 3px;
            text-align: center;
            line-height: 1.2;
            word-break: break-all;
            white-space: pre-wrap;
        }
    }

    .container {
        display: flex;
        flex-wrap: wrap;
        height: calc(100vh - 360px);
        overflow: auto;

        .item {
            position: relative;
            border-radius: 6px;
            overflow: hidden;
            margin: 3px 6px 3px 0;
            transition-duration: 100ms;

            .delete {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 1;
            }

            .el-image {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                border: 1px dashed #d9d9d9;
                box-sizing: border-box;

                img {
                    display: block;
                }

                ::v-deep .image-slot {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    padding: 0 6px;
                    color: #409eff;
                    box-sizing: border-box;

                    .tip-text {
                        flex: 1;
                        text-align: center;
                        font-size: 13px;
                        overflow: hidden;
                        // white-space: nowrap;
                        // text-overflow: ellipsis;
                        line-height: 1;
                        color: #409eff;
                    }
                }
            }
        }
    }

}
</style>