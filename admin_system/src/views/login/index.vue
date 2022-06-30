<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">阅读网后台系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="输入管理员账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="输入管理员密码"
          name="password"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <div class="captchaContainer">
        <el-form-item prop="captcha" class="captchaInputer">
          <span class="svg-container">
            <svg-icon icon-class="nested" />
          </span>
          <el-input
            ref="captcha"
            v-model="loginForm.captcha"
            type="text"
            placeholder="输入验证码"
            name="captcha"
            tabindex="3"
            auto-complete="off"
          />
        </el-form-item>
        <div class="captchaImg" v-html="svg" @click="getCaptchaFunc"></div>
      </div>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >Login</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { getCaptchaApi } from "@/api/captcha.js";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      //邮箱格式
      const reg =
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("Incorrect account format"));
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        captcha: "",
      },
      loginRules: {
        username: [
          {
            required: true,
            message: "please enter your account",
            trigger: "blur",
          },
          {
            required: true,
            validator: validateUsername,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "please enter your password",
            trigger: "blur",
          },
        ],
        captcha: [
          {
            required: true,
            trigger: "blur",
            message: "please enter your captcha",
          },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      svg: "", //验证码图像
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
  methods: {
    //显示密码
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    //登录提交
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch((err) => {
              if (err.code === 30003) {
                // 说明是账号密码错误
                this.$message.error("账号或密码有误");
              } else if (err.code === 30006) {
                // 说明是账号密码错误
                this.$message.error("验证码错误");
              }
              this.getCaptchaFunc(); //重新获取验证码
              this.loading = false;
              this.loginForm.captcha = "";
            });
        } else {
          // 说明表单有某些字段的验证没有通过
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取验证码
    getCaptchaFunc() {
      getCaptchaApi().then((res) => {
        this.svg = res;
      });
    },
    //回车login
    enterClick(e) {
      if (e.key === "Enter") {
        this.handleLogin();
      }
    },
  },
  created() {
    this.getCaptchaFunc();
  },
  mounted() {
    window.addEventListener("keyup", this.enterClick, false);
  },
  destroyed() {
    //跳转时移除监听事件
    window.removeEventListener("keyup", this.enterClick, false);
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .captchaContainer {
      display: flex;
      .captchaInputer {
        width: 70%;
      }
      .captchaImg {
        width: 150px;
        height: 50px;
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
