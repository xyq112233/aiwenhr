<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树型结构 -->
      <el-tree :expand-on-click-node="false" :default-expand-all="true" :data="depts" :props="defaultProps">
        <!-- 节点结构 -->
        <template v-slot="{data}">
          <el-row style="width: 100%;height: 40px;" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manger">{{ data.managerName }}</span>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="delete">删除部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 新增部门弹窗 -->
    <add-dept :show-dialog.sync="showDialog" />
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import AddDept from '@/views/department/components/add-dept.vue'
export default {
  name: 'Department',
  components: {
    AddDept
  },
  data() {
    return {
      showDialog: false,
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const res = await getDepartment()
      this.depts = transListToTreeData(res, 0)
    },
    handleCommand(type) {
      if (type === 'add') {
        this.showDialog = true
      }
    }
  }
}
</script>
<style scoped>
.app-container{
  padding: 30px 140px;
  font-size: 14px;
}
.tree-manger{
  width: 50px;
  display: inline-block;
  margin: 32px;
}
</style>
