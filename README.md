# 🦀 美味蟹堡 - 餐厅管理系统后端

一个基于 NestJS 构建的现代化餐厅/外卖管理系统后端 API，支持小程序用户端和后台管理端。

## 📋 项目简介

美味蟹堡是一个全功能的餐厅管理系统后端，提供完整的业务功能支持，包括用户管理、餐品管理、订单处理、数据统计等核心功能。系统采用前后端分离架构，支持小程序端和后台管理端两种用户角色。

## ✨ 主要特性

- 🔐 **双重身份认证系统**：支持小程序用户和管理员角色，使用 JWT + Redis 实现安全认证
- 📱 **小程序用户功能**：注册、登录（账户/手机号）、个人信息管理、订单查询等
- 👨‍💼 **后台管理功能**：管理员登录、餐品管理、分类管理、订单管理、轮播图管理等
- 🍔 **完整的餐饮业务**：餐品分类、餐品信息（价格、库存、销量）、上架下架等
- 📦 **订单系统**：订单创建、订单详情、订单状态管理（待支付、制作中、已完成、已取消）
- 🎨 **内容管理**：轮播图管理、图片上传功能
- 📧 **短信验证**：集成阿里云短信服务，支持手机号验证码登录
- ⚡ **高性能缓存**：使用 Redis 实现 Token 缓存和会话管理
- 🛡️ **安全防护**：密码加密（bcrypt）、请求验证（class-validator）、全局异常处理

## 🛠️ 技术栈

### 核心框架
- **NestJS 10.x** - 渐进式 Node.js 框架
- **TypeScript 5.x** - 类型安全的 JavaScript
- **TypeORM 0.3.x** - ORM 框架
- **MySQL** - 关系型数据库
- - **Redis** - 非关系型数据库

### 主要依赖
- **@nestjs/jwt** - JWT 认证
- **@nestjs/config** - 配置管理
- **ioredis** - Redis 客户端
- **bcrypt** - 密码加密
- **class-validator** - 数据验证
- **multer** - 文件上传
- **@alicloud/dysmsapi20170525** - 阿里云短信服务
- **cors** - 跨域支持
- **express-session** - 会话管理

## 📁 项目结构

```
delicious_crab_burger/
├── src/
│   ├── app.module.ts          # 应用根模块
│   ├── main.ts                # 应用入口
│   ├── app.controller.ts      # 根控制器（验证码等）
│   ├── app.service.ts         # 根服务
│   │
│   ├── user/                  # 小程序用户模块
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.module.ts
│   │   ├── entities/          # 用户实体
│   │   └── dto/               # 数据传输对象
│   │
│   ├── role/                  # 后台管理员模块
│   │   ├── role.controller.ts
│   │   ├── role.service.ts
│   │   ├── role.module.ts
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── category/              # 分类模块
│   ├── meals/                 # 餐品模块
│   ├── order/                 # 订单模块
│   ├── order_details/         # 订单详情模块
│   ├── banner/                # 轮播图模块
│   ├── userConfig/            # 用户配置模块
│   ├── roleConfig/            # 角色配置模块
│   │
│   ├── guard/                 # 守卫
│   │   └── auth.guard.ts      # JWT 认证守卫
│   │
│   ├── interception/          # 拦截器
│   │   ├── responseIntercept.ts      # 响应拦截器
│   │   └── exceptionInterception.ts  # 异常拦截器
│   │
│   ├── middleware/            # 中间件
│   │   └── index.ts           # 日志中间件
│   │
│   └── utils/                 # 工具类
│       ├── redis.service.ts   # Redis 服务
│       ├── sms.service.ts     # 短信服务
│       ├── bcrypt.service.ts  # 密码加密服务
│       ├── axios.service.ts   # HTTP 请求服务
│       └── formatted.ts       # 格式化工具
│
├── upload/                    # 上传文件目录
├── dist/                      # 编译输出目录
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- pnpm >= 8.x (或 npm/yarn)
- MySQL >= 5.7
- Redis >= 6.x

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 环境配置

创建环境配置文件 `.env.development`（开发环境）或 `.env.production`（生产环境）：

```env
# API 配置
API_PREFIX=/api
NODE_ENV=development

# 数据库配置
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=delicious_crab_burger

# JWT 配置
JWT_SECRET=your_jwt_secret_key

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# 会话配置
SESSION_SECRET=your_session_secret
SESSION_NAME=session_id

# 阿里云短信配置（可选）
SMS_ACCESS_KEY_ID=your_access_key_id
SMS_ACCESS_KEY_SECRET=your_access_key_secret
SMS_SIGN_NAME=your_sign_name
SMS_TEMPLATE_CODE=your_template_code
```

### 运行项目

```bash
# 开发模式（热重载）
pnpm run start:dev

# 生产模式
pnpm run start:prod

# 调试模式
pnpm run start:debug
```

项目将在 `http://localhost:8311` 启动。

### 构建项目

```bash
pnpm run build
```

## 📚 API 文档

### 基础路径

所有 API 请求前缀：`/api/v1`

### 公共接口

#### 获取图形验证码
```
GET /api/v1/imageVerificationCode
```

#### 获取短信验证码
```
GET /api/v1/verificationCode?phone=手机号
```

### 小程序用户接口

#### 用户注册
```
POST /api/v1/user/miniProgram/register
Body: { phone, password, verificationCode }
```

#### 账户登录
```
POST /api/v1/user/miniProgram/login
Body: { phone, password }
```

#### 手机号免密登录
```
POST /api/v1/user/miniProgram/loginByPhone
Body: { phone, verificationCode }
```

#### 更新用户信息
```
PATCH /api/v1/user/miniProgram/updateInfo
Headers: Authorization: Bearer {token}
Body: { nickname, avatar, ... }
```

#### 修改密码
```
PATCH /api/v1/user/miniProgram/updatePassword
Headers: Authorization: Bearer {token}
Body: { oldPassword, newPassword }
```

### 管理员接口

#### 管理员注册
```
POST /api/v1/role/register
Body: { phone, password }
```

#### 管理员登录
```
POST /api/v1/role/login
Body: { phone, password }
```

### 分类管理

#### 创建分类
```
POST /api/v1/category
Headers: Authorization: Bearer {token}
Body: { name, status }
```

#### 获取分类列表
```
GET /api/v1/category
Headers: Authorization: Bearer {token}
```

#### 更新分类
```
PATCH /api/v1/category/:id
Headers: Authorization: Bearer {token}
```

#### 删除分类
```
DELETE /api/v1/category/:id
Headers: Authorization: Bearer {token}
```

### 餐品管理

#### 创建餐品
```
POST /api/v1/meals
Headers: Authorization: Bearer {token}
Body: { name, price, originalPrice, desc, category_id, ... }
```

#### 获取餐品列表
```
GET /api/v1/meals
Headers: Authorization: Bearer {token}
```

#### 更新餐品
```
PATCH /api/v1/meals/:id
Headers: Authorization: Bearer {token}
```

#### 删除餐品
```
DELETE /api/v1/meals/:id
Headers: Authorization: Bearer {token}
```

### 订单管理

#### 创建订单
```
POST /api/v1/order
Headers: Authorization: Bearer {token}
Body: { meals: [{ meal_id, quantity }], total_price }
```

#### 获取订单列表
```
GET /api/v1/order
Headers: Authorization: Bearer {token}
```

#### 更新订单状态
```
PATCH /api/v1/order/:id
Headers: Authorization: Bearer {token}
Body: { status }
```

### 轮播图管理

#### 创建轮播图
```
POST /api/v1/banner
Headers: Authorization: Bearer {token}
Body: { name, url, sort, status }
```

#### 获取轮播图列表
```
GET /api/v1/banner
Headers: Authorization: Bearer {token}
```

## 🔐 认证说明

系统使用 JWT Token 进行身份认证，Token 存储在 Redis 中用于会话管理。

### 请求头格式

```
Authorization: Bearer {token}
```

### Token 结构

- **小程序用户**：`source: 'miniProgram'`
- **后台管理员**：`source: 'BackgroundManagement'`

### 无需认证的接口

以下接口不需要认证即可访问：
- `/api/v1/verificationCode`
- `/api/v1/imageVerificationCode`
- `/api/v1/user/miniProgram/register`
- `/api/v1/user/miniProgram/login`
- `/api/v1/user/miniProgram/loginByPhone`
- `/api/v1/role/login`
- `/api/v1/role/register`

## 🗄️ 数据库设计

### 主要实体

- **MiniProgramUser** - 小程序用户
- **Role** - 后台管理员
- **Category** - 餐品分类
- **Meals** - 餐品信息
- **Order** - 订单
- **OrderDetail** - 订单详情
- **Banner** - 轮播图
- **UserConfig** - 用户配置
- **RoleConfig** - 角色配置

### 关系说明

- 用户（MiniProgramUser） ↔ 订单（Order）：一对多
- 订单（Order） ↔ 订单详情（OrderDetail）：一对多
- 订单详情（OrderDetail） ↔ 餐品（Meals）：多对多
- 分类（Category） ↔ 餐品（Meals）：一对多
- 角色（Role） ↔ 分类（Category）：一对多
- 角色（Role） ↔ 餐品（Meals）：一对多

## 📁 文件上传

上传的文件存储在 `upload/` 目录下，通过以下路径访问：

```
GET /image/{filename}
```

示例：`/image/banner1.jpg`


## 📝 代码规范

项目使用 ESLint + Prettier 进行代码格式化：

```bash
# 代码检查
pnpm run lint

# 代码格式化
pnpm run format
```

## 🔧 开发工具

- **TypeScript** - 类型检查
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Jest** - 单元测试框架

## 📦 部署

### 生产环境部署

1. 设置环境变量（`.env.production`）
2. 构建项目：`pnpm run build`
3. 运行：`pnpm run start:prod`


```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --production
COPY dist ./dist
CMD ["node", "dist/main"]
```


⚠️ 本项目仅供个人学习与研究使用。 请勿将本项目用于任何商业用途或违法用途。 若产生法律纠纷，作者不承担任何责任。
