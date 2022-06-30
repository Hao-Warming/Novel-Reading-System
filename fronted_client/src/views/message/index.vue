<template>
  <div class="message-container">
    <van-nav-bar title="留言板" left-arrow @click-left="backCenter" />
    <van-field
      v-model="message"
      rows="6"
      autosize
      type="textarea"
      maxlength="100"
      placeholder="在这里可以对站长进行吐槽/吹捧哟~"
      show-word-limit
    />
    <van-button color="#6495ED" size="large" round @click="submit">立即提交</van-button>
  </div>
</template>

<script>
import { Toast } from "vant";
import {sendMessageApi} from "@/api/user"
export default {
  data() {
    return {
      message: "",
    };
  },
  methods: {
    backCenter() {
      this.$router.push("/center");
    },

    //立即提交
    submit(){
      let me = this;
      sendMessageApi({msg:me.message}).then(res=>{
        const { data } = res;
        if (!data) {
          Toast.fail(res.msg);
          return;
        };
        Toast.success(data);
        me.backCenter();
      }).catch(err=>{
        Toast.fail(err);
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.message-container {
  .van-field {
    font-size: 1.7rem;
  }
  .van-button {
    margin-top: 3rem;
  }
}
</style>