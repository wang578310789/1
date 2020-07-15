<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/image/logo.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <span>一级菜单</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index='1-1'>
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
              <span>二级菜单</span>
              </template>
            </el-menu-item>
            <!-- <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1-1">选项1</el-menu-item>
              <el-menu-item index="1-1-2">选项2</el-menu-item>
            </el-menu-item-group> -->
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push('/login').catch(err => {
          console.log(err);
        });
      }
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  padding-left: 0;
  font-size: 20px;
  color: #ffffff;
  align-items: center;
  background-color: #373d41;
  justify-content: space-between;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    width: 50px;
    height: 50px;
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>