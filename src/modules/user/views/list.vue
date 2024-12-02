<template>
  <div class="box">
    <ListProT ref="list" :list="list" :mixinConfig="mixinConfig" :searchParam="searchParam" :tableParam="tableParam"
      :noBtns="noBtns" :otherBtns="otherBtns" :requestFilter="requestFilter" :conditionBtn="conditionBtn"
      :selection="selection" @getData="getData" :jump="false" @getJump="getJump">
      <template slot="tableBtns" slot-scope="scope">
        <el-button v-if="!!scope.data.row.status" type="text" slot="reference" style="color:rgb(88% 61% 34%)"
          @click="handleAddNum(scope.data)">增加下载次数</el-button>
        <el-popconfirm class="ml10" v-if="returnBtn('verify', scope)" title="确定选择？" placement="top"
          @confirm="handleVerify(scope.data)">
          <el-button type="text" slot="reference" style="color: #67c23a">
            审核
          </el-button>
        </el-popconfirm>
        <el-popconfirm class="ml10" v-if="returnBtn('admin', scope)" title="确定选择？" placement="top"
          @confirm="handleSetAdmin(scope.data)">
          <el-button type="text" slot="reference">
            {{ !!scope.data.row.isAdmin ? "取消管理员" : "设为管理员" }}
          </el-button>
        </el-popconfirm>
      </template>
    </ListProT>
    <!--  -->
    <el-dialog title="用户信息" :visible.sync="show" width="400px">
      <div style="padding:12px 0">
        <el-form :model="userForm" ref="form" :rules="rules" :inline="false">
          <el-form-item label="新增下载次数" prop="number">
            <el-input-number v-model="userForm.number" :min="1" :max="999" style="width: 100%;"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAddNum">确认</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { change, rulesT } from "tqr";
import { ajax } from "@/api/ajax";
export default {
  name: "List",
  props: {
    noBtns: {
      type: Array,
      default: () => ['add', 'edit', 'see']
    },
    otherBtns: rulesT.Array,
    selection: rulesT.Array,
  },
  data() {
    return {
      mixinConfig: {
        url: "/user",
      },
      list: {},
      // 查询条件
      searchParam: [],
      // 表格表头、数据显示
      tableParam: [],
      conditionBtn: {
        delete: ({ row }) => {
          const { id: cId, username: cUsername, isAdmin } = this.userInfo;
          // 管理员
          if (isAdmin === 1) {
            // 管理员
            if (cUsername !== 'admin') {
              // 不能删除自己，超级管理员，管理员
              return row.id !== cId && row.username !== 'admin' && row.isAdmin !== 1
              // 超级管理员 
            } else {
              //  不能删除自己
              return row.id !== cId
            }
            // 普通用户
          } else {
            return false
          }

        }
      },

      // 
      show: false,
      userForm: {
        id: 0,
        number: 0,
      },
      rules: {
        number: change
      }
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.searchParam = [
        {
          label: "昵称",
          type: "input",
          option: {
            prop: "nickName",
            initValue: "",
          },
        },
        {
          label: "账号",
          type: "input",
          option: {
            prop: "username",
            initValue: "",
          },
        },
      ];
      this.tableParam = [
        {
          label: "昵称", prop: "nickName",
          formatter: (row) => {
            return row.nickName ? row.nickName : '/'
          },
        },
        {
          label: "用户类型",
          formatter: (row) => {
            return <el-tag type={row.username === 'admin' ? 'danger' : row.isAdmin ? 'success' : ''}>{row.username === 'admin' ? '超级管理员' : row.isAdmin ? '管理员' : '普通用户'}</el-tag>
          },
        },
        { label: "账号", prop: "username" },
        // { label: "用户等级", prop: "username" },
        // { label: "当前积分", prop: "username" },
        {
          label: "邮箱", prop: "email", formatter: (row) => {
            return row.email ? row.email : '/'
          },
        },
        {
          label: "手机号", prop: "phone", formatter: (row) => {
            return row.phone ? row.phone : '/'
          },
        },
        {
          label: "下载", formatter: (row) => {
            return (row.downloadNum || 0) + '/' + (row.downloadTotalNum || 0)
          },
        },
        {
          label: "状态", formatter: (row) => {
            return <el-tag type={row.status ? '' : 'info'}>{row.status ? '正常' : '待审核'}</el-tag>
          },
          width: '100px'
        },
        {
          label: "创建时间",
          formatter: (row) => {
            return row.createTime.split('T')[0]
          },
          width: "160px"
        },
      ];
    },
    returnBtn(type, scope) {
      const { data: { row } } = scope
      // 审核
      if (type === 'verify') {
        const { isAdmin } = this.userInfo
        return [1].includes(isAdmin) && !row.status;
      }
      // 设为/取消 管理员
      if (type === 'admin') {
        const { username } = this.userInfo
        return username === 'admin' && row.username !== 'admin' && !!row.status
      }
      return false
    },
    getData(data) {
      this.$emit("getData", data);
    },
    getJump({ handle, data }) {
      if (['see'].includes(handle)) {
        this.userForm = data
        this.show = true;
        return
      }
      if (['delete'].includes(handle)) {
        console.log(data)
      }
    },
    requestFilter({ list }) {
      return (list || []).map(el => ({ ...el, addNum: 0 }))
    },
    handleAddNum({ row }) {
      const { id } = row;
      this.userForm = {
        id,
        number: 0
      }
      console.log(this.userForm)
      this.show = true
    },
    handleConfirmAddNum() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$global.loading = true
          ajax({
            url: '/user/downloadNum',
            type: 'PUT',
            data: this.userForm
          }).then(() => {
            this.$notify.success('下载次数新增成功')
            this.$refs.list.query();
          }).finally(() => {
            this.$global.loading = false
          })
        } else {
          this.$notify.warning("必填项未填写完整，请检查！");
          return false;
        }
      });

    },
    handleVerify({ row }) {
      console.log(row)
      const { id, status } = row;
      if (status !== 1) {
        this.$global.loading = true
        ajax({
          url: `/user/examine/${id}`,
          type: 'PUT'
        }).then((res) => {
          this.$notify.success('设置成功')
          this.$refs.list.query();
        }).finally(() => {
          this.$global.loading = false
        })
        return
      }
      this.$notify.warning('该用户已审核')
    },
    handleSetAdmin({ row }) {
      const { id, isAdmin, status } = row;
      if (status === 1) {
        const is = isAdmin === 1 ? 0 : 1;
        const url = is === 1 ? `/user/admin/${id}` : `/user/adminNo/${id}`
        this.$global.loading = true
        ajax({
          url,
          type: 'PUT'
        }).then((res) => {
          this.$notify.success('设置成功')
          this.$refs.list.query();
        }).finally(() => {
          this.$global.loading = false
        })
        return
      }
      this.$notify.warning('请先审核用户')

    }
  },
};
</script>
