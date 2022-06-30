<template>
  <div class="type-container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <van-nav-bar
        title="分类"
        :fixed="true"
        :placeholder="true"
        :safe-area-inset-top="true"
      >
        <template #right>
          <van-icon name="search" size="25" @click="goSearch"/>
        </template>
      </van-nav-bar>
    </div>
    <div class="content">
      <div class="sidebar">
        <van-sidebar v-model="activeKey" @change="onChange">
          <van-sidebar-item title="玄幻" />
          <van-sidebar-item title="科幻" />
          <van-sidebar-item title="言情" />
          <van-sidebar-item title="都市" />
          <van-sidebar-item title="网游" />
          <van-sidebar-item title="修真" />
          <van-sidebar-item title="历史" />
          <van-sidebar-item title="其他" />
        </van-sidebar>
      </div>

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
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      activeKey: 0,

      list: [],
      loading: false,
      finished: false,

      index: 1, //当前类型索引
    };
  },

  async mounted() {
    try {
      let me = this;
      if (me.$store.getters.typeListObj[me.index].data.length == 0) {
        //初始化
        await me.init();
      }
      me.list = me.$store.getters.typeListObj[me.index].data;
    } catch (err) {
      console.log(err);
    }
    // console.log(me.$store.getters.typeListObj);
  },

  methods: {
    async onChange(index) {
      let me = this;
      me.index = index + 1;
      let target = me.$store.getters.typeListObj[me.index];
      try {
        if (target.data.length !== 0) {
          //如果已经存在有数据，无需再拉接口
          me.list = target.data;
          return;
        }
        let result = await me.$store.dispatch("book/getTypeList", {
          type: me.index,
          num: target.num,
        });
        me.list = me.$store.getters.typeListObj[me.index].data;
      } catch (err) {
        // Toast.fail(err);
        me.list = me.$store.getters.typeListObj[me.index].data;
      }
    },

    onLoad() {
      let me = this;
      setTimeout(async () => {
        try {
          let target = me.$store.getters.typeListObj[me.index];
          await me.$store.dispatch("book/getTypeList", {
            type: me.index,
            num: target.num,
          });
          me.list = me.$store.getters.typeListObj[me.index].data;
          me.loading = false;
        } catch (err) {
          this.finished = true;
        }
      }, 1000);
    },

    //初始化
    async init() {
      let me = this;
      try {
        await me.$store.dispatch("book/getTypeList", {
          type: me.index,
          num: 1,
        });
      } catch (err) {
        // Toast.fail(err);
        throw err;
      }
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
      } catch (err) {}
    },

    //跳转到搜索页面
    goSearch(){
      this.$router.push('/search')
    }
  },
};
</script>

<style scoped lang='scss'>
.type-container {
  .content {
    display: flex;
    .sidebar {
      height: 200rem;
      width: 8rem;
      background-color: #f7f8fa;
      .van-sidebar {
        position: fixed;
      }
    }
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
}
</style>
