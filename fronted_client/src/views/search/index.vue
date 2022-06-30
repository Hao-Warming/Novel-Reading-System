<template>
  <div class="search-container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="backPath" />
    <van-search
      v-model="value"
      shape="round"
      background="#6495ED"
      placeholder="请输入书名"
      show-action
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>

    <!-- 书籍列表 -->
    <div class="list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item._id" @click="goBook(item)">
          <template #title>
            <div class="inner-container">
              <div class="pic">
                <img :src="item.imgUrl" alt="" />
              </div>
              <div class="desc">
                <h3>{{ item.bookName }}</h3>
                <p>作者：{{ item.author }}</p>
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import { getSearchListApi } from "@/api/book";
export default {
  data() {
    return {
      value: "",

      list: [],
      loading: false,
      finished: false,

      fromPath: "", //传过来的路径
      isIconShow: true,

      currentPage: 1, //当前页码
    };
  },
  methods: {
    async onSearch() {
      try {
        let me = this;
        if (me.value.trim() == "") {
          me.currentPage = 1;
          me.list = [];
          return;
        }
        //先清空数据
        me.currentPage = 1;
        me.list = [];
        let params = JSON.stringify({
          currentPage: me.currentPage,
          value: me.value,
        });
        let result = await getSearchListApi(params);
        let { data } = result;
        me.currentPage = data.num;
        me.list = data.data;
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },

    //返回路径
    backPath() {
      this.$router.push("/type");
    },

    //跳转到小说主页
    async goBook(item) {
      try {
        let me = this;
        me.$store.commit("book/SET_BOOKOBJ", item);
        me.$store.commit("book/SET_CHAPTER_OBJ", {
          num: 1,
          data: [],
        });

        //拉取相关数据
        await me.$store.dispatch("book/getChapterAndComment", {
          id: item._id,
        });

        //跳转到小说主页
        me.$router.push("/book");
      } catch (err) {
        console.log(err);
      }
    },

    onLoad() {
      let me = this;
      setTimeout(async () => {
        try {
          //先清空数据
          let params = JSON.stringify({
            currentPage: me.currentPage,
            value: me.value,
          });
          let result = await getSearchListApi(params);
          let { data } = result;
          me.currentPage = data.num;
          if (data.data.length == 0) {
            console.log("1");
            me.finished = true;
          } else {
            console.log("2");
            me.list.concat(data.data);
            me.loading = false;
          }
        } catch (err) {
          console.log("3");
          me.finished = true;
          console.log(err);
        }
        // try {
        //   let target = me.$store.getters.typeListObj[me.index];
        //   await me.$store.dispatch("book/getTypeList", {
        //     type: me.index,
        //     num: target.num,
        //   });
        //   me.list = me.$store.getters.typeListObj[me.index].data;
        //   me.loading = false;
        // } catch (err) {
        //   this.finished = true;
        // }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-container {
  .list {
    flex: 1 1 auto;
    .inner-container {
      display: flex;
      .pic {
        img {
          width: 7rem;
          height: 9rem;
        }
      }
      .desc {
        flex: 1 1 auto;
        font-size: 1.3rem;
        margin-left: 1.2rem;
        p {
          color: #999;
        }
      }
    }
  }
}
</style>