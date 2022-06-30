<template>
  <div class="center-container">
    <!-- 顶部导航栏 -->
    <div class="nav-bar">
      <van-nav-bar
        title="个人中心"
        :fixed="true"
        :placeholder="true"
        :safe-area-inset-top="true"
      />
    </div>
    <div class="login-page" v-if="isLogin">
      <van-list>
        <van-cell class="info" @click="goCenter">
          <template #title>
            <div class="inner-container">
              <div class="left">
                <div class="pic">
                  <img
                    :src="$store.getters.user?$store.getters.user.avatar:''"
                    alt=""
                  />
                </div>
                <div class="desc">
                  <h3>{{$store.getters.user?$store.getters.user.name:''}}</h3>
                  <p>{{$store.getters.user?$store.getters.user.username:''}}</p>
                </div>
              </div>
              <div class="right">
                <van-icon name="arrow" size="2rem" />
              </div>
            </div>
          </template>
        </van-cell>
        <!-- <van-cell>
          <template #title>
            <div class="inner-container">
              <div class="item-left">
                <van-icon name="comment-circle" size="2.5rem" color="#FFC125" />
                <h3>我的书评</h3>
              </div>
              <div class="right">
                <van-icon name="arrow" size="2rem" />
              </div>
            </div>
          </template>
        </van-cell> -->
        <van-cell @click="goMessage">
          <template #title>
            <div class="inner-container">
              <div class="item-left">
                <van-icon name="comment" size="2.5rem" color="#FF6A6A" />
                <h3>留言板</h3>
              </div>
              <div class="right">
                <van-icon name="arrow" size="2rem" />
              </div>
            </div>
          </template>
        </van-cell>
        <van-cell @click="goSafety">
          <template #title>
            <div class="inner-container">
              <div class="item-left">
                <van-icon
                  name="umbrella-circle"
                  size="2.5rem"
                  color="#6495ED"
                />
                <h3>安全中心</h3>
              </div>
              <div class="right">
                <van-icon name="arrow" size="2rem" />
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>
      <van-button plain color="#6495ed" size="large" @click="logoff">退出登录</van-button>
    </div>

    <div class="no-login-page" v-if="!isLogin" @click="goLogin">
      <van-list>
        <van-cell class="info">
          <template #title>
            <div class="inner-container">
              <div class="left">
                <div class="pic">
                  <van-icon name="https://b.yzcdn.cn/vant/icon-demo-1126.png" />
                </div>
                <div class="desc">
                  <h3>暂未登录，请前往登录</h3>
                </div>
              </div>
              <div class="right">
                <van-icon name="arrow" size="2rem" />
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      isLogin: false,
    };
  },

  mounted() {
    let me = this;
    me.getUserInfo();
  },

  methods: {
    //跳转到登陆页
    goLogin(){
      this.$router.push("/login");
    },

    //跳转到个人中心
    goCenter(){
      this.$router.push("/info");
    },

    //跳转到安全中心
    goSafety(){
      this.$router.push("/safety");
    },

    //跳转到留言板
    goMessage(){
      this.$router.push("/message");
    },

    //拉取用户信息
    async getUserInfo() {
      let me = this;
      if (
        !me.$store.getters.user
      ) {
        try {
          //未登录/修改了用户基本信息,需要重新拉取
          await me.$store.dispatch("user/getInfo", this.loginForm);
          me.isLogin = true;
        } catch (err) {
          console.log(err);
          //如果没有用户信息的Token，应该会走到这里
          me.isLogin = false;
        }
      }else if(me.$store.getters.user){
        //已经有用户信息 && 用户信息没有编辑过
        me.isLogin = true;
      }
    },

    //退出登陆
    async logoff(){
      let me = this;
      try{
        await me.$store.dispatch("user/logoff");
        me.isLogin = false;
        me.goLogin();
      }catch(err){
        console.log("未知错误");
      }
    }
  },
};
</script>

<style scoped lang="scss">
.center-container {
  .login-page {
    .inner-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .pic {
          img {
            width: 7rem;
            height: 7rem;
            border-radius: 50%;
          }
        }
        .desc {
          margin-left: 1.2rem;
          h3 {
            font-size: 1.5rem;
          }
          p {
            font-size: 1.3rem;
            color: #999;
          }
        }
      }
      .item-left {
        display: flex;
        align-items: center;
        h3 {
          font-size: 2rem;
          margin-left: 0.5rem;
        }
      }
    }
    .info {
      margin-bottom: 1rem !important;
    }
    .van-button {
      margin-top: 5rem;
    }
  }
  .no-login-page {
    .inner-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .pic {
          img {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
          }
        }
        .desc {
          margin-left: 1.2rem;
          h3 {
            font-size: 1.5rem;
          }
          p {
            font-size: 1.3rem;
            color: #999;
          }
        }
      }
    }
  }
}
</style>