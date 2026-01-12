<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <el-form ref="addDept" label-width="120px" :model="formData" :rules="rules">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%;" size="mini">
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" :rows="4" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="btnOk">确认</el-button>
            <el-button size="mini" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { updateDepartment, addDepartment, getDepartment, getManagerList, getDepartmentDetail } from '@/api/department'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      managerList: [],
      formData: {
        code: '',
        introduce: '',
        managerId: '',
        name: '',
        pid: ''
      },
      rules: {
        code: [{ required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 2, max: 10, message: '部门编码长度为2-10个字符', trigger: 'blur' },
          {
            validator: async(rule, value, callback) => {
              let res = await getDepartment()
              if (this.formData.id) {
                res = res.filter(item => item.id !== this.formData.id)
              }
              if (res.some(item => item.code === value)) {
                callback(new Error('部门编码已存在'))
              } else {
                callback()
              }
            }
          }],
        introduce: [{ required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 100, message: '部门介绍长度为1-100个字符', trigger: 'blur' }],
        managerId: [{ required: true, message: '请选择负责人', trigger: 'blur' },
          { required: true, message: '负责人长度为1-100个字符', trigger: 'blur' }],
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称长度为2-10个字符', trigger: 'blur' },
          {
            validator: async(rule, value, callback) => {
              let res = await getDepartment()
              if (this.formData.id) {
                res = res.filter(item => item.id !== this.formData.id)
              }
              if (res.some(item => item.name === value)) {
                callback(new Error('部门名称已存在'))
              } else {
                callback()
              }
            }
          }]
        // pid: ''
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getMangerList()
  },
  methods: {
    close() {
      this.formData = {
        code: '',
        introduce: '',
        managerId: '',
        name: '',
        pid: ''
      }
      this.$refs.addDept.resetFields()
      this.$emit('update:showDialog', false)
    },
    async getMangerList() {
      const res = await getManagerList()
      this.managerList = res
    },
    btnOk() {
      this.$refs.addDept.validate(async isOk => {
        if (isOk) {
          let msg = '新增'
          if (this.formData.id) {
            msg = '更新'
            await updateDepartment(this.formData)
          } else {
            await addDepartment({ ...this.formData, pid: this.currentNodeId })
          }
          this.$emit('updateDepartment')
          this.$message.success(`${msg}部门成功`)
          this.close()
        }
      })
    },
    async getDepartmentDetail() {
      const res = await getDepartmentDetail(this.currentNodeId)
      this.formData = res
    }

  }
}
</script>
