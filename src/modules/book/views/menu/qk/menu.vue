<template>
    <div :class="['menu-shadow', active ? 'active' : '']" @click="active = false">
        <div @click.stop>
            <el-form :model="form" ref="form" :rules="rules" size="small">
                <el-form-item label="期刊名称" prop="directory">
                    <el-input v-model="form.directory" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="期刊年份" prop="year">
                    <el-date-picker v-model="form.year" type="year" value-format="yyyy" placeholder="选择年份">
                    </el-date-picker>
                    <!-- <el-date-picker v-model="form.year" type="date" value-format="yyyy-MM-dd" placeholder="选择年份">
                    </el-date-picker> -->
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
                directory: "",
                year: "",
                sort: 0
            },
            initForm: {

            },
            rules: {
                directory: blur
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
                        url: '/directoryJournal',
                        method: id ? "put" : 'post',
                        data
                    })
                        .then(({ data }) => {

                            this.$notify.success('成功');
                            const { directoryJournal } = data
                            this.$emit('addMenu', { ...(directoryJournal || this.form), children: children || [], upload: !!id })
                            this.form.directory = "";
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