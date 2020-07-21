<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
            @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 树形表格 -->
      <tree-table class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-row-hover="false"
        show-index border
        index-text="#">
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen;" />
          <i class="el-icon-error" v-else 
            style="color: red;" />
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag size="mini"
            v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success"
            v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scope">
          <el-button type="primary"
            icon="el-icon-edit"
            size="mini">编辑{{scope.row.cat_level}}</el-button>
          <el-button type="danger"
            icon="el-icon-delete"
            size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" width="50%"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader v-model="selectedKeys"
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCateDialogVisible: false,
      total: 0,
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 添加分类的表单数据对象
      addCateForm: {
        // 要添加分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示列，使用 template 可以定位模板
          type: 'template',
          // 定义模板时，将对应的作用域插槽
          template: 'isok'
        },
        {
          label: '排序',
          // 表示列，使用 template 可以定位模板
          type: 'template',
          // 定义模板时，将对应的作用域插槽
          template: 'order'
        },
        {
          label: '操作',
          // 表示列，使用 template 可以定位模板
          type: 'template',
          // 定义模板时，将对应的作用域插槽
          template: 'opt'
        }
      ],
      // 父级分类的列表
      parentCateList: [],
      // 选中的父级分类的 id 数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status == 200) {
        this.cateList = res.data.result
        this.total = res.data.total
      } else {
        return this.$message.error()
      }
    },
    // 监听 pagesize 变化
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 变化
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 展示添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 之后展示对话框
      this.addCateDialogVisible = true
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status == 200) {
        this.parentCateList = res.data
      } else {
        return this.$message.error('获取父级分类数据失败!')
      }
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys);
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就证明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status == 200) {
          this.$message.success('添加分类成功!')
          this.getCateList()
          this.addCateDialogVisible = false
        } else {
          return this.$message.error('添加分类失败!')
        }
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>