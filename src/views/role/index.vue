<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button type="primary" size="mini">添加角色</el-button>
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
        <el-pagination layout="prev, pager, next" />
      </el-row>
    </div>
  </div>
</template>
<script>
import { getRoleList } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      roleList: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList()
      this.roleList = rows
    }
  }
}
</script>
<style scoped>
.role-operate{
  padding: 10px;
}
</style>
