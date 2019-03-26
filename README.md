# 基于node.js构建的用户注册登录及验证接口

使用express框架搭建服务，mongoDB存储用户信息，使用jsonwebtoken进行身份验证，passport-jwt来验证token。
接口分为三个部分，分别是：用户注册，用户登录和当前用户验证。

目录结构

```tree
|-configs             //配置文件
|   |-configs.js
|   |-passport.js
|-models              //数据模型
|   |-User.js
|-routes              //路由定义
|   |-users.js
|-app.js              //主文件
|-package.json
```