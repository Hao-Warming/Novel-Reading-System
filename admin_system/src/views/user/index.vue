<template>
  <div class="user-container">
    <!-- <el-button type="primary">批量删除</el-button> -->
    <el-table
      :data="
        tableData.filter(
          (data) =>
            !search ||
            data.name.toLowerCase().includes(search.toLowerCase()) ||
            data.loginId.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="id" prop="_id"> </el-table-column>
      <el-table-column label="昵称" prop="name"> </el-table-column>
      <el-table-column label="账号" prop="loginId"></el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          {{ scope.row.isAdministrator ? "管理员" : "普通用户" }}
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">Edit</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            v-if="!scope.row.isAdministrator"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="10">
      </el-pagination>
    </div>

    <!-- 弹窗 -->
    <el-dialog
      title="编辑"
      :visible.sync="dialogFormVisible"
      width="500px"
      :show-close="false"
      class="dialog"
    >
      <el-form :model="form">
        <!-- id -->
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input
            v-model="form._id"
            autocomplete="off"
            size="small"
            :disabled="true"
            style="width: 100px"
          ></el-input>
        </el-form-item>
        <!-- 昵称 -->
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            autocomplete="off"
            size="small"
            placeholder="请输入新的昵称"
          ></el-input>
        </el-form-item>

        <!-- 头像 -->
        <el-form-item label="头像" :label-width="formLabelWidth" size="small">
          <el-input
            v-model="form.avatarUrl"
            autocomplete="off"
            size="small"
            placeholder="请输入图片地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],

      search: "",

      //弹窗
      formLabelWidth: "50px",
      form: {
        _id: "1",
        name: "",
        avatarUrl: "",
      },
      dialogFormVisible: false,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    // },

    // 编辑用户
    async handleForm() {
      try {
        let me = this;
        await me.$store.dispatch("user/editUser", me.form);
        await me.init();
        me.dialogFormVisible = false;
      } catch (err) {
        console.log(err);
      }
    },

    async init() {
      let me = this;
      try {
        await me.$store.dispatch("user/getUserList", "");
        // console.log( me.$store.getters.userList );
        me.tableData = me.$store.getters.userList;
      } catch (err) {
        console.log(err);
      }
    },

    //删除用户
    async handleDelete(item) {
      // console.log(item);
      let me = this;
      try {
        await me.$store.dispatch("user/deleteUser", item);
        await me.init();
      } catch (err) {
        console.log(err);
      }
    },

    //显示弹窗
    handleEdit(data) {
      let me = this;
      me.dialogFormVisible = true;
      me.form = {
        _id: data._id,
        name: data.name,
        avatarUrl: data.avatarUrl,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.user-container {
  margin: 30px;
  .pagination {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
}
</style>
