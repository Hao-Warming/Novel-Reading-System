<template>
  <div class="login-container">
    <van-icon name="arrow-left" class="back" v-if="isIconShow"  @click="backPath"/>
    <div class="logo">
      <img src="../../assets/images/logo.png" alt="" />
      <p>知文阅读</p>
    </div>
    <div class="content">
      <van-form @submit="onSubmit" validate-first submit-on-enter colon>
        <van-field
          v-model="loginForm.loginId"
          name="账号"
          label="账号"
          placeholder="请输入账号"
          :rules="[
            { required: true, message: '' },
            { required: true, message: '格式不正确', pattern },
          ]"
        />
        <van-field
          v-model="loginForm.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '' }]"
        />
        <van-field
          v-model="loginForm.captcha"
          center
          clearable
          label="图形验证码"
          placeholder="请输入图形验证码"
          :rules="[{ required: true, message: '' }]"
        >
          <template #button>
            <div class="captchaImg" v-html="svg" @click="getCaptchaFunc"></div>
          </template>
        </van-field>
        <div style="margin: 16px">
          <van-button round block color="#6495ED" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
    <span @click="goRegister" class="register-link">没有账号，去注册</span>
  </div>
</template>

<script>
// import { Notify } from "vant";
import { getCaptchaApi } from "@/api/captcha.js";
import { Notify, Toast } from "vant";
import router from "../../router";
export default {
  data() {
    return {
      loginForm: {
        loginId: "",
        password: "",
        captcha: "",
      },
      pattern:
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, //账号格式校验

      redirect: undefined,
      svg: "", //验证码图像

      fromPath: "", //传过来的路径
      isIconShow:true
    };
  },

  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },

  created() {
    this.getCaptchaFunc();
  },
  mounted() {
  },

  methods: {
    onSubmit(values) {
      let me = this;
      Toast.loading("验证中...");
      this.$store
        .dispatch("user/login", this.loginForm)
        .then(() => {
          Toast.success('登陆成功');
          setTimeout(()=>{
             me.$router.push({ path: this.redirect || "/center" });
          },1000)
        })
        .catch((err) => {
          if (err.code === 30003) {
            // 说明是账号密码错误
            Toast.fail("账号或密码有误");
          } else if (err.code === 30006) {
            // 说明是账号密码错误
            Toast.fail("验证码错误");
          }
          this.getCaptchaFunc(); //重新获取验证码
          this.loginForm.captcha = "";
        });
    },

    goRegister() {
      this.$router.push("/register");
    },

    //获取验证码
    getCaptchaFunc() {
      getCaptchaApi().then((res) => {
        this.svg = res;
      });
    },

    //返回路径
    backPath(){
      this.$router.push(this.fromPath);
    }
  },

  beforeRouteEnter(to, from, next) {
    console.log("from", from);
    next((vm) => {
      if (from.path == "/" || from.path == "/register"||from.path == "/safety") {
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


<style scoped lang='scss'>
.login-container {
  position: relative;
  .back{
    font-size: 25px;
    position: absolute;
    top: -33px;
    left: 7px;
  }
  .logo {
    width: 18rem;
    display: flex;
    align-items: center;
    margin: 5rem auto 2rem;
    img {
      width: 6rem;
      height: 6rem;
      display: block;
    }
    p {
      font-size: 2.5rem;
    }
  }
  .content {
    .van-cell {
      font-size: 1.5rem;
      .van-button--small {
        width: 7.8rem;
      }
    }
  }
  .register-link {
    color: #646566;
    cursor: pointer;
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
  }
}
</style>