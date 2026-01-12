<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <!-- 用户名 -->
          <span class="name">{{ name }}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/xyq112233/aiwenhr">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog width="500px" title="修改密码" :visible.sync="showDialog" :modal="false" @close="btnCancel">
      <el-form ref="PassForm" label-width="120px" :model="FormPassword" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="FormPassword.oldPassword" size="small" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="FormPassword.newPassword" size="small" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="FormPassword.confirmPassword" size="small" show-password />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="btnOk">确认修改</el-button>
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showDialog: false,
      FormPassword: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{
          required: true,
          message: '旧密码不能为空',
          trigger: 'blur'
        }

        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }, {
            trigger: 'blur',
            min: 6,
            max: 16,
            message: '新密码长度必须在6-16位之间'
          }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' }, {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.FormPassword.newPassword === value) {
                callback()
              } else {
                callback(new Error('两次输入密码不一致'))
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    updatePassword() {
      // alert(123)
      this.showDialog = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 确认修改密码
    async btnOk() {
      this.$refs.PassForm.validate(async isOk => {
        if (isOk) {
          await updatePassword(this.FormPassword)
          this.$message.success('修改密码成功')
          this.btnCancel()
        }
      })
    },
    // 取消修改密码
    btnCancel() {
      this.$refs.PassForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .name{
          margin-right: 10px;
          font-size: 16px;
        }
        .username{
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #fff;
          background-color: #04c9be;
          border-radius: 50%;
          margin-right: 4px;
        }
        .el-icon-setting{
          font-size: 20px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
