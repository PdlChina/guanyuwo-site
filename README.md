# 路里v路外 · 个人站（guanyuwo.cn）

医美行业内部人 × AI 跨界玩家 × 真诚科普者的个人作品 / 科普站点。
单页静态站，零构建依赖，可直接托管在 **GitHub Pages** 并绑定自定义域名 `guanyuwo.cn`。

> 本仓库已包含 GEO（生成式引擎优化）三件套：`Person` 结构化数据、`FAQPage` 问答区块（静态 `<details>`，禁用 JS 也能被 AI 搜索抓取）、`<main>` 语义化结构。

---

## 目录结构（即仓库根 = 站点根）

```
guanyuwo-v2/
├── index.html              # 首页（单页全内容 + JSON-LD）
├── CNAME                  # 自定义域名声明：guanyuwo.cn
├── assets/
│   ├── css/style.css       # 设计系统与全部样式
│   └── js/
│       ├── works-data.js   # 作品数据（改这里就能更新作品）
│       └── main.js         # 渲染 / 筛选 / 表单 / 动画逻辑
├── .gitignore
└── README.md
```

GitHub Pages 要求站点文件在仓库根目录（或 `/docs`），本仓库已满足「根目录」要求。

---

## 一、本地预览（上线前先自检）

```bash
cd guanyuwo-v2
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

---

## 二、推送到 GitHub（首次部署）

1. 在 GitHub 新建一个**空仓库**（Repository），名字随意（如 `guanyuwo`），
   **不要**勾选 "Initialize this repository with a README"（保持空，避免和本地冲突）。
2. 在本地仓库目录执行：

```bash
cd /Users/luther/Documents/WorkBuddy/自媒体工作空间/guanyuwo-v2

git init -b main
git add .
git commit -m "init: 路里v路外个人站 v2 (含 GEO 结构化数据)"

# 把下面地址换成你自己的仓库
git remote add origin git@github.com:你的用户名/你的仓库名.git
git push -u origin main
```

> 若用 HTTPS 地址（`https://github.com/用户名/仓库名.git`）也可以，首次 push 需输入账号密码 / Token。

---

## 三、开启 GitHub Pages

1. 进入仓库 **Settings → Pages**。
2. **Source** 选择 `Deploy from a branch`。
3. **Branch** 选 `main`，目录选 `/ (root)`。
4. 点 **Save**。
5. 几秒后页面会显示 `Your site is live at https://你的用户名.github.io/你的仓库名`。

（也可以用 GitHub Actions 部署，但静态站用「从分支部署」最简单，无需额外配置。）

---

## 四、绑定自定义域名 guanyuwo.cn

1. 仓库 **Settings → Pages → Custom domain**，填入 `guanyuwo.cn`，点 Save。
   - GitHub 会读取仓库里的 `CNAME` 文件，确认域名归属。
   - 勾选 **Enforce HTTPS**（证书会自动签发，可能需几分钟到几小时）。
2. 到你的**域名服务商**（阿里云 / 腾讯云 DNSPod / Cloudflare 等）配置 DNS：
   - `guanyuwo.cn` 是**裸域名（apex）**，按 GitHub 官方建议添加 **4 条 A 记录**指向 Pages 服务器：

   | 类型 | 主机记录 | 记录值 |
   |------|----------|--------|
   | A    | @        | 185.199.108.153 |
   | A    | @        | 185.199.109.153 |
   | A    | @        | 185.199.110.153 |
   | A    | @        | 185.199.111.153 |

   - （可选）`www.guanyuwo.cn`：添加 **CNAME 记录**，主机记录 `www`，记录值 `你的用户名.github.io`。
3. 等待 DNS 生效（通常几分钟，最长 48h），访问 **https://guanyuwo.cn** 即可。

> 裸域名不能用 CNAME 记录（DNS 规范限制），所以必须用上面的 A 记录；仓库里的 `CNAME` 文件只是告诉 GitHub「这个仓库服务于 guanyuwo.cn」。

---

## 五、后续怎么更新内容（无需改 HTML 结构）

| 想改什么 | 改哪个文件 | 怎么改 |
|----------|-----------|--------|
| 作品列表 / 代表作 | `assets/js/works-data.js` | 在 `window.WORKS = [...]` 里按模板加一条对象：`title` / `desc` / `type`(`article`文章·`video`视频·`image`图文) / `platform` / `date` / `link` / `featured`(true 进代表作) / `cover`(可选图片 URL) |
| 社交平台主页 | `index.html` 的 `#socials` 区块 | 把 `href="#"` 换成真实主页链接 |
| 合作表单提交 | `assets/js/main.js` 顶部 `FORM_ENDPOINT` | 填 Formspree 地址可直接提交；留空则自动降级为邮件 `hi@guanyuwo.cn` |
| AI 搜索实体关联 | `index.html` 里 `Person` 的 `sameAs` | 上线后把抖音 / 小红书等真实主页 URL 加进数组 |
| 文案 / 板块 | `index.html` 与 `assets/css/style.css` | 直接编辑对应区块 |

改完执行：

```bash
git add .
git commit -m "update: 更新作品/文案"
git push
```

GitHub Pages 会自动重新发布（通常 1 分钟内生效）。

---

## 六、上线注意事项

- **旧多页遗留**：若之前线上是多页结构（如 `works.html` / `about.html`），新站是单页，这些旧路径不在本仓库里，访问会 404。
  如担心旧链接失效，可保留一个 `works.html` 做 `<meta http-equiv="refresh" content="0;url=/">` 跳转；或直接告知受众以新首页为准。
- **HTTPS**：务必等 Enforce HTTPS 证书签发成功后再对外宣传，避免浏览器拦截。
- **CNAME 不要删**：它是自定义域名生效的关键文件，提交后不要从仓库移除。

---

## 七、技术要点（给维护者）

- 纯静态、零 npm 构建，任何静态托管（GitHub Pages / Vercel / Netlify / 对象存储）都能用。
- 滚动揭示动画带三重兜底：`html.no-js`、3 秒强制显示、`prefers-reduced-motion`，禁用 JS 也绝不会整页空白。
- FAQ 用原生 `<details>`，内容在 HTML 源码里，AI 搜索引擎无需执行 JS 即可抓取，配合 `FAQPage` JSON-LD 提升被引用的概率。
