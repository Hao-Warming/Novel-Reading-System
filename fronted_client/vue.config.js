module.exports = {
  devServer: {
   // 代理跨域的配置
    proxy: {
        // 当我们的本地的请求 有/api的时候，就会代理我们的请求地址向另外一个服务器发出请求
        '/api': {
          target: 'http://127.0.0.1:9527' //http://127.0.0.1:9527/api/XXX
      },
    }
  },
  css: {
    loaderOptions: {
      less: {
          modifyVars: {
            'font-family': 'bamboo',
            '@nav-bar-background-color':'#e9f1f6',
            '@nav-bar-height': '60px',
            '@nav-bar-title-font-size': '20px',
            '@nav-bar-title-text-color': '#6495ed',
            '@nav-bar-arrow-size': '20px',
            '@tabbar-background-color': '#e9f1f6',

            //分类页
            '@sidebar-font-size': '18px',
            '@sidebar-selected-border-color':'#6495ED'
          },
      },
    },
  },
}
