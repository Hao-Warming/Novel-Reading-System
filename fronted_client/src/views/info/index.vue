<template>
  <div class="info-container">
    <van-nav-bar title="个人中心" left-arrow @click-left="backCenter" />
    <van-list>
      <van-cell>
        <template #title>
          <div class="avatar">
            <div class="left">头像</div>
            <div class="right">
              <!-- //before-read：文件读取前的回调函数，返回 false 可终止文件读取，支持返回 Promise
                    //after-read：文件读取完成后的回调函数
                    //delete：删除文件预览时触发，同after-read -->
              <van-uploader
                :before-read="beforeRead"
                :after-read="afterRead"
                name="avatar"
                :max-size="3 * 1024 * 1024"
                @oversize="onOversize"
              >
                <img
                  :src="$store.getters.user ? $store.getters.user.avatar : ''"
                  alt=""
                />
              </van-uploader>
              <van-icon name="arrow" size="2rem" />
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell>
        <template #title>
          <div class="username">
            <div class="left">账号</div>
            <div class="right">
              {{ $store.getters.user ? $store.getters.user.username : "" }}
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell
        @click="
          () => {
            this.showNicknamePopup = true;
          }
        "
      >
        <template #title>
          <div class="nickname">
            <div class="left">昵称</div>
            <div class="right">
              <p>{{ $store.getters.user ? $store.getters.user.name : "" }}</p>
              <van-icon name="arrow" size="2rem" />
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell
        @click="
          () => {
            this.showPwdPopup = true;
          }
        "
      >
        <template #title>
          <div class="nickname">
            <div class="left">修改密码</div>
            <div class="right">
              <van-icon name="arrow" size="2rem" />
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>

    <!-- 修改密码弹窗 -->
    <van-popup v-model="showPwdPopup">
      <div class="pwd-popup">
        <van-form @submit="onUpdatePwd">
          <van-field
            v-model="pwdForm.pwd"
            name="pwd"
            label="原密码"
            placeholder="原密码"
            :rules="[{ required: true, message: '请填写原密码' }]"
          />
          <van-field
            v-model="pwdForm.newPwd"
            name="newPwd"
            label="新密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写新密码' }]"
          />
          <div style="margin: 16px">
            <van-button round block type="info" native-type="submit"
              >修改密码</van-button
            >
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 修改昵称弹窗 -->
    <van-popup v-model="showNicknamePopup">
      <div class="nickname-popup">
        <van-form @submit="onUpdateNickname">
          <van-field
            v-model="nickNameForm.newNickName"
            name="newNickName"
            label="新昵称"
            placeholder="新昵称"
            :rules="[{ required: true, message: '请填写昵称' }]"
          />
          <div style="margin: 16px">
            <van-button round block type="info" native-type="submit"
              >修改昵称</van-button
            >
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";

//这里使用的是腾讯云的图片上传，SecretId和SecretKey要填写自己的腾讯云COS
const COS = require("cos-js-sdk-v5");
const cos = new COS({
  SecretId: "",
  SecretKey: "",
});

export default {
  data() {
    return {
      showPwdPopup: false, //密码弹窗开关
      pwdForm: {
        pwd: "",
        newPwd: "",
      }, //密码表单

      showNicknamePopup: false, //昵称弹窗开关
      nickNameForm: {
        newNickName: "",
      },

      //图片储存桶地址
      remoteAddr: "",
    };
  },

  methods: {
    backCenter() {
      this.$router.push("/center");
    },

    async onUpdatePwd(values) {
      let me = this;
      values.userName = me.$store.getters.user.username;
      try {
        await me.$store.dispatch("user/updatePwd", values);
        Toast.success("修改成功");
        me.pwdForm = {
          pwd: "",
          newPwd: "",
        };
      } catch (err) {
        Toast.fail(err);
      }
      me.showPwdPopup = false;
    },

    async onUpdateNickname(values) {
      let me = this;
      values.userName = me.$store.getters.user.username;
      try {
        await me.$store.dispatch("user/updateNickname", values);
        Toast.success("修改成功");
        me.nickNameForm = {
          newNickName: "",
        };
      } catch (err) {
        Toast.fail(err);
      }
      me.showNicknamePopup = false;
    },

    /**
     * 图片上传
     */
    beforeRead(file) {
      if (file instanceof Array && file.length) {
        file.forEach((item) => {
          if (
            item.type !== "image/jpeg" &&
            item.type !== "image/png" &&
            item.type !== "image/jpg"
          ) {
            this.$toast.fail("请选择正确图片格式上传");
            return false;
          }
        });
        return file;
      } else {
        if (
          file.type !== "image/jpeg" &&
          file.type !== "image/png" &&
          file.type !== "image/jpg"
        ) {
          this.$toast.fail("请选择正确图片格式上传");
          return false;
        }
        return file;
      }
    },
    afterRead(file, avatar) {
      let me = this;
      cos.putObject(
        {
          Bucket: "", // 存储桶名称
          Region: "ap-guangzhou", // 存储桶所在地域（英文的）
          Key: "/novel/" + file.file.name, // 文件名称
          StorageClass: "STANDARD", // 上传模式
          Body: file.file, // 上传文件对象
          onProgress: (progressData) => {
            // 文件上传中执行的函数
          },
        },
        async (err, data) => {
          // 文件上传或失败执行的函数，注意修改为箭头函数，否则函数中this的指向不是vue实例
          console.log(data);
          console.log(err);
          if (err) {
            Toast.fail(err);
          } else if (data.statusCode === 200) {
            const url = `https://${data.Location}`; // 把获取到的路径进行模版字符串拼接
            const obj = {
              url: url,
              userName: me.$store.getters.user.username
            };
            try {
              await me.$store.dispatch("user/updateAvatar", obj);
              Toast.success("更改头像成功");
            } catch (err) {
              Toast.fail(err);
            }
          }
        }
      );
    },

    //校验文件大小是否超出限制
    onOversize() {
      Toast.fail("文件太大");
    },
  },
};
</script>

<style lang="scss" scoped>
.info-container {
  .van-cell {
    margin-bottom: 1rem;
  }
  .avatar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-size: 1.7rem;
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        display: block;
        margin-right: 1rem;
      }
    }
  }
  .username {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-size: 1.7rem;
    }
    .right {
      font-size: 1.5rem;
    }
  }
  .nickname {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-size: 1.7rem;
    }
    .right {
      display: flex;
      align-items: center;
      p {
        font-size: 1.5rem;
        margin-right: 1rem;
      }
    }
  }
  .password {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-size: 1.7rem;
    }
  }

  .pwd-popup {
    width: 40rem;
    height: 30rem;
    display: flex;
    align-items: center;
    .van-form {
      width: 100%;
    }
  }

  .nickname-popup {
    width: 40rem;
    height: 30rem;
    display: flex;
    align-items: center;
    .van-form {
      width: 100%;
    }
  }
}
</style>