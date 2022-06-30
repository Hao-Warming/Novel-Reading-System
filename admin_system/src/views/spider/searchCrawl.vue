<template>
  <div class="searchCrawl-container">
    <div class="search-config">
      <div class="config-website">
        <h3>搜索网站:</h3>
        <div class="website-radio">
          <el-radio-group v-model="websiteId">
            <el-radio :label="0">全本小说</el-radio>
            <!-- <el-radio :label="1">爱下书</el-radio>
              <el-radio :label="2">笔趣趣</el-radio> -->
          </el-radio-group>
        </div>
      </div>
      <div class="config-bookName">
        <h3>搜索小说名:</h3>
        <div class="bookName-input">
          <el-input
            v-model="bookNameInput"
            placeholder="请输入小说名"
          ></el-input>
        </div>
      </div>
      <div class="config-proxy">
        <h3>是否开启代理：</h3>
        <el-switch v-model="enable"> </el-switch>
      </div>
      <el-button
        type="primary"
        icon="el-icon-search"
        style="height: 40px"
        @click="onClick"
        >搜索</el-button
      >
    </div>
    <div class="search-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="bookname" label="书名"> </el-table-column>
        <el-table-column prop="author" label="作者"> </el-table-column>
        <el-table-column prop="origin" label="来源"> </el-table-column>
        <el-table-column prop="bookUrl" label="爬取地址" sortable>
          <template slot-scope="scope">
            <a
              :href="scope.row.bookUrl"
              target="_blank"
              style="color: #409eff"
              >{{ scope.row.bookUrl }}</a
            >
          </template>
        </el-table-column>
        <el-table-column prop="crawl" label="爬取">
          <template slot-scope="scope">
            <span v-if="scope.row.hasData === 1">已获取</span>
            <span
              style="color: #409eff; cursor: pointer"
              v-else
              @click="onClickReptileTool(scope.row)"
              >点击获取</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { Message } from "element-ui";

export default {
  data() {
    return {
      enable: false, //是否使用代理
      websiteId: 0,
      bookNameInput: "",
      tableData: [
        // {
        //   bookname: "2016-05-02",
        //   author: "王小虎",
        //   origin: "上海市普陀区金沙江路 1518 弄",
        //   url: "https://www.baidu.com",
        //   hasData: 1,   //0表示没有，1表示有该数据
        // },
      ],
      loading: false,
      queueNum: 0, //ws工作队列，只能执行一个
    };
  },

  computed: {
    ...mapState("spider", {
      bookList: "bookList",
      book_name: "bookName",
    }),
  },

  created() {
    this.tableData = this.bookList;
    this.bookNameInput = this.book_name;
  },
  mounted() {},

  methods: {
    ...mapMutations("spider", {
      set_booklist: "SET_BOOKLIST",
      set_bookname: "SET_BOOKNAME",
      set_isAdd:"SET_ISADD"
    }),

    ...mapActions("spider", {
      getBooksJson: "getBooksJson",
      addBookAndChapter: "addBookAndChapter",
    }),

    //获取小说
    onClickReptileTool(params) {
      //走HTTP请求
      // Message({
      //   message: '正在操作，请稍等',
      //   duration: 3 * 1000
      // });
      // this.loading = true;
      // var me = this;
      // //传websiteId、isProxy、bookUrl
      // me.addBookAndChapter({
      //   bookUrl: params.bookUrl,
      //   isProxy: me.enable,
      //   websiteId: me.websiteId
      // }).then(res=>{
      //   Message({
      //       message: '添加成功',
      //       type: 'success',
      //       duration: 3 * 1000
      //   });
      //   params.hasData = 1;   //变成已获取
      //   me.set_booklist(me.tableData);
      // }).catch(err=>{
      //    Message({
      //       message: err,
      //       type: 'error',
      //       duration: 3 * 1000
      //   });
      //    this.loading = false;
      // })

      //走ws请求
      var me = this;
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
        message: "这个操作较久，请稍等",
        duration: 2 * 1000,
      });
      // me.loading = true;
      //传websiteId、isProxy、bookUrl
      me.$ws.send(
        JSON.stringify({
          index: 1,
          data: {
            bookUrl: params.bookUrl,
            isProxy: me.enable,
            websiteId: me.websiteId,
          },
        })
      );
      me.$ws.onmessage = function (e) {
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
          message: "添加成功",
          type: "success",
          duration: 3 * 1000,
        });
        // me.loading = false;
        params.hasData = 1; //变成已获取
        me.set_booklist(me.tableData);
        me.set_isAdd(true);
        me.queueNum = 0;
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

    //搜索
    onClick() {
      if (this.bookNameInput.length == 0) {
        //没输入书名
        Message({
          message: "玩我呢？都还没输入书名！",
          type: "warning",
          duration: 3 * 1000,
        });
        return;
      }
      //先清空表格和state状态
      this.tableData = [];
      this.set_booklist([]);
      this.loading = true;
      let bookNameInput = this.bookNameInput.trim();
      this.getBooksJson({
        bookname: bookNameInput,
        websiteid: this.websiteId,
        isProxy: this.enable,
      })
        .then((res) => {
          this.tableData = res;
          this.set_bookname(this.bookNameInput);
          this.loading = false;
        })
        .catch((err) => {
          Message({
            message: err,
            type: "error",
            duration: 3 * 1000,
          });
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.searchCrawl-container {
  margin: 15px;
  .search-config {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .config-website {
      display: flex;
      align-items: center;
      h3 {
        font-size: 16px;
        margin-right: 15px;
      }
    }
    .config-bookName {
      display: flex;
      align-items: center;
      h3 {
        font-size: 16px;
        margin-right: 15px;
      }
      .bookName-input {
      }
    }
    .config-proxy {
      display: flex;
      align-items: center;
      h3 {
        font-size: 16px;
        margin-right: 15px;
      }
    }
  }
  .search-table {
    width: 1250px;
    margin: 50px auto 0;
  }
}
</style>
