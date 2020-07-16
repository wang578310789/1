<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/image/logo.png" alt="">
        <span>蟑螂恶霸的vue</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409bff"
                 router
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''"  v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItme.path"
              v-for="subItme in item.children"
              :key="subItme.id"
              @click="saveNavState('/' + subItme.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
              <span>{{subItme.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont iconusers',
        '103': 'iconfont iconego-boxfull',
        '101': 'iconfont iconshangpingouwudai2',
        '102': 'iconfont icondanju-tianchong',
        '145': 'iconfont iconbaobiao'
      },
      // 侧边栏是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push('/login').catch(err => {
          console.log(err);
        });
      },
      async getMenuList() {
        // 获取侧边栏数据
        const {data: res} = await this.$http.get('menus');
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menuList = res.data;
      },
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
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
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>