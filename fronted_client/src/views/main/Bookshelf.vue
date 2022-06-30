<template>
  <div class="bookshelf-container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <van-nav-bar
        title="我的书架"
        :fixed="true"
        :placeholder="true"
        :safe-area-inset-top="true"
      />
    </div>
    <!-- 登陆的页面 -->
    <div class="login-page" v-if="isLogin">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list>
          <van-cell
            v-for="item in $store.getters.bookSelves"
            :key="item._id"
            @click="goBook(item)"
          >
            <template #title>
              <div class="inner-container">
                <div class="left">
                  <div class="pic">
                    <img :src="item.imgUrl" alt="" />
                  </div>
                  <div class="desc">
                    <h3>{{ item.bookName }}</h3>
                    <p>作者：{{ item.author }}</p>
                  </div>
                </div>
                <div class="right" @click.stop="showPop(item)">
                  <van-icon name="more-o" />
                </div>
              </div>
            </template>
          </van-cell>
        </van-list>
      </van-pull-refresh>

      <!-- 编辑弹窗 -->
      <van-popup
        v-model="show"
        round
        position="bottom"
        :style="{ height: '30%' }"
        @closed="onClosePopup"
      >
        <div class="tips">
          正在操作：<span>{{ book.bookName }}</span>
        </div>
        <div class="popup">
          <van-button type="primary" @click.stop="readBookComment">查看书评</van-button>
          <van-button type="danger" @click.stop="removeBook"
            >删除本书</van-button
          >
        </div>
      </van-popup>
    </div>
    <!-- 没有登陆的页面 -->
    <div class="no-login-page" v-if="!isLogin">
      <van-button color="#6495ED" round @click="goLogin"
        >你还没登陆，快去登陆吧~</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: true, //是否已登陆

      // list: [],
      // loading: false,
      // finished: false,
      refreshing: false,

      show: false, //弹窗

      book: {}, //当前操作目标
    };
  },

  mounted() {
    let me = this;
    if (me.$store.getters.bookSelves.length == 0) {
      me.getInfo();
    }
  },

  methods: {
    //拉取信息
    async getInfo() {
      let me = this;
      if (!me.$store.getters.user) {
        try {
          //未登录,需要拉取
          await me.$store.dispatch("user/getInfo");
        } catch (err) {
          //如果没有用户信息的Token，应该会走到这里
          me.isLogin = false;
        }
      }

      //有用户信息（经过上面的用户信息拉取，如果有的话都会进入到这里）
      if (me.$store.getters.user) {
        try {
          //拉取书架列表
          await me.$store.dispatch("book/getBookSelfList", {
            userName: me.$store.getters.user.username,
          });
        } catch (err) {
          console.log(err);
        }
      }
    },

    //下拉刷新
    async onRefresh() {
      let me = this;
      try {
        //拉取书架列表
        await me.$store.dispatch("book/getBookSelfList", {
          userName: me.$store.getters.user.username,
        });
        me.refreshing = false;
      } catch (err) {
        // me.refreshing = false;
      }
    },

    //调起编辑弹窗
    showPop(item) {
      this.book = item;
      this.show = true;
    },

    //关闭遮罩层时触发
    onClosePopup() {
      this.bookName = {};
    },

    //跳转到登录页
    goLogin() {
      this.$router.push("/login");
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
        me.$router.push("/book");
      } catch (err) {
        console.log(err);
      }
    },

    //移除指定小说(取消收藏)
    async removeBook() {
      let me = this;
      try {
        await me.$store.dispatch("book/operateBookSelf", {
          _id: me.book.User_Book._id,
          operate: "delete",
          userName: me.$store.getters.user.username, //传这个是为了重新返回更新后的书架列表
        });
      } catch (err) {
        console.log(err);
      }
      me.show = false;
      // console.log(this.book);
    },

    //查看书评
    readBookComment(){
       this.$router.push("/comment");
    }
  },
};
</script>

<style lang="scss" scoped>
.bookshelf-container {
  .login-page {
    .inner-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        .pic {
          img {
            width: 7rem;
            height: 9rem;
          }
        }
        .desc {
          font-size: 1.3rem;
          margin-left: 1.2rem;
          p {
            color: #999;
          }
        }
      }
      .right {
        .van-icon {
          font-size: 2.5rem;
        }
      }
    }
  }
  .no-login-page {
    height: 70rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-button {
      height: 8rem;
      font-size: 1.7rem;
    }
  }
  .popup {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 10rem;
  }
  .tips {
    text-align: center;
    position: relative;
    top: 5rem;
  }
}
</style>>

