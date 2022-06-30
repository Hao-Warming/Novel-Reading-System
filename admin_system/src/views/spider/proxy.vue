<template>
  <div class="spider-container">
    <!-- <div class="spider-config">
      <div class="left">
        配置：从第
        <el-input v-model="spiderPage.start" clearable> </el-input>
        页到第
        <el-input v-model="spiderPage.end" clearable> </el-input>
        页
      </div>
      <el-button type="primary" icon="el-icon-search" @click="onSpider">爬取</el-button>
    </div> -->
    <div class="spider-table">
      <el-table :data="proxyPool" border style="width: 100%">
        <el-table-column prop="host" label="Host" width="200"> </el-table-column>
        <el-table-column prop="port" label="端口号"> </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column prop="proxyType" label="类型"> </el-table-column>
        <el-table-column prop="from" label="来自">开心代理</el-table-column>
        <el-table-column prop="resTime" label="响应时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
    <!-- <div class="spider-pagination">
      <el-pagination background layout="prev, pager, next" :total="100">
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { Message } from 'element-ui'

export default {
  data() {
    return {
      spiderPage: {
        start: "",
        end: "",
      },
    };
  },

  computed: {
    ...mapState('spider',{
      proxyPool:'proxyPool'
    })
  },

  created() {
    this.onSpider();
    var me = this;

  },

  methods: {
    ...mapMutations('spider',{
      setProxyPoolFromStorage: 'SET_PROXYPOOL_FROM_STORAGE'
    }),

    ...mapActions('spider',{
      getProxyPool: 'getProxyPool',
      deleteIp: 'deleteIp'
    }),

    //删除单个ip
    handleDelete(index, row) {
      this.deleteIp({index}).then(()=>{
        Message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
        })
      }).catch(err=>{
         Message({
            message: err,
            type: 'error',
            duration: 5 * 1000
        })
      })
    },

    //爬取ip
    async onSpider() {
      try{
        await this.getProxyPool(this.spiderPage)
      }catch(err){
        Message({
            message: '爬取失败',
            type: 'error',
            duration: 5 * 1000
        })
      }
      // this.$ws.send('biubiubiu')
      // this.$ws.onmessage = function (e) {
      //     console.log('bababa')
      // }
    }
  },
};
</script>

<style scoped lang="scss">
.spider-container {
  .spider-config {
    display: flex;
    padding: 20px 0;
    border-bottom: 1px solid #e9eaec;
    justify-content: center;
    .left {
      width: 500px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .el-input {
        width: 100px;
      }
    }
  }
  .spider-table {
    margin: 20px auto;
    width: 1200px;
  }
  .spider-pagination {
    width: 500px;
    margin: 0 auto;
    text-align: center;
  }
}
</style>
