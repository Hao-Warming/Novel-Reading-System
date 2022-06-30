<template>
  <div class="message-container">
    <el-table
      :data="
        tableData.filter(
          (data) =>
            !search || data.user_id.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column label="id" prop="_id"> </el-table-column>
      <el-table-column label="内容" prop="content"> </el-table-column>
      <el-table-column label="账号" prop="user_id"></el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)"
            >reply</el-button
          >
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="10">
      </el-pagination>
    </div> -->

    <!-- 弹窗 -->
    <el-dialog
      title="回复留言"
      :visible.sync="dialogFormVisible"
      width="500px"
      :show-close="false"
      class="dialog"
    >
      <div class="message-content">
        <el-input type="textarea" v-model="form.message" disabled></el-input>
        <el-input v-model="form.to" disabled class="reply-style"></el-input>
        <el-input type="textarea" v-model="form.content"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      tableData: [],

      search: "",

      //弹窗
      formLabelWidth: "50px",
      dialogFormVisible: false,

      form: {
        message: "", //留言内容
        to: "",
        content: "", //回复留言的内容
      },
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

    // 回复留言
    async handleForm() {
      try {
        let me = this;
        console.log(me.form);
        await me.$store.dispatch("user/replyMessage", me.form);
        me.dialogFormVisible = false;
        //提示回复留言成功
        Message.success("回复留言成功");
      } catch (err) {
        //提示回复留言失败
        Message.error("回复留言失败");
      }
    },

    async init() {
      let me = this;
      try {
        await me.$store.dispatch("user/getMessageList");
        // // console.log( me.$store.getters.userList );
        me.tableData = me.$store.getters.messageList;
      } catch (err) {
        console.log(err);
      }
    },

    //删除留言
    async handleDelete(item) {
      // console.log(item);
      let me = this;
      try {
        await me.$store.dispatch("user/deleteMessage", item);
        await me.init();
      } catch (err) {
        console.log(err);
      }
    },

    //显示弹窗
    handleEdit(data) {
      console.log(data);
      let me = this;
      me.dialogFormVisible = true;
      me.form = {
        message: data.content,
        to: data.user_id,
        content: "",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.message-container {
  margin: 30px;
  .pagination {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
  .reply-style {
    padding: 30px 0;
  }
}
</style>
