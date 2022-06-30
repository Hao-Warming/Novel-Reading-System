<template>
  <div class="register-container">
    <div class="logo">
      <img src="../../assets/images/logo.png" alt="" />
      <p>知文阅读</p>
    </div>
    <div class="content">
      <van-form @submit="onSubmit" colon>
        <van-field
          v-model="registerid"
          name="registerid"
          label="账号"
          placeholder="请输入邮箱账号"
          :rules="[
            { required: true, message: '' },
            { required: true, message: '格式不正确', pattern },
            {
              required: true,
              message: '账号已注册',
              validator: asyncValidator,
            },
          ]"
        />
        <van-field
          v-model="nickname"
          name="nickname"
          label="昵称"
          placeholder="请输入昵称"
          :rules="[{ required: true, message: '' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '' }]"
        />
        <van-field
          v-model="rePassword"
          type="password"
          name="password2"
          label="确认密码"
          placeholder="请确认密码"
          :rules="[
            { required: true, message: '' },
            { required: true, message: '两次密码输入不一致', validator },
          ]"
        />
        <van-field
          v-model="sms"
          center
          clearable
          name="smsCaptcha"
          label="邮箱验证码"
          placeholder="请输入邮箱验证码"
          :rules="[{ required: true, message: '' }]"
        >
          <template #button>
            <van-button size="small" color="#6495ED" @click.stop="sendCaptcha">{{
              btnMsg
            }}</van-button>
          </template>
        </van-field>
        <div style="margin: 16px">
          <van-button round block color="#6495ED" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
    <span @click="goLogin" class="login-link">已有账号，去登陆</span>
  </div>
</template>

<script>
import { Toast } from "vant";
import { hasRegisterApi, registerApi } from "@/api/user.js";
import { getSmsCaptchaApi } from "@/api/captcha.js";

export default {
  data() {
    return {
      registerid: "",
      nickname: "",
      password: "",
      rePassword: "", //重复密码
      sms: "",

      btnMsg: "发送验证码", //按钮文本
      isTimeUp: true, //发送拦截判断(用于防抖)
      hourglass: 60, //倒计时

      pattern:
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, //账号格式校验
    };
  },
  mounted() {},

  methods: {
    //检验输入的两次密码是否一样
    validator(val) {
      let str = "^" + this.password + "$";
      let reg = new RegExp(str);
      return reg.test(val);
    },
    // 检验账号是否已注册
    asyncValidator(val) {
      return hasRegisterApi({ registerid: val }).then((res) => {
        if (res.data) {
          //表示未注册
          return true;
        } else {
          //表示已注册
          return false;
        }
      });
    },

    onSubmit(values) {
      let me = this;
      Toast.loading("注册中...");
      // console.log("submit", values);
      registerApi(values)
        .then((res) => {
          const { data } = res;
          if (!data) {
            //提示注册失败
            Toast.fail(res.msg);
            return;
          } else {
            //提示注册成功，然后两秒跳到登陆页
            Toast.success(data);
            setTimeout(() => {
              me.goLogin();
            }, 500);
          }
        })
        .catch((err) => {
          Toast.fail("未知错误");
        });
    },

    goLogin() {
      this.$router.push("/login");
    },

    //发送验证码
    async sendCaptcha() {
      let me = this;
      if (!me.isTimeUp) {
        console.log("还没到时间呢");
        return;
      }
      //账号输入框没有输入，直接返回
      if (me.registerid.trim() == "") return;
      //账号输入了，判断是否已注册
      let isNoRegister = await me.asyncValidator(me.registerid);
      if (isNoRegister) {
        me.isTimeUp = false;
        let res = await getSmsCaptchaApi({ registerid: me.registerid });
        let time = setInterval(() => {
          if (me.hourglass == 0) {
            clearInterval(time);
            me.btnMsg = "发送验证码";
            me.isTimeUp = true;
            me.hourglass = 60;
            return;
          }
          me.btnMsg = me.hourglass;
          me.hourglass--;
        }, 1000);
      }
    },
  },
};
</script>

<style scoped lang='scss'>
.register-container {
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
  .login-link {
    color: #646566;
    cursor: pointer;
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
  }
}
</style>