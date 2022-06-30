<template>
  <div class="chapter-container">
    <van-nav-bar
      :title="$store.getters.bookObj.bookName"
      left-arrow
      @click-left="backPath"
    />
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="item._id"
        @click="goDetail(item)"
      >
        <template #title>
          <div class="inner-container">
            <p>{{ item.title }}</p>
          </div>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
    };
  },
  methods: {
    //返回路径
    backPath() {
      this.$router.push("/book");
    },

    //加载
    onLoad() {
      let me = this;
      me.list = me.$store.getters.chapterObj.data;
      setTimeout(async () => {
        try {
          let target = me.$store.getters.chapterObj;
          await me.$store.dispatch("book/getChapters", {
            id: me.$store.getters.bookObj._id,
            num: target.num,
          });
          me.list = me.$store.getters.chapterObj.data;
          this.loading = false;
        } catch (err) {
          console.log(err);
          this.finished = true;
        }
      }, 1000);
    },

    //前往章节详情
    async goDetail(item) {
      let me = this;
      try {
        //先获取章节详情的数据，再进行跳转
        await me.$store.dispatch("book/getChapterDetail", {
          id: item._id,
          item: item,
        });
        //存储历史记录
        localStorage.setItem(
          "book" + me.$store.getters.bookObj._id,
          JSON.stringify(item)
        );
        this.$router.push("/detail");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chapter-container {
}
</style>>