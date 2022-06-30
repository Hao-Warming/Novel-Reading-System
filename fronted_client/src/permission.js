//路由权限验证
import router from './router'
import store from './store'
import { Notify } from 'vant'

router.beforeEach(async (to, from, next) => {

  const hasGetUserInfo = store.getters.user; // 获取本地用户信息
  if (to.meta.auth) {
    if (hasGetUserInfo) {
      //有用户信息，直接放行
      next();
    } else {
      //没有用户信息看一下是否有token
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          //尝试恢复用户信息
          await store.dispatch('user/getInfo');
          next();
        } catch (err) {
          await store.dispatch("user/resetToken");
          Notify({
            message: '登录过期啦，请重新登录',
            color: '#ad0000',
            background: '#ffe1e1',
            duration: 2000,
          });
          next(`/login?redirect=${to.path}`);
        }
      } else {
        //没有登陆，导航到登陆页面
        Notify({
          message: '你还未登陆呢',
          color: '#ad0000',
          background: '#ffe1e1',
          duration: 2000,
        });
        next({ path: `/login?redirect=${to.path}` })
      }
    }
  } else {
    //不需要授权的页面
    if ((to.path === "/login"|| to.path === "/register") && hasGetUserInfo) {
      //vuex有用户信息,说明已登录,直接放行
      next({ path: "/center" });
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  // finish progress
})


