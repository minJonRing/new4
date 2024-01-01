<template>
    <div :class="['menu-shadow', active ? 'active' : '']" @click="active = false">
        <div @click.stop>
            <el-form :model="form" ref="form" :rules="rules" size="small">
                <el-form-item label="目录名称" prop="label">
                    <el-input v-model="form.label" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmitMenu">保存</el-button>
                    <el-button @click="active = false">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ajax } from '@/api/ajax';
import { change, blur, rulesT } from 'tqr'
export default {
    props: {
        // 赋值的值
        model: rulesT.Any,
        bookId: rulesT.Number,
        currentMenu: rulesT.Object
    },
    model: {
        prop: "model",
        event: "change",
    },
    computed: {
        active: {
            get() {
                return this.model;
            },
            set(data) {
                this.$emit("change", data);
            },
        },
    },

    data() {
        return {
            form: {
                bookId: null,
                id: null,
                label: "",
                level: 1,
                pid: 0,
                sort: 0
            },
            initForm: {

            },
            rules: {
                label: blur
            },
        }
    },
    watch: {
        currentMenu(data) {
            this.form = {
                ...this.form,
                ...data
            }

        }
    },
    created() {
        this.form = {
            ...this.form,
            bookId: this.bookId,
        }
        this.initForm = { ...this.form };
    },
    methods: {
        handleSubmitMenu() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const { id, children } = this.form
                    const data = {
                        ...this.form
                    };
                    this.$global.loading = true;
                    ajax({
                        url: '/directoryRecord',
                        method: id ? "put" : 'post',
                        data
                    })
                        .then(({ data }) => {

                            this.$notify.success('成功');
                            const { directoryRecord } = data
                            this.$emit('addMenu', { ...(directoryRecord || this.form), children: children || [], upload: !!id })
                            this.form.label = "";
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
}
</script>

<style lang="scss" scoped>
.menu-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(6px);
    opacity: 0;
    pointer-events: none;
    transition-duration: 600ms;

    .el-form {
        width: 100%;
        background-color: #fff;
        padding: 10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .7);
        opacity: 0;
        transform: matrix(1, 0, 0, 1, 0, -50);
        transition-duration: 600ms;

    }

    &.active {
        opacity: 1;
        pointer-events: auto;

        .el-form {
            opacity: 1;
            transition-delay: 100ms;
            transform: matrix(1, 0, 0, 1, 0, 0);
        }
    }
}
</style>