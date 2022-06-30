import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title);

    const hasGetUserInfo = store.getters.user; // 获取本地用户信息
    if (to.meta.auth) {
        //需要鉴权
        if (hasGetUserInfo) {
            //有用户信息，直接放行
            next();
        } else {
            // 没有用户信息，看一下是否有 token
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    //尝试恢复用户信息
                    await store.dispatch('user/getInfo');
                    next();
                    NProgress.done();
                } catch (err) {
                    await store.dispatch("user/resetToken");
                    Message.error("登录过期啦，请重新登录");
                    next(`/login?redirect=${to.path}`);
                    NProgress.done()
                }
            } else {
                Message.error("你还没登录喔");
                //没有token，导航到登录页面
                next({ path: `/login?redirect=${to.path}` })
            }
        }
    } else {
        //说明该页面不需要鉴权
        if (to.path === "/login" && hasGetUserInfo) {
            //vuex有用户信息,说明已登录,直接放行
            next({ path: "/" });
        } else {
            next();
        }
        NProgress.done();
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
