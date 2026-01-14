<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          :highlight-current="true"
          :default-expand-all="true"
          :expand-on-click-node="false"
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{row}">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username.charAt(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{row}">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text">角色</el-button>
              <el-popconfirm title="确定删除这一行数据吗？" @onConfirm="confirDel(row.id)">
                <el-button slot="reference" size="mini" style="margin-left: 10px;" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <!-- 导入excel组件 -->
    <import-excel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import { getEmployeeList, exportEmployee, delEmployee } from '@/api/employee'
import ImportExcel from './components/import-excel.vue'
import FileSaver from 'file-saver'
export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 储存查询参数
      queryParams: {
        departmentId: null,
        page: 1,
        pagesize: 10,
        keyword: ''
      },
      total: 0, // 员工总数
      list: [], // 储存员工列表
      showExcelDialog: false
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const res = await getDepartment()
      this.depts = transListToTreeData(res, 0)
      // console.log(this.depts[0])
      this.queryParams.departmentId = this.depts[0].id
      // 等待树形组件渲染完成后，设置当前选中节点
      this.$nextTick(() => {
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      this.getEmployeeList()
    },
    selectNode(node) {
      // console.log(node)
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      // console.log(row)
      this.list = rows
      this.total = total
    },
    changePage(newPage) {
      // alert(newPage)
      this.queryParams.page = newPage
      this.getEmployeeList()
    },
    changeValue() {
      // console.log(this.queryParams.keyword)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 500)
    },
    // 导出员工的excel
    async exportEmployee() {
      const res = await exportEmployee()
      // console.log(res)
      FileSaver.saveAs(res, '员工信息表.xlsx')
    },
    // 删除员工
    async confirDel(id) {
      // alert('删除成功')
      await delEmployee(id)
      if (this.queryParams.page > 1 && this.list.length === 1) this.queryParams.page--
      this.getEmployeeList()
      this.$message.success('删除成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
