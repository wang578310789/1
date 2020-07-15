<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/image/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login-form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont iconuser"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont iconsuo1"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="registerLogin">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' },
          { min: 3, max: 10, message: '账号长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '账号长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }   
    }
  },
  methods: {
    registerLogin() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm);
        if (res.meta.status !== 200) return this.$message.error('登陆失败！');
        this.$message.success('登录成功！');

        // 登录成功后的token 保存到seesionStorage
        window.sessionStorage.setItem('token', res.data.token);
        // 登录成功之后，自动跳转home页面
        this.$router.push('/home').catch(err => {
          console.log(err);
        });
      })
    },
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    }
  }
}
</script>

<style scoped lang="scss">
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  top: 50%;
  left: 50%;
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  background-color: #ffffff;
  transform: translate(-50%, -50%);
}
.avatar-box {
  left: 50%;
  width: 130px;
  height: 130px;
  padding: 10px;
  position: absolute;
  border-radius: 50%;
  border: 1px solid #eee;
  background-color: #ffffff;
  box-shadow: 0 0 10px #dddddd;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
