> backend_server/model/db.js 中添加自己的数据库账号名和密码
> backend_server/util/email.js 中添加邮箱的发送对象
> fronted_client/src/views/info/index.vue 中添加自己腾讯云的SecretId、SecretKey、存储桶名称

### 运行流程
> backend_server、admin_system、fronted_client 分别运行 npm i

1. 运行服务（backend_server)：npm run start
2. 运行管理后台（admin_system）: npm run dev
3. 运行显示前台（fronted_client）: npm run serve
