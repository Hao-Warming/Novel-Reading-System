<template>
  <div class="comment-container">
    <van-nav-bar
      :title="$store.getters.bookObj ? $store.getters.bookObj.bookName : ''"
      left-arrow
      @click-left="backPath"
    />
    <van-list>
      <van-cell
        v-for="(item, index) in $store.getters.commentList"
        :key="index"
      >
        <template #title>
          <div class="inner-container">
            <div class="left">
              <div class="pic">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="desc">
                <h3>{{ item.user.name }}</h3>
                <p>{{ item.item.content }}</p>
              </div>
              <div class="date">
                <p>{{ item.item.createdAt }}</p>
                <p @click="handlePopup(item)">查看全部回复</p>
              </div>
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>
    <van-tabbar :placeholder="true">
      <van-tabbar-item>
        <div class="field-container">
          <van-field
            v-model="text"
            class="field"
            style="font-size: 1.6rem"
            placeholder="留下你的脚印吧~"
          />
          <img src="../../assets/images/send.png" @click="addComment" />
        </div>
      </van-tabbar-item>
    </van-tabbar>

    <!-- 弹窗 -->
    <van-popup
      v-model="showPopup"
      round
      position="bottom"
      :style="{ height: '70%' }"
      class="popup-container"
    >
      <van-list class="reply-list">
        <van-cell
          v-for="(item, index) in $store.getters.replyList"
          :key="index"
        >
          <template #title>
            <div class="inner-container">
              <div class="left">
                <div class="pic">
                  <img :src="item.user.avatarUrl" alt="" />
                </div>
                <div class="desc">
                  <h3>{{ item.user.name }}</h3>
                  <p>{{ item.item.content }}</p>
                </div>
                <div class="date">
                  <p>{{ item.item.createdAt }}</p>
                </div>
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>
      <van-tabbar :placeholder="true">
        <van-tabbar-item>
          <div class="field-container">
            <van-field
              v-model="replyText"
              class="field"
              style="font-size: 1.6rem"
              placeholder="留下你的脚印吧~"
            />
            <img src="../../assets/images/send.png" @click="addReply" />
          </div>
        </van-tabbar-item>
      </van-tabbar>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      text: "", //评论框内容
      fromPath: "", //返回的路径

      replyText: "", //回复框内容
      showPopup: false, //回复弹窗
      commentBy: null, //被回复
    };
  },

  mounted() {
    this.onload();
  },

  methods: {
    //返回路径
    backPath() {
      this.$router.push(this.fromPath);
    },

    //添加评论
    async addComment() {
      let me = this;

      try {
        if (me.text.trim() == "") {
          Toast.fail("你得先写些东西啊");
          return;
        }
        await me.$store.dispatch("book/addComment", {
          userName: me.$store.getters.user.username,
          bookId: me.$store.getters.bookObj._id,
          content: me.text,
        });
        Toast.success("评论成功");
        me.text = "";
      } catch (err) {
        console.log(err);
      }
    },

    //拉取评论列表数据
    async onload() {
      let me = this;

      try {
        await me.$store.dispatch("book/getAllCommentByBook", {
          // userName: me.$store.getters.user.username,
          bookId: me.$store.getters.bookObj._id,
          // content: me.text,
        });
      } catch (err) {
        console.log(err);
      }
    },

    //控制弹窗
    handlePopup(item) {
      this.commentBy = item;
      this.getReplyData();
      this.showPopup = true;
      
    },

    //拉取回复列表数据
    async getReplyData() {
      let me = this;

      try {
        await me.$store.dispatch("book/getAllReplyByComment", {
          commentId: me.commentBy.item._id,
        });
      } catch (err) {
        console.log(err);
      }
    },

    //添加回复
    async addReply() {
      let me = this;

      try {
        if (me.replyText.trim() == "") {
          Toast.fail("你得先写些东西啊");
          return;
        }
        await me.$store.dispatch("book/addReply", {
          userName: me.$store.getters.user.username,
          bookId: me.$store.getters.bookObj._id,
          content: me.replyText,
          commentId: me.commentBy.item._id,
          // toId:me.commentBy.user._id
        });
        Toast.success("回复成功");
        me.replyText = "";
        me.commentBy = null;
      } catch (err) {
        console.log(err);
      }
    },
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.path == "/") {
        //隐藏返回图标
        vm.isIconShow = false;
        return;
      } else {
        // 通过 `vm` 访问组件实例
        vm.fromPath = from.path;
      }
    });
  },
};
</script>

<style scoped lang="scss">
.comment-container {
  .inner-container {
    padding: 0 1rem;
    .left {
      display: flex;
      .pic {
        position: relative;
        left: -1rem;
        top: 1rem;
        img {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
        }
      }
      .desc {
        font-size: 1.3rem;
        margin-left: 0.5rem;
        h3 {
          position: relative;
          bottom: 1rem;
          color: #6495ed;
        }
        p {
          position: relative;
          bottom: 2rem;
        }
      }
      .date {
        position: absolute;
        bottom: 0;
        left: 6rem;
        color: #999;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        // p:nth-child(1) {
        // }
        p:nth-child(2) {
          margin-left: 1rem;
          color: #8b8989;
        }
      }
    }
    .right {
      .van-icon {
        font-size: 2.5rem;
      }
    }
  }
  .van-tabbar {
    .field-container {
      width: 100%;
      border-color: #6495ed;
      width: 30rem;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .field {
        width: 24rem;
      }
      img {
        display: block;
        width: 3rem;
        height: 3rem;
      }
    }
    .reply-list {
    }
  }

  .popup-container {
    background: #e9f1f6;
    .field-container {
      position: fixed;
      bottom: 0;
      left: 4rem;
      margin: 0 auto;
      width: 30rem;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .field {
        // position: absolute;
        width: 24rem;
      }
      img {
        display: block;
        width: 3rem;
        height: 3rem;
      }
    }
  }
}
</style>