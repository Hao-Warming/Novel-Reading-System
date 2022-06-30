<template>
  <div class="omission-container">
    <div class="action-bar">
      <el-input
        placeholder="请输入书名"
        v-model="inputValue"
        class="input-with-select"
        size="small"
        @input="handleInput"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearch"
        ></el-button>
      </el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        v-show="isShow"
        @click="handleAllCrawl"
        >一键爬取 {{ pageValue }}</el-button
      >
    </div>
    <div class="table-data">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column prop="bookName" label="书名" width="200">
        </el-table-column>
        <el-table-column prop="title" label="章节" width="200">
        </el-table-column>
        <el-table-column prop="chapterAddress" label="来源地址">
          <template slot-scope="scope">
            <a
              :href="scope.row.chapterAddress"
              target="_blank"
              style="color: #409eff"
              >{{ scope.row.chapterAddress }}</a
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleCrawl(scope.$index, scope.row)"
              >重新爬取</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="10"
        :total="total"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { Message } from "element-ui";

export default {
  data() {
    return {
      inputValue: "", //输入框的值
      pageValue: "", //分页搜索时传到后台的值

      isShow: false, //一键按钮显示
      multipleTable: [],

      tableData: [], //表格数据

      total: 0, //数据总数
      currentPage: 1, //当前页码

      queueNum: 0, //ws工作队列
    };
  },

  computed: {
    // ...mapState("omission", {
    //   omissionList: "omissionList",
    // }),
  },

  mounted() {
    this.handleSearch();
  },

  activated() {
    this.handleSearch();
  },

  methods: {
    // ...mapMutations("omission", {
    //   set_omissionlist: "SET_OMISSIONLIST",
    // }),

    ...mapActions("omission", {
      getOmissionList: "getOmissionList",
      getOmissionPageList: "getOmissionPageList",
    }),

    //通过输入框内容控制一键按钮样式
    handleInput(e) {
      if (e.trim() === "") {
        this.isShow = false;
      }
    },

    //搜索查询
    handleSearch() {
      let me = this;
      let value = me.inputValue.trim();
      me.getOmissionList(value)
        .then((res) => {
          me.tableData = res.values;
          if (me.tableData.length != 0 && value !== "") {
            me.isShow = true;
          } else {
            me.isShow = false;
          }
          me.total = res.count;
          me.pageValue = value;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //爬取单条数据
    handleCrawl(index, row) {
      let me = this;
      if (!me.$ws) {
        Message({
          message: "websocket还没连接，刷新一波之后等几秒试试吧",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      }
      //简单做了个防抖
      if (me.queueNum != 0) {
        Message({
          message: "前面有人，等等再获取吧！",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      }
      me.queueNum = 1;
      Message({
        message: `正在重新爬取...`,
        duration: 2 * 1000,
      });
      me.$ws.send(
        JSON.stringify({
          index: 4,
          data: row,
        })
      );
      me.$ws.onmessage = async function (e) {
        let { data, msg } = JSON.parse(e.data);
        if (!data) {
          Message({
            message: msg,
            type: "error",
            duration: 3 * 1000,
          });
          me.queueNum = 0;
          return;
        }
        Message({
          message: data,
          type: "success",
          duration: 3 * 1000,
        });
        me.queueNum = 0;
        //重新拉一下代码
        await me.handleCurrentChange(me.currentPage);
      };
      me.$ws.onerror = function (evt) {
        Message({
          message: "websocket连接失败，请刷新浏览器",
          type: "error",
          duration: 3 * 1000,
        });
        me.queueNum = 0;
      };
    },

    //一键爬取小说所有遗漏/错误章节
    handleAllCrawl() {
      let me = this;
      if (!me.$ws) {
        Message({
          message: "websocket还没连接，刷新一波之后等几秒试试吧",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      }
      //简单做了个防抖
      if (me.queueNum != 0) {
        Message({
          message: "前面有人，等等再获取吧！",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      }
      me.queueNum = 1;
      Message({
        message: `${me.pageValue}  正在重新爬取...`,
        duration: 2 * 1000,
      });
      me.$ws.send(
        JSON.stringify({
          index: 5,
          data: me.pageValue,
        })
      );
      me.$ws.onmessage = async function (e) {
        let { data, msg } = JSON.parse(e.data);
        if (!data) {
          Message({
            message: msg,
            type: "error",
            duration: 3 * 1000,
          });
          me.queueNum = 0;
          await me.handleCurrentChange(me.currentPage);
          return;
        }
        Message({
          message: data,
          type: "success",
          duration: 3 * 1000,
        });
        me.queueNum = 0;
        //重新拉一下代码
        await me.handleCurrentChange(me.currentPage);
      };
      me.$ws.onerror = function (evt) {
        Message({
          message: "websocket连接失败，请刷新浏览器",
          type: "error",
          duration: 3 * 1000,
        });
        me.queueNum = 0;
      };

    },

    //分页
    handleCurrentChange(val) {
      let me = this;
      me.currentPage = val;
      console.log(me.currentPage, me.pageValue);
      me.getOmissionPageList({ page: me.currentPage, value: me.pageValue })
        .then((res) => {
          me.tableData = res.values;
          me.total = res.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.omission-container {
  margin: 30px;
  .action-bar {
    display: flex;
    padding-bottom: 20px;
    .input-with-select {
      width: 250px;
      margin-right: 15px;
    }
  }
  .table-data {
  }
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
