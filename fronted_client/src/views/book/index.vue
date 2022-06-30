<template>
  <div class="book-container">
    <div class="content">
      <van-list>
        <van-cell
          class="header"
          :style="{ backgroundImage: 'url(' + getImgStyle + ')' }"
        >
          <template #title>
            <div class="inner-container">
              <div class="top">
                <van-icon
                  name="arrow-left"
                  size="2.5rem"
                  v-if="isIconShow"
                  @click="backPath"
                />
              </div>
              <div class="bottom">
                <div class="pic">
                  <img
                    :src="
                      $store.getters.bookObj
                        ? $store.getters.bookObj.imgUrl
                        : ''
                    "
                    alt=""
                  />
                </div>
                <div class="desc">
                  <h3>
                    {{
                      $store.getters.bookObj
                        ? $store.getters.bookObj.bookName
                        : ""
                    }}
                  </h3>
                  <p>
                    作者：{{
                      $store.getters.bookObj
                        ? $store.getters.bookObj.author
                        : ""
                    }}
                  </p>
                  <p>
                    状态：{{
                      $store.getters.bookObj
                        ? $store.getters.bookObj.hasCompleted
                          ? "完成"
                          : "连载"
                        : ""
                    }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </van-cell>
        <van-cell class="chapter" @click="goChapter">
          <template #title>
            <div class="chapter-container">
              <div class="left">
                <h3>目录</h3>
                <div class="desc">
                  <p>
                    最近更新：{{
                      $store.getters.otherBookData
                        ? $store.getters.otherBookData.chapter.updatedAt
                        : ""
                    }}
                  </p>
                  <p>
                    {{
                      $store.getters.otherBookData
                        ? $store.getters.otherBookData.chapter.title
                        : ""
                    }}
                  </p>
                </div>
              </div>
              <div class="right">
                <van-icon name="arrow" size="2rem" />
              </div>
            </div>
          </template>
        </van-cell>
        <van-cell class="comment">
          <template #title>
            <van-list>
              <van-cell>
                <template #title>
                  <div class="top-bar" @click="goComment">
                    <h3>书友评论</h3>
                    <van-icon name="edit" size="2.5rem" />
                  </div>
                </template>
              </van-cell>
              <van-cell
                v-for="(item, index) in $store.getters.otherBookData.comment"
                :key="index"
              >
                <template #title>
                  <div class="comment-container">
                    <div class="left">
                      <div class="pic">
                        <img :src="item.user.avatarUrl" alt="" />
                      </div>
                      <div class="desc">
                        <h3>{{ item.user.name }}</h3>
                        <p>
                          {{ item.item.content }}
                        </p>
                      </div>
                      <div class="date">{{ item.item.createdAt }}</div>
                    </div>
                  </div>
                </template>
              </van-cell>
              <van-cell v-if="isShowMore" @click="goComment">
                <template #title>
                  <div class="bottom-bar">查看更多</div>
                </template>
              </van-cell>
            </van-list>
          </template>
        </van-cell>
      </van-list>
    </div>
    <van-tabbar class="tabbar" :placeholder="true">
      <van-tabbar-item class="operate" @click="oprateBook">{{
        hasCollect ? "取消收藏" : "加入书架"
      }}</van-tabbar-item>
      <van-tabbar-item class="read-now" @click="readDetail">{{
        hasHistory ? "继续阅读" : "立即阅读"
      }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      fromPath: "", //传过来的路径
      isIconShow: true,

      hasHistory: false,
      hasCollect: false,

      currentRealation: null, //当前用户和小说的关联对象

      isShowMore: true, //是否显示"查看更多"
    };
  },

  computed: {
    getImgStyle() {
      return this.$store.getters.bookObj
        ? this.$store.getters.bookObj.imgUrl
        : "";
    },
  },

  mounted() {
    let me = this;
    if (me.$store.getters.otherBookData.comment.length == 0) {
      me.isShowMore = false;
    }
    if (localStorage.getItem("book" + me.$store.getters.bookObj._id)) {
      me.hasHistory = true;
    }
    if (me.$store.getters.bookSelves.length != 0) {
      //已经有书架列表数据，去匹配
      me.compareData();
    } else {
      me.getInfo();
    }
  },

  methods: {
    //匹配数据列表对应的数据
    compareData() {
      let me = this;
      let dataList = me.$store.getters.bookSelves;
      let len = dataList.length;
      let bookObj = me.$store.getters.bookObj;
      for (let i = 0; i < len; i++) {
        if (dataList[i]._id == bookObj._id) {
          me.hasCollect = true;
          me.currentRealation = dataList[i].User_Book;
          break;
        }
      }
    },

    //拉取信息
    async getInfo() {
      let me = this;
      if (!me.$store.getters.user) {
        try {
          //未登录,需要拉取
          await me.$store.dispatch("user/getInfo");
        } catch (err) {
          //如果没有用户信息的Token，应该会走到这里
          console.log(err);
        }
      }

      //有用户信息（经过上面的用户信息拉取，如果有的话都会进入到这里）
      if (me.$store.getters.user) {
        try {
          //拉取书架列表
          await me.$store.dispatch("book/getBookSelfList", {
            userName: me.$store.getters.user.username,
          });
          //到这里已经获取到书架列表了
          me.compareData();
        } catch (err) {
          console.log(err);
        }
      }
    },

    //点击阅读按钮
    async readDetail() {
      let me = this;
      if (me.hasHistory) {
        //已有缓存
        let chapter = JSON.parse(
          localStorage.getItem("book" + me.$store.getters.bookObj._id)
        );

        try {
          //先获取章节详情的数据，再进行跳转
          await me.$store.dispatch("book/getChapterDetail", {
            id: chapter._id,
            item: chapter,
          });

          this.$router.push("/detail");
        } catch (err) {
          console.log(err);
        }
      } else {
        //没缓存，默认阅读第一章
        try {
          //先获取章节详情的数据，再进行跳转
          await me.$store.dispatch("book/getOneDetail", {
            bookid: me.$store.getters.bookObj._id,
          });

          //存储历史记录
          localStorage.setItem(
            "book" +
              me.$store.getters.bookObj._id,
            JSON.stringify(me.$store.getters.chapterDetail.item)
          );
          this.$router.push("/detail");
        } catch (err) {
          console.log(err);
        }
      }
    },

    //点击书架操作按钮
    async oprateBook() {
      let me = this;
      try {
        if (me.hasCollect) {
          //取消收藏
          await me.$store.dispatch("book/operateBookSelf", {
            _id: me.currentRealation._id,
            operate: "delete",
            userName: me.$store.getters.user.username, //传这个是为了重新返回更新后的书架列表
          });
          me.hasCollect = false;
          Toast.success("取消收藏成功");
        } else {
          //先判断是否已经有用户信息，若有，可以进行加入操作；若无，直接提示未登录
          if (me.$store.getters.user) {
            //加入操作
            await me.$store.dispatch("book/operateBookSelf", {
              operate: "add",
              userName: me.$store.getters.user.username,
              bookid: me.$store.getters.bookObj._id,
            });
            Toast.success("收藏成功");
            me.compareData();
            me.hasCollect = true;
          } else {
            //提示未登录
            Toast.fail("你还没登陆呢");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    //返回路径
    backPath() {
      this.$router.push(this.fromPath);
    },

    //前往目录
    goChapter() {
      this.$router.push("/chapter");
    },

    //点击"查看更多"按钮进入评论详情页
    goComment() {
      this.$router.push("/comment");
    },

    //
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.path == "/") {
        //隐藏返回图标
        vm.isIconShow = false;
        return;
      } else if (from.path == "/chapter" || from.path == "/comment") {
        vm.fromPath = "/type";
      } else {
        // 通过 `vm` 访问组件实例
        vm.fromPath = from.path;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.book-container {
  .tabbar {
    .operate {
      font-size: 1.7rem !important;
      color: #1989fa;
    }
    .read-now {
      font-size: 1.7rem !important;
      color: #e9f1f6;
      background-color: #1989fa;
    }
  }
  .content {
    .header {
      position: relative;
      background-repeat: no-repeat;
      background-size: cover;
      .inner-container {
        position: relative;
        z-index: 50;
        color: #fff;
        .top {
          .van-icon {
            left: -1.3rem;
          }
        }
        .bottom {
          display: flex;
          align-items: center;
          .pic {
            img {
              width: 7rem;
              height: 9rem;
            }
          }
          .desc {
            margin-left: 2rem;
          }
        }
      }
      &::before {
        display: block;
        content: "";
        width: 100%;
        height: 100%;
        background: rgba($color: #000000, $alpha: 0.5);
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
      }
    }
    .chapter {
      .chapter-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          h3 {
            font-size: 2rem;
          }
          .desc {
            margin-left: 1rem;
            p:nth-child(1) {
              color: #999;
            }
          }
        }
      }
    }
    .comment {
      margin-top: 2rem;
      .top-bar {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        left: -0.5rem;
        h3 {
          font-size: 2rem;
          position: absolute;
          left: -1rem;
        }
        .van-icon {
          position: relative;
          left: 7.5rem;
        }
      }
      .comment-container {
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
          }
        }
        .right {
          .van-icon {
            font-size: 2.5rem;
          }
        }
      }
      .bottom-bar {
        display: flex;
        justify-content: center;
        color: #4169e1;
        font-size: 1.5rem;
      }
    }
  }
}
</style>>
