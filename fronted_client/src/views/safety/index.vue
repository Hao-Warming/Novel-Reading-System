<template>
  <div class="safety-container">
    <van-nav-bar title="安全中心" left-arrow @click-left="backCenter" />
    <van-button color="#6495ED" plain @click="onClick" size="large"
      >注销账号</van-button
    >
  </div>
</template>

<script>
import { Dialog,Toast } from "vant";
export default {
  data() {
    return {};
  },
  methods: {
    backCenter() {
      this.$router.push("/center");
    },

    onClick() {
      let me = this;
      Dialog.confirm({
        message: "真的要注销么？",
      })
        .then(async () => {
          // on confirm
          try {
            console.log(1);
            await me.$store.dispatch("user/logout");
            console.log(2);
            Toast.success("注销成功");
            console.log(3);
            me.$router.push("/login");
            console.log(4);
          } catch (err) {
            Toast.fail(err);
          }
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.safety-container {
  .van-button {
    margin-top: 3rem;
  }
}
</style>