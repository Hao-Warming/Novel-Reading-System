<template>
  <div class="home-container">
    <div class="action-bar">
      <!-- 根据书名或者作者名筛选 -->
      <div class="left">
        <el-select v-model="conditionalValue.name" placeholder="全部">
          <el-option
            v-for="item in nameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="conditionalValue.inputValue"
          placeholder="请输入内容"
          class="action-input"
          v-if="conditionalValue.name === 1 || conditionalValue.name === 2"
        ></el-input>
        <!-- 根据是否禁用筛选 -->
        <el-select v-model="conditionalValue.enable" placeholder="全部">
          <el-option
            v-for="item in enableOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- 根据小说类型筛选 -->
        <el-select v-model="conditionalValue.bookType" placeholder="全部">
          <el-option
            v-for="item in bookTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- 根据连载/完本筛选 -->
        <el-select v-model="conditionalValue.hasCompleted" placeholder="全部">
          <el-option
            v-for="item in hasCompletedOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="right">
        <el-button type="primary" icon="el-icon-search" @click="onSearch"
          >搜索</el-button
        >
        <el-button type="primary" @click="onUpdateAll"
          >一键更新所选至最新章节</el-button
        >
      </div>
    </div>
    <div class="table-data">
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="bookName" label="书名" width="200">
        </el-table-column>
        <el-table-column prop="author" label="作者"> </el-table-column>
        <el-table-column prop="bookType" label="小说类型" width="100">
        </el-table-column>
        <el-table-column prop="sourceUrl" label="来源地址">
          <template slot-scope="scope">
            <a
              :href="scope.row.sourceUrl"
              target="_blank"
              style="color: #409eff"
              >{{ scope.row.sourceUrl }}</a
            >
          </template>
        </el-table-column>
        <el-table-column prop="imgUrl" label="小说封面" width="80">
          <template slot-scope="scope">
            <img
              :src="scope.row.imgUrl"
              alt=""
              style="width: 50px; height: 80px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="hasCompleted" label="小说状态" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.hasCompleted ? "完本" : "连载" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enable" label="使用状态" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.enable ? "启用" : "禁用" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" @click="onUpdateOne(scope.$index, scope.row)" type="warning"
              >更新章节</el-button
            >
            <el-button
              size="mini"
              type="info"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
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
        :current-page="conditionalValue.currentPage"
      >
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
        <!-- 书名 -->
        <el-form-item label="书名" :label-width="formLabelWidth">
          <el-input
            v-model="form.bookName"
            autocomplete="off"
            size="small"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <!-- 小说状态 -->
        <el-form-item
          label="小说状态"
          :label-width="formLabelWidth"
          size="small"
        >
          <el-select v-model="form.hasCompleted" placeholder="请选择小说类型">
            <el-option label="连载" :value="false"></el-option>
            <el-option label="完本" :value="true"></el-option>
          </el-select>
        </el-form-item>

        <!-- 是否启用 -->
        <el-form-item
          label="使用状态"
          :label-width="formLabelWidth"
          size="small"
        >
          <el-select v-model="form.enable" placeholder="请选择小说类型">
            <el-option label="禁用" :value="false"></el-option>
            <el-option label="启用" :value="true"></el-option>
          </el-select>
        </el-form-item>

        <!-- 小说类型 -->
        <el-form-item
          label="小说类型"
          :label-width="formLabelWidth"
          size="small"
        >
          <el-select v-model="form.bookType" placeholder="请选择小说类型">
            <el-option label="玄幻" :value="1"></el-option>
            <el-option label="科幻" :value="2"></el-option>
            <el-option label="言情" :value="3"></el-option>
            <el-option label="都市" :value="4"></el-option>
            <el-option label="网游" :value="5"></el-option>
            <el-option label="修真" :value="6"></el-option>
            <el-option label="历史" :value="7"></el-option>
            <el-option label="其他" :value="8"></el-option>
          </el-select>
        </el-form-item>

        <!-- 小说封面 -->
        <el-form-item
          label="小说封面"
          :label-width="formLabelWidth"
          size="small"
        >
          <el-input
            v-model="form.imgUrl"
            autocomplete="off"
            size="small"
            placeholder="请输入图片地址"
            style="width: 300px"
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
import { mapState, mapMutations, mapActions } from "vuex";
import { Message } from "element-ui";

export default {
  name: "Home",

  data() {
    return {
      nameOptions: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "作者名",
        },
        {
          value: 2,
          label: "书名",
        },
      ],
      enableOptions: [
        {
          value: undefined,
          label: "全部",
        },
        {
          value: true,
          label: "启用",
        },
        {
          value: false,
          label: "禁用",
        },
      ],
      bookTypeOptions: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "玄幻",
        },
        {
          value: 2,
          label: "科幻",
        },
        {
          value: 3,
          label: "言情",
        },
        {
          value: 4,
          label: "都市",
        },
        {
          value: 5,
          label: "网游",
        },
        {
          value: 6,
          label: "修真",
        },
        {
          value: 7,
          label: "历史",
        },
        {
          value: 8,
          label: "其他",
        },
      ],
      hasCompletedOptions: [
        {
          value: undefined,
          label: "全部",
        },
        {
          value: false,
          label: "连载",
        },
        {
          value: true,
          label: "完本",
        },
      ],
      crawlOptions: [
        {
          value: undefined,
          label: "全部",
        },
        {
          value: false,
          label: "未爬",
        },
        {
          value: true,
          label: "已爬",
        },
      ],

      conditionalValue: {
        name: 0,
        enable: undefined,
        bookType: 0,
        hasCompleted: undefined,
        inputValue: "", //选中name!=0的时候会显示输入框，此时输入框绑定的是该字段
        currentPage: 1,
      },

      //表格数据
      tableData: [],
      total: 0, //数据总数

      //弹窗
      dialogFormVisible: false,
      form: {
        bookName: "",
        bookType: undefined,
        imgUrl: "",
        enable: undefined,
        hasCompleted: undefined,
      },
      formLabelWidth: "100px",

      queueNum: 0, //ws工作队列，只能执行一个
      workQueue:[],  //一键更新的工作队列
    };
  },

  computed: {
    ...mapState("spider", {
      homeBookList: "homeBookList",
      homeconditionalValue: "homeConditionalValue",
      sum: "sum",
      isAdd: "isAdd",
    }),
  },

  mounted() {
    this.onSearch();
    this.set_isAdd(false);
  },
  //keep-alive专属生命钩子
  activated() {
    if (this.homeBookList.length !== 0 && !this.isAdd) {
      this.conditionalValue = this.homeconditionalValue;
      this.tableData = this.homeBookList;
      this.total = this.sum;
    } else {
      this.onSearch();
      this.set_isAdd(false);
    }
  },

  methods: {
    ...mapMutations("spider", {
      set_homebooklist: "SET_HOMEBOOKLIST",
      set_homeConditionalValue: "SET_HOMECONDITIONALVALUE",
      set_isAdd: "SET_ISADD",
    }),

    ...mapActions("spider", {
      getAllBookJson: "getAllBookJson",
      getPageBookJson: "getPageBookJson",
      deleteBook: "deleteBook",
      editBook: "editBook",
    }),

    //搜索
    onSearch() {
      var me = this;
      me.getAllBookJson(me.conditionalValue).then((res) => {
        me.tableData = res.values;
        me.total = res.total;
        me.conditionalValue.currentPage = 1;
        me.set_homeConditionalValue(me.conditionalValue);
      });
    },

    handleSelectionChange(data) {
     this.workQueue = data;
    },

    //编辑小说
    handleEdit(index, row) {
      const bookTypeMap = new Map([
        ["玄幻", 1],
        ["科幻", 2],
        ["言情", 3],
        ["都市", 4],
        ["网游", 5],
        ["修真", 6],
        ["历史", 7],
        ["其他", 8],
      ]);
      this.form = {
        bookName: row.bookName,
        bookType: bookTypeMap.get(row.bookType),
        imgUrl: row.imgUrl,
        enable: row.enable,
        hasCompleted: row.hasCompleted,
      };
      this.dialogFormVisible = true;
    },

    //处理编辑内容
    handleForm() {
      let me = this;
      me.editBook(me.form)
        .then((res) => {
          me.dialogFormVisible = false;
          Message.success(res);
          me.getPageBookJson(me.conditionalValue).then((response) => {
            me.tableData = response.values;
            me.set_homeConditionalValue(me.conditionalValue);
          });
        })
        .catch((err) => {
          Message.error(err);
        });
    },

    //删除小说
    handleDelete(index, row) {
      Message.info("正在执行删除操作");
      let me = this;
      me.deleteBook({ _id: row._id })
        .then((res) => {
          Message.success(res);
          me.tableData.splice(index, 1);
          me.set_homebooklist(me.tableData);
        })
        .catch((err) => {
          Message.error(err);
        });
    },

    //更新小说章节
    onUpdateOne(index, row) {
      //利用ws进行章节更新,不管前面已爬取的有没有爬取成功，都只爬取新增的章节。

      let me = this;
      if (!me.$ws) {
        Message({
          message: "websocket还没连接，刷新一波之后等几秒试试吧",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      };
      //简单做了个防抖
      if (me.queueNum != 0) {
        Message({
          message: "前面有人，等等再获取吧！",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      };
      me.queueNum = 1;
      Message({
        message: `${row.bookName}  正在更新...`,
        duration: 5 * 1000,
      });
      me.$ws.send(
        JSON.stringify({
          index: 2,
          data: row,
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
          message: data,
          type: "success",
          duration: 3 * 1000,
        });
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

    //一键更新全部章节
    onUpdateAll() {
      let me = this;
      if(me.workQueue.length === 0){
        Message.warning("请选中需要更新的小说");
        return;
      };
      if (!me.$ws) {
        Message({
          message: "websocket还没连接，刷新一波之后等几秒试试吧",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      };
      //简单做了个防抖
      if (me.queueNum != 0) {
        Message({
          message: "等一下再操作吧",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      };
      me.queueNum = 1;
      Message({
        message: `后台正在更新，喝口肥宅水再回来吧`,
        duration: 2 * 1000,
      });
      me.$ws.send(
        JSON.stringify({
          index: 3,
          data: me.workQueue,
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
          message: data,
          type: "success",
          duration: 3 * 1000,
        });
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

    //分页
    handleCurrentChange(val) {
      let me = this;
      me.conditionalValue.currentPage = val;
      me.getPageBookJson(me.conditionalValue).then((res) => {
        me.tableData = res.values;
        me.set_homeConditionalValue(me.conditionalValue);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  margin: 30px;
  .action-bar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    .left {
      .el-select {
        width: 100px;
        margin-right: 10px;
      }
      .action-input {
        width: 200px;
        margin-right: 10px;
      }
    }
    .right {
    }
  }
  .table-data {
  }
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .dialog {
    .el-input {
      width: 190px;
    }
  }
}
</style>
