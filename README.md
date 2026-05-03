# YouWans · 春日游园：甘政法专属五泉山漫游指南

这是一个专为甘肃政法大学同学打造的周末游园向导平台，以 **兰州五泉山公园** 为核心，提供清晰的图文攻略、时间轴规划和周边美食建议。

不仅拥有绝佳的阅读体验，项目中还深度集成了真实地图数据，是一款“活”的旅游攻略。

---

## 核心亮点

- ✅ **沉浸式视觉体验**：深色山水氛围、流畅动画设计
- ✅ **动态图表概览**：直观展示从安宁西路校区出发到五泉山公园的距离
- ✅ **贴心时间游览轴**：从早晨打车到中午就餐的时间合理分配
- ✅ **地道美食指北**：周边实地臻选的牛肉面与聚餐馆
- ✅ **云端驱动数据**：地图与餐饮数据从云端下发，灵活更新

---

## 项目结构

```bash
.
├── wuquanshan_guide.html   # 页面主体（当前主页面）
├── api/
│   ├── amap-config.js      # 向前端安全下发 JSAPI 运行配置
│   └── guide-data.js       # 服务端读取 Web Service key 并返回核验数据
├── .env.example            # 环境变量模板
├── .gitignore              # 忽略本地敏感文件与依赖
├── vercel.json             # Vercel 基础配置
└── README.md               # 项目说明与部署指南
```

---

## 技术方案说明

### 前端
- 纯 HTML / CSS / JS
- 使用 `https://webapi.amap.com/loader.js` 动态加载高德地图 JSAPI
- 页面通过 `fetch('/api/amap-config')` 获取：
  - `AMAP_JSAPI_KEY`
  - `AMAP_SECURITY_JS_CODE`
- 页面通过 `fetch('/api/guide-data')` 获取：
  - 学校点位
  - 景区点位
  - 驾车路线摘要
  - 午饭店铺信息

### 服务端（Vercel Serverless Functions）
- `api/amap-config.js`
  - 返回前端地图所需的高德 JSAPI 配置
- `api/guide-data.js`
  - 使用 `AMAP_WEBSERVICE_KEY` 调高德 Web Service
  - 返回结构化攻略数据

---

## 环境变量配置

在本地或 Vercel 上，都需要配置以下环境变量：

### 必填
- `AMAP_WEBSERVICE_KEY`
- `AMAP_JSAPI_KEY`
- `AMAP_SECURITY_JS_CODE`

### `.env.example`

```env
AMAP_WEBSERVICE_KEY=
AMAP_JSAPI_KEY=
AMAP_SECURITY_JS_CODE=
```

> 注意：请不要把真实 key 提交进 Git 仓库。

---

## 本地开发说明

这个项目目前是一个偏静态的轻量项目，本地主要用于预览页面结构与逻辑。

### 方式一：直接用静态服务器预览
你可以在项目目录下用任意静态服务器运行，例如：

```bash
npx serve .
```

或：

```bash
python3 -m http.server 3000
```

但请注意：
- 单纯静态服务器只能预览页面结构
- 如果没有 Vercel / Node API 路由支持，`/api/*` 不会自动工作

### 方式二：部署到 Vercel 进行完整预览
这是推荐方式，因为本项目设计目标就是跑在 Vercel 上。

---

# Vercel 部署指南（推荐）

## 第 1 步：导入 GitHub 仓库
1. 登录 [Vercel](https://vercel.com/)
2. 点击 **Add New Project**
3. 选择你的 GitHub 仓库：
   - `zhikanyeye/youwans`
4. 点击 **Import**

---

## 第 2 步：配置环境变量
在 Vercel 项目配置页中找到：

**Project Settings → Environment Variables**

依次添加以下三项：

### 1. `AMAP_WEBSERVICE_KEY`
用途：
- 服务端调用高德 Web Service
- 用来生成路线、景区、POI、午饭店铺等核验数据

### 2. `AMAP_JSAPI_KEY`
用途：
- 前端加载高德地图 JSAPI
- 驱动真实地图渲染

### 3. `AMAP_SECURITY_JS_CODE`
用途：
- 高德 JSAPI v2 安全校验
- 必须和 `AMAP_JSAPI_KEY` 配套使用

---

## 第 3 步：重新部署
环境变量加完后：

- 点击 **Redeploy**
- 或重新触发一次部署

部署成功后，页面就能：
- 正常显示高德地图
- 正常展示学校与五泉山点位
- 正常拉取服务端核验数据

---

## 第 4 步：上线后验证
部署完成后，建议你检查：

### 页面层面
- 地图是否正常显示
- 点位是否正常渲染
- 路线摘要是否加载成功
- 午饭推荐是否从服务端返回

### API 层面
直接访问：

- `/api/amap-config`
- `/api/guide-data`

如果返回 JSON 且没有报错，说明配置正常。

---

## 常见问题排查

### 1. 地图空白 / 不显示
优先检查：
- `AMAP_JSAPI_KEY` 是否正确
- `AMAP_SECURITY_JS_CODE` 是否正确
- 高德控制台里 JSAPI key 的安全设置是否允许当前域名

### 2. 页面显示“配置缺失”
优先检查：
- `AMAP_JSAPI_KEY`
- `AMAP_SECURITY_JS_CODE`
是否在 Vercel 环境变量里填写了

### 3. 路线摘要 / 餐馆信息加载失败
优先检查：
- `AMAP_WEBSERVICE_KEY` 是否正确
- 该 key 是否已开通高德 Web Service 权限

### 4. 本地能看，线上报错
通常是：
- 环境变量没配
- key 配错
- 域名白名单没设

---

## 安全建议

### 不要这样做
- ❌ 把高德 key 直接写在前端源码里
- ❌ 把 `.env` 提交到仓库
- ❌ 在 README 里公开真实 key

### 推荐做法
- ✅ `AMAP_WEBSERVICE_KEY` 只在服务端 API 使用
- ✅ `AMAP_JSAPI_KEY` 与 `AMAP_SECURITY_JS_CODE` 通过 `/api/amap-config` 注入前端
- ✅ 所有真实 key 放在 Vercel 环境变量中

---

## 当前攻略已核验数据（2026-05-03）

### 景区
- 五泉山公园门址：**兰州市城关区五泉南路103号**
- 坐标：`103.824657,36.037959`

### 出发地
- 甘肃政法大学安宁西路校区：**兰州市安宁区安宁西路6号**
- 坐标：`103.729531,36.103393`

### 驾车摘要
- 距离约：**15.4 km**
- 时长约：**33.8 分钟**
- 出租参考：**31 元**

### 午饭实名店
1. **德祥楼（中山林店）**
2. **国保牛肉面（总店）**
3. **明德富纯汤牛肉面（五泉店）**

---

## 后续优化方向

如果继续迭代，这个项目还可以升级成：

- 更完整的 POI 卡片（附电话、营业时间、评分徽章）
- 多路线切换（学生省钱版 / 轻松拍照版 / 正餐慢吃版）
- 夜景或缆车扩展版
- 真正的高德前端路线分段高亮
- 分享页 / 长图版 / 移动端封面优化

---

## 维护建议

每次改完页面后，建议流程：

```bash
git add .
git commit -m "feat: update guide"
git push
```

Vercel 会自动拉取 GitHub 最新提交并重新部署。

---

## 最后一句

这个项目现在已经不是“一个好看的静态 HTML”，而是一个**可维护、可部署、可继续迭代**的小型旅游展示应用了。

如果你后面还想继续升级成“更适合发朋友 / 发朋友圈 / 发网页链接”的版本，这个仓库已经有了很好的底子。
