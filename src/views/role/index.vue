<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button type="primary" size="mini">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table>
        <el-table-column align="center" label="角色" width="200" />
        <el-table-column align="center" label="启用" width="200" />
        <el-table-column align="center" label="描述" />
        <el-table-column align="center" label="操作" />
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height: 60px;" align="middle" justify="end">
        <el-pagination layout="prev, pager, next" />
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Role'
}
</script>
<style scoped>
.role-operate{
  padding: 10px;
}
</style>
