import { ajax } from '@/api/ajax'
import { isArray, isObject } from 'lodash'

const infoMixin = {
  methods: {
    // 初始化form数据
    initForm(data, form = {}) {
      data.map(({
        type,
        children,
        option
      }) => {
        if (type === 'box') {
          this.initForm(children, form)
        } else {
          const {
            type,
            prop,
            initValue
          } = option
          const value = type === 'number' ? undefined : initValue
          // 判断是否是是数组
          if (isArray(prop)) {
            for (let key of prop) {
              form[key] = (initValue || {})[key] || ''
            }
          } else {
            form[prop] = value
          }

        }
      })
      return form
    },
    // 详情
    getDetail(id) {
      this.$global.loading = true;
      return new Promise((resolve, reject) => {
        ajax({
          url: `${this.mixinConfig.detail || this.mixinConfig.url}/${id}`,
        })
          .then((res) => {
            const {
              data
            } = res;
            resolve(data)
          })
          .finally(() => {
            this.$global.loading = false;
          });
      })

    },
    // 提交
    submit(data, back = true) {
      this.$global.loading = true;
      const {
        id
      } = data
      const { add, upload, url } = this.mixinConfig
      return new Promise((resolve, reject) => {
        ajax({
          url: id ? upload || url : add || url,
          method: id ? "put" : 'post',
          data
        })
          .then((res) => {
            this.$notify.success(res.msg || '成功')
            if (back) {
              // 返回上一页
              this.back();
            }
            resolve(res)
          })
          .finally(() => {
            this.$global.loading = false;
          });
      })
    },
    back() {
      this.$store
        .dispatch("tagsView/delView", this.$route)
        .then(({
          visitedViews
        }) => {
          const latestView = visitedViews.slice(-1)[0];
          if (latestView) {
            this.$router.push("list");
          }
        });
    },
  },
}
export default infoMixin
