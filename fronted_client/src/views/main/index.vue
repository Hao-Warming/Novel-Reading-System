<template>
  <div class="main">
    <router-view />
    <!-- 底部标签栏 -->
    <div class="tab-bar">
      <van-tabbar
        v-model="active"
        active-color="#6495ED"
        inactive-color="#000"
        route
      >
        <van-tabbar-item icon="home-o" replace to="/bookshelf"
          >我的书架</van-tabbar-item
        >
        <van-tabbar-item icon="search" replace to="/type"
          >小说分类</van-tabbar-item
        >
        <van-tabbar-item icon="friends-o" replace to="/center"
          >个人中心</van-tabbar-item
        >
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>