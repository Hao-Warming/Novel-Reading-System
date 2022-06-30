<template>
  <div class="detail-container">
    <div class="inner">
      <h2>
        {{
          $store.getters.chapterDetail
            ? $store.getters.chapterDetail.item.title
            : ""
        }}
      </h2>
      <div
        class="content"
        v-html="
          $store.getters.chapterDetail
            ? $store.getters.chapterDetail.data.content
            : ''
        "
      ></div>
    </div>
    <div class="operate">
      <van-button plain color="#cdb38b" @click="goPrev">上一章</van-button>
      <van-button plain color="#cdb38b" @click="backChapter">目录</van-button>
      <van-button plain color="#cdb38b" @click="goNext">下一章</van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      extendStyle: false,
    };
  },
  methods: {
    async goPrev() {
      try {
        let me = this;
        //拉取相关数据
        await me.$store.dispatch("book/getOtherChapterDetail", {
          num: me.$store.getters.chapterDetail.item.num,
          book_id: me.$store.getters.bookObj._id,
          operate: "prev",
        });
        window.scrollTo(0, 0); //返回顶部
        //存储历史记录
        localStorage.setItem(
          "book" + me.$store.getters.bookObj._id,
          JSON.stringify(me.$store.getters.chapterDetail.item)
        );
      } catch (err) {
        if (err == "没有内容了") {
          Toast.fail("已经是第一章了");
        }
      }
    },

    async goNext() {
      try {
        let me = this;
        //拉取相关数据
        await me.$store.dispatch("book/getOtherChapterDetail", {
          num: me.$store.getters.chapterDetail.item.num,
          book_id: me.$store.getters.bookObj._id,
          operate: "next",
        });
        window.scrollTo(0, 0); //返回顶部
        //存储历史记录
        localStorage.setItem(
          "book" + me.$store.getters.bookObj._id,
          JSON.stringify(me.$store.getters.chapterDetail.item)
        );
      } catch (err) {
        if (err == "没有内容了") {
          Toast.fail("已经是最后一章了");
        }
      }
    },

    backChapter() {
      this.$router.push("/chapter");
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-container {
  background-color: #cdb38b;
  h2 {
    margin: 0 auto;
    text-align: center;
    padding: 1.5rem 0 2rem;
  }
  .content {
    font-size: 1.8rem;
    padding: 0 2rem;
  }
  .operate {
    display: flex;
    justify-content: space-evenly;
    padding: 2rem 0 20rem;
    .van-button--normal {
      font-size: 1.5rem;
    }
  }
}
</style>