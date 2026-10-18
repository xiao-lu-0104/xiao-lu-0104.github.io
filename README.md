# 个人主页（VitePress）

一个用 [VitePress](https://vitepress.dev/) 搭建的个人站点，包含：

- **首页**：个人简介、个人信息、做过什么、最新动态
- **工程经历** `/engineering/`：项目 / 竞赛记录
- **博客** `/blog/`：技术分享与吐槽
- **科研经历** `/research/`：论文阅读、实验记录
- **关于我** `/about`：更完整的个人信息

三个栏目都支持**新建、编辑、删除**，通过自带的本地管理台操作。

## 快速开始

```bash
npm install        # 首次运行
npm run dev        # 同时启动站点 + 管理台
```

- 站点：http://localhost:5173
- 管理台：http://127.0.0.1:4317

也可以分开启动：

```bash
npm run docs:dev   # 只启动站点
npm run manage     # 只启动管理台
```

## 管理内容

打开管理台（http://127.0.0.1:4317），左侧选择栏目，右侧编辑：

- **新建**：右上角「+ 新建」，填写标题、文件名、日期、标签、摘要、正文
- **编辑**：点击左侧列表中的条目
- **删除**：打开条目后点右下角「删除」
- **插入图片**：工具栏「插入图片」，图片会存到 `docs/public/uploads/` 并自动插入 Markdown 链接
- **草稿**：勾选「存为草稿」，页面仍可通过直接访问链接打开，但不会出现在列表里
- `Ctrl + S` 保存

本质上管理台就是在写 `docs/` 下的 Markdown 文件，所以你也可以直接用 VS Code 编辑：

```
docs/
├─ engineering/   工程经历
├─ blog/          博客
└─ research/      科研经历
```

每篇文章的格式：

```md
---
title: 文章标题
date: 2026-10-18
tags: [Verilog, 调试]
summary: 一句话摘要，显示在列表卡片上
---

# 文章标题

正文……
```

> 文件名（slug）就是 URL，例如 `docs/blog/hello-world.md` → `/blog/hello-world`。
> 文件名只允许中英文、数字、`-` 和 `_`。

## 修改个人信息

站点的名字、简介、技能、时间线、联系方式都在：

```
docs/.vitepress/site.ts
```

导航栏、社交链接、页脚在：

```
docs/.vitepress/config.mts
```

首页的大标题、标语和按钮在：

```
docs/index.md
```

「关于我」页面的详细内容在：

```
docs/about.md
```

首页头像替换成自己的图片：把文件放到 `docs/public/`，然后修改 `site.ts` 里的 `avatar`。

## 构建与部署

站点已经配置好 GitHub Pages 自动部署（`.github/workflows/deploy.yml`）。

```bash
npm run docs:build     # 输出到 docs/.vitepress/dist
npm run docs:preview   # 本地预览构建结果
```

### 首次上线步骤

1. 在 GitHub 新建一个仓库（建议 **Public**，不要勾选 “Add a README file”）
   - 仓库名用 `<你的用户名>.github.io` → 网站地址是 `https://<用户名>.github.io/`
   - 仓库名用其他名字（如 `my-web`）→ 地址是 `https://<用户名>.github.io/my-web/`，`base` 会自动适配，不用改代码
2. 在项目目录推送代码：

   ```bash
   git remote add origin https://github.com/<用户名>/<仓库名>.git
   git push -u origin main
   ```

3. 打开仓库 **Settings → Pages**，把 **Source** 设为 **GitHub Actions**
4. 回到 **Actions** 页面，等 “Deploy to GitHub Pages” 跑完，访问上面的地址即可

之后每次 `git push`，GitHub 会自动重新构建并发布。

### 日常更新流程

1. 双击 `start.bat` 打开管理台，编辑/新增/删除文章并保存
2. 双击 `publish.bat`（或手动执行 `git add .` → `git commit -m "说明"` → `git push`）
3. 等 1~2 分钟，刷新 https://xiao-lu-0104.github.io/ 查看

> 注意：管理台只在本地运行，部署后没有写文件的能力。线上新增/修改内容的正确方式是编辑 Markdown 并 push。

## 目录结构

```
my_web/
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts          站点配置
│  │  ├─ site.ts             个人信息（改这里）
│  │  ├─ data/               三个栏目的内容加载器
│  │  └─ theme/              自定义主题与组件
│  ├─ engineering/           工程经历
│  ├─ blog/                  博客
│  ├─ research/              科研经历
│  ├─ public/                静态资源（头像、图片）
│  ├─ index.md               首页
│  └─ about.md               关于我
├─ admin/
│  ├─ server.mjs             本地管理后台服务
│  └─ ui/index.html          管理界面
└─ scripts/dev.mjs           一键启动脚本
```
