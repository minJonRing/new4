<template>
    <div class="card-wrap" ref="card">
        <div class="card">
            <div class="card-bg" :style="[cardBgImage]"></div>
            <div class="card-info">
                <el-popconfirm class="cancel" title="取消推荐？" placement="top" @confirm="handleDelete()">
                    <el-button circle slot="reference" icon="el-icon-delete" style="color: red">

                    </el-button>
                </el-popconfirm>
                <div class="title">{{ title }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GoodsBrowse',
    props: {
        dataImage: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        item: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
        }
    },
    computed: {
        cardBgImage() {
            return {
                backgroundImage: `url(${this.dataImage})`
            }
        }
    },
    mounted() {
    },
    methods: {
        handleDelete() {
            this.$emit('delete', this.item.id)
        }
    }
}
</script>

<style lang="scss" scoped>
$hoverEasing: cubic-bezier(0.23, 1, 0.32, 1);
$returnEasing: cubic-bezier(0.445, 0.05, 0.55, 0.95);

.card-wrap {
    margin: 10px;
    transform: perspective(800px);
    transform-style: preserve-3d;
    cursor: pointer;

    .card {
        position: relative;
        flex: 0 0 240px;
        width: 140px;
        height: 210px;
        background-color: #333;
        overflow: hidden;
        border-radius: 4px;
        box-shadow:
            rgba(black, 0.66) 0 2px 10px 0,
            inset #333 0 0 0 5px,
            inset rgba(white, 0.5) 0 0 0 6px;
        transition-duration: 300ms;
        overflow: hidden;

        .card-bg {
            opacity: 1;
            position: absolute;
            top: -20px;
            left: -20px;
            width: 100%;
            height: 100%;
            padding: 20px;
            box-sizing: content-box;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            pointer-events: none;
        }

        .card-info {
            padding: 9px;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            color: #fff;
            background-color: rgba(0, 0, 0, .4);
            transition: 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
            z-index: 1;

            .cancel {
                position: absolute;
                top: 0;
                right: 0;
                opacity: 0;
                z-index: 9;
                transition-duration: 300ms;

                ::v-deep {
                    .el-popover__reference-wrapper {
                        .el-icon-delete {
                            font-size: 20px;
                        }
                    }
                }
            }

            .title {
                position: absolute;
                top: 70%;
                left: 0;
                width: 100%;
                height: 100%;
                padding: 12px 6px;
                font-size: 16px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                transition-duration: 300ms;
            }

        }
    }

    &:hover {
        .card {
            background-color: rgba(0, 0, 0, 0);
            // box-shadow:
            //     rgba(black, 0) 0 0 10px 0,
            //     inset rgba(0, 0, 0, .3) 0 0 0 5px,
            //     inset white 0 0 0px 6px;

            .card-info {
                background-color: transparent;
                color: #000;

                .cancel {
                    opacity: 1;
                }

                .title {
                    background-color: rgba(255, 255, 255, .1);
                    backdrop-filter: blur(6px);
                    color: #000;
                    overflow: auto;
                    white-space: wrap;
                    // top: 30%;
                    box-shadow: 0 -4rem 6rem rgba(0, 0, 0, .3);
                }
            }

        }

    }
}
</style>