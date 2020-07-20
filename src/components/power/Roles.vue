<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable
                  @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable
                      @close="removeRightById(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"
                      :class="[i3 === 0 ? '' : '']"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id" closable
                      @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini"
              type="primary"
              icon="el-icon-edit">编辑</el-button>
            <el-button size="mini"
              type="danger"
              icon="el-icon-delete">删除</el-button>
            <el-button size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" width="50%"
      :visible.sync="setRightDialogVisible"
      @close="setRightDialogClosed">
      <el-tree :data="rightsList"
        :props="treeProps"
        :default-checked-keys="defkeys"
        node-key="id"
        ref="treeRef"
        show-checkbox
        default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary"
          @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 当前即将分配权限的角色id
      roleId: '',
      setRightDialogVisible: false,
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      roleList: [],
      rightsList: [],
      // 默认选中的节点Id值的数字
      defkeys: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status == 200) {
        this.roleList = res.data
      } else {
        return this.$message.error('获取角色列表失败！')
      }
    },
    // 根据ID删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除文件, 是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult == 'confirm') {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status == 200) {
        //   this.getRolesList()
          role.children = res.data
          this.$message.success('删除权限成功！')
        } else {
          return this.$message.error('删除权限失败！')
        }
      } else {
        return this.$message.info('取消了删除！')
      }
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status == 200) {
        // 把获取到的权限数据保存到 data 当中
        this.rightsList = res.data
        // 获取三级节点的ID
        this.getLeafKeys(role, this.defkeys)
        this.setRightDialogVisible = true
      } else {
        return this.$message.error('获取权限数据失败！')
      }
    },
    // 通过递归，获取角色下所有三级权限的id
    getLeafKeys(node, arr) {
      if (!node.children) { return arr.push(node.id) }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defkeys = []
    },
    // 为角色分配权限，确定按钮
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status == 200) {
        this.$message.success('分配权限成功!')
        this.getRolesList()
        this.setRightDialogVisible = false
      } else {
        return this.$message.error('分配权限失败!')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eeeeee;
}
.bdbottom {
  border-bottom: 1px solid #eeeeee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>