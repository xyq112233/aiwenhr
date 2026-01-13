<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button type="primary" size="mini" @click="showDialog = true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="roleList">
        <el-table-column prop="name" align="center" label="角色" width="200" />
        <el-table-column prop="state" align="center" label="启用" width="200">
          <template v-slot="{ row }">
            <span>{{ row.state === 1 ? '已启用' : row.state === 0 ? '已停用' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <el-button size="mini" type="text">权限分配</el-button>
          <el-button size="mini" type="text">编辑</el-button>
          <el-button size="mini" type="text">删除</el-button>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height: 60px;" align="middle" justify="end">
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page.sync="pageParams.page"
          :total="pageParams.total"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置弹层 -->
    <el-dialog width="500px" title="新增角色" :visible.sync="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width: 300px;" size="mini" />
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch v-model="roleForm.state" size="mini" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width: 300px;" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOk">确定</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      showDialog: false,
      roleList: [],
      // 将分页信息放置在一个对象中
      pageParams: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      roleForm: {
        name: '',
        state: 0,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.roleList = rows
      this.pageParams.total = total
    },
    // 分页切换时调用
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getRoleList()
    },
    btnOk() {
      this.$refs.roleForm.validate(async isOk => {
        if (isOk) {
          await addRole(this.roleForm)
          this.$message.success('新增成功')
          this.showDialog = false
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>
<style scoped>
.role-operate{
  padding: 10px;
}
</style>
