<template>
  <div class="info scroll">
    <el-tabs tab-position="left">
      <el-tab-pane label="图书基本信息">
        <div class="base scroll">
          <el-form :model="form" ref="form" :rules="rules" label-width="140px" label-position="left">
            <el-form-item label="文档封面">
              <Upload v-model="form.imageUrl" url="/localUpload" height="150px" />
            </el-form-item>
            <FormProT :form="form" :list="list" :form-list="formList" />
            <el-form-item>
              <el-button type="primary" @click="handleSubmit">保存</el-button>
              <btn-return />
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="form.id" label="目录信息">
        <Menu :book="form" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import infoMixin from "@/mixin/infoMixin";
import Menu from './menu'
import {
  rulesT,
  blur,
  change,
  blurPhoneNotRequired,
  blurEmailNotRequired
} from "tqr";
import Upload from '@/modules/upload.vue'
import { ajax } from "@/api/ajax"
import { mapGetters } from 'vuex';

export default {
  name: "Info",
  mixins: [infoMixin],
  props: {
    read: rulesT.Boolean,
  },
  components: {
    Upload,
    Menu
  },
  data() {
    return {
      mixinConfig: {
        url: "/books",
      },
      list: {
        bookType: []
      },
      form: {
        id: null,
        imageUrl: "",
        title: "",
        docType: "",
        keyWords: [],
        language: "",
        contentDesc: "",
        firstResponsible: "",
        firstCreationWay: "",
        firstResponsibleNation: "",
        secondResponsible: "",
        secondCreationWay: "",
        secondResponsibleNation: "",
        publisher: "",
        place: "",
        publishTime: "",
        publishCycle: "",
        publishEvolution: "",
        publishName: "",
        version: "",
        redFlag: false,
        notes: "",
        seriesName: "",
        seriesSubName: "",
        seriesVolume: "",
        // 
        docFormat: "",
        // 来源
        orgName: "",
        originalPlace: "",
        originalTitle: "",
        remarks: "",
        roundup: "",
        url: "",
        // 
        aaa: ['2023-12-01', '2023-12-10'],
      },
      formList: [],
      rules: {
        // nickName: blurName,
        username: [{ required: true, message: '请输入', trigger: 'blur' }, , { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入', trigger: 'blur' }, , { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        checkPassword: blur,
        phone: blurPhoneNotRequired,
        email: blurEmailNotRequired,
        roleId: change
      },
    };
  },
  computed: {
    ...mapGetters(['bookType'])
  },
  watch: {
    bookType(data) {
      this.list.bookType = data;
    }
  },
  created() {
    const { id } = this.$route.query;
    if (id) {
      this.getDetail(id).then(({ books }) => {
        this.init()
        const { keyWords = '' } = books
        this.form = { ...this.form, ...books, keyWords: keyWords.join() };
      })
    } else {
      this.init()
    }
    this.list = {
      bookType: this.bookType
    }
  },
  methods: {
    init() {
      const isRead = this.read;
      this.formList = [
        {
          type: "box",
          className: "flex-box flex  flex-wrap",
          children: [
            {
              label: "文档名称",
              type: "input",
              itemOption: {
                class: 'flex-g2'
              },
              option: {
                prop: "title",
                isRead,
                initValue: "",
              },
            },
            {
              label: "文档类型",
              type: "select",
              itemOption: {
                class: 'flex-g1'
              },
              option: {
                prop: "docType",
                isRead,
                initValue: "",
                listName: 'bookType'
              },
            },
          ],
        },

        {
          type: "box",
          className: "flex-box flex  flex-wrap",
          children: [
            {
              label: "关键字",
              type: "input",
              itemOption: {
                class: 'flex-g2'
              },
              option: {
                prop: "keyWords",
                isRead,
                initValue: "",
                placeholder: '多个关键字请用中英文分号[，][,]分隔',
              },
            },
            {
              label: "文档语言",
              type: "input",
              itemOption: {
                class: 'flex-g1'
              },
              option: {
                prop: "language",
                isRead,
                initValue: "",
              },
            },
          ],
        },
        {
          label: "文档描述",
          type: "input",
          option: {
            type: 'textarea',
            prop: "contentDesc",
            isRead,
            initValue: "",
          },
        },
        {
          type: "box",
          className: "flex-box flex  flex-wrap",
          option: {
            render: () => {
              return <el-tag>责任者信息</el-tag>
            }
          },
          children: [
            {
              label: "主要责任者",
              type: "input",
              itemOption: {
                class: 'bw33'
              },
              option: {
                prop: "firstResponsible",
                isRead,
                initValue: "",
                placeholder: '多个责任者请用英文分号";"分隔',
              },
            },
            {
              label: "创作方式",
              type: "input",
              itemOption: {
                class: 'bw33'
              },
              option: {
                prop: "firstCreationWay",
                isRead,
                initValue: "",
              },
            },

            {
              label: "国籍",
              type: "input",
              itemOption: {
                class: 'bw33'
              },
              option: {
                prop: "firstResponsibleNation",
                isRead,
                initValue: "",
              },
            },
          ],
        },
        {
          type: "box",
          className: "flex-box flex  flex-wrap",
          children: [
            {
              label: "次要责任者",
              type: "input",
              itemOption: {
                class: 'bw33'
              },
              option: {
                prop: "secondResponsible",
                isRead,
                initValue: "",
                placeholder: '多个责任者请用英文分号";"分隔',
              },
            },
            {
              label: "创作方式",
              type: "input",
              itemOption: {
                class: 'bw33'
              },
              option: {
                prop: "secondCreationWay",
                isRead,
                initValue: "",
              },
            },

            {
              label: "国籍",
              type: "input",
              itemOption: {
                class: 'bw33'
              },
              option: {
                prop: "secondResponsibleNation",
                isRead,
                initValue: "",
              },
            },
          ],
        },
        {
          type: "box",
          className: "flex-box flex  flex-wrap",
          option: {
            render: () => {
              return <el-tag>出版信息</el-tag>
            }
          },
          children: [
            {
              label: "出版者",
              type: "input",
              itemOption: {
                class: 'bw50'
              },
              option: {
                prop: "publisher",
                isRead,
                initValue: "",
              },
            },
            {
              label: "出版地",
              type: "input",
              itemOption: {
                class: 'bw50'
              },
              option: {
                prop: "place",
                isRead,
                initValue: "",
                maxlength: 10
              },
            },
            {
              label: "出版时间",
              type: "date",
              itemOption: {
                class: 'bw50'
              },
              option: {
                prop: "publishTime",
                isRead,
                initValue: "",
              },
            },
            {
              label: "出版周期",
              type: "input",
              itemOption: {
                class: 'bw50'
              },
              option: {
                prop: "publishCycle",
                isRead,
                initValue: "",
              },
            },

          ],
        },
        {
          label: "期刊/报纸沿革",
          type: "input",
          option: {
            type: 'textarea',
            prop: "publishEvolution",
            isRead,
            initValue: "",
          },
        },
        {
          type: "box",
          // className: "flex-box flex  flex-wrap",
          option: {
            render: () => {
              return <el-tag>其他信息</el-tag>
            }
          },
          children: [
            {
              label: "红色文献",
              type: "switch",
              itemOption: {
                class: 'flex-g1'
              },
              option: {
                prop: "redFlag",
                isRead,
                initValue: false,
              },
            },
            {
              label: "起讫时间",
              type: "date",
              itemOption: {
                class: 'flex-g1'
              },
              option: {
                type: 'daterange',
                prop: 'aaa',
                isRead,
                initValue: '',
                'start-placeholder': "开始日期",
                'end-placeholder': "结束日期",
                'range-separator': '至',
                format: 'yyyy-MM-dd',
                editable: false
              },
            },
          ]
        }
      ];
      this.form = { ...this.form, ...this.initForm(this.formList) };
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { keyWords = '' } = this.form
          const data = { ...this.form, keyWords: keyWords.replace(/\,|\，/g, ',').split(',') };
          console.log(data)
          return
          this.submit(data);
        } else {
          this.$notify.warning("必填项未填写完整，请检查！");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  height: 100%;
  min-width: 960px;

  .el-tabs {
    background-color: #fff;
    height: 100%;
    width: 100%;

    ::v-deep {
      .el-tabs__content {
        height: 100%;

        .el-tab-pane {
          height: 100%;
          padding: 10px 0;
        }
      }
    }

    .base {
      height: 100%;
      overflow: auto;


      .el-form {
        border-top: 1px #dfdfdf solid;
        border-left: 1px #dfdfdf solid;
        background-color: #fff;

        ::v-deep .el-form-item {
          display: flex;
          border-right: 1px #dfdfdf solid;
          border-bottom: 1px #dfdfdf solid;
          margin: 0;

          .el-form-item__label {
            padding: 6px;
            border-right: 1px #dfdfdf solid;
          }

          .el-form-item__content {
            flex-grow: 1;
            padding: 6px;
            margin: 0 !important;

            .el-form-item__error {
              top: auto;
              left: 10px;
              bottom: 10px;
              line-height: 1;
            }
          }
        }
      }
    }
  }


}
</style>
