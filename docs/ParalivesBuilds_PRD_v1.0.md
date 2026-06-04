
# ParalivesBuilds 需求文档 (PRD)

## 1. 项目概述

### 1.1 产品名称
ParalivesBuilds —— Paralives 游戏房屋设计 & 角色造型灵感库

### 1.2 产品定位
专注生活模拟游戏 Paralives 的第三方社区内容聚合站，为玩家提供房屋设计灵感、建造教程和创作者展示平台。

### 1.3 目标用户
- Paralives 玩家（核心）：寻找建造灵感、分享作品
- 内容创作者：展示房屋设计、获取关注和收益
- 新玩家：学习建造技巧、了解游戏功能

### 1.4 核心目标
- 成为 Paralives 社区首选的房屋设计灵感库
- 在 Google 搜索 "paralives builds" 等关键词排名前三
- 6个月内达到月活 10K+，收录房屋 500+

---

## 2. 技术架构

### 2.1 基础设施
| 组件 | 方案 | 说明 |
|------|------|------|
| 前端托管 | Cloudflare Pages | 全球 CDN，自动部署 |
| 后端 API | Cloudflare Workers | 边缘计算，无冷启动 |
| 数据库 | D1 (SQLite) | 关系型数据，免费额度充足 |
| 图片存储 | R2 | 兼容 S3，无 egress 费用 |
| 图片处理 | Cloudflare Transform | 自动缩略图、WebP 转换 |
| 缓存 | Workers KV + Cache API | 热门数据边缘缓存 |
| 域名 | paralivesbuilds.com | 已购买 |

### 2.2 技术栈
- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS + shadcn/ui
- **数据库 ORM**: 原生 SQL (D1 兼容)
- **部署**: Wrangler CLI + GitHub Actions

### 2.3 部署流程
```
Git Push → GitHub Actions Build → Wrangler Deploy → Cloudflare Pages/Workers
```

---

## 3. 数据库设计

### 3.1 实体关系图
```
Builds (房屋) ←──→ Creators (创作者)
   ↑
   └──→ Tags (标签) [多对多]
   └──→ Styles (风格) [一对多]
```

### 3.2 表结构

#### builds — 房屋作品表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, AUTOINCREMENT | 主键 |
| slug | TEXT | UNIQUE, NOT NULL | URL 标识 |
| title | TEXT | NOT NULL | 标题 |
| description | TEXT | | 描述 |
| style | TEXT | | 风格枚举 |
| lot_size | TEXT | | 地块尺寸 |
| floors | INTEGER | | 楼层数 |
| bedrooms | INTEGER | | 卧室数 |
| bathrooms | INTEGER | | 浴室数 |
| budget | INTEGER | | 游戏内预算 |
| images | TEXT | | JSON 数组，R2 文件 key |
| workshop_url | TEXT | | Steam Workshop 链接 |
| video_url | TEXT | | YouTube 嵌入链接 |
| creator_id | INTEGER | FK → creators.id | 创作者 |
| featured | BOOLEAN | DEFAULT 0 | 精选标记 |
| likes_count | INTEGER | DEFAULT 0 | 点赞数 |
| views_count | INTEGER | DEFAULT 0 | 浏览数 |
| created_at | TEXT | DEFAULT datetime('now') | 创建时间 |
| updated_at | TEXT | DEFAULT datetime('now') | 更新时间 |

#### creators — 创作者表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, AUTOINCREMENT | 主键 |
| slug | TEXT | UNIQUE, NOT NULL | URL 标识 |
| name | TEXT | NOT NULL | 名称 |
| avatar | TEXT | | R2 文件 key |
| bio | TEXT | | 简介 |
| steam_id | TEXT | | Steam ID |
| reddit_username | TEXT | | Reddit 用户名 |
| youtube_channel | TEXT | | YouTube 频道 |
| patreon_url | TEXT | | Patreon 链接 |
| twitter_x | TEXT | | X/Twitter 链接 |
| builds_count | INTEGER | DEFAULT 0 | 作品数 |
| created_at | TEXT | DEFAULT datetime('now') | 创建时间 |

#### tags — 标签表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, AUTOINCREMENT | 主键 |
| name | TEXT | UNIQUE, NOT NULL | 标签名 |
| slug | TEXT | UNIQUE, NOT NULL | URL 标识 |
| build_count | INTEGER | DEFAULT 0 | 关联数 |

#### build_tags — 房屋标签关联表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| build_id | INTEGER | PK, FK → builds.id | 房屋 |
| tag_id | INTEGER | PK, FK → tags.id | 标签 |

#### styles — 风格表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, AUTOINCREMENT | 主键 |
| name | TEXT | UNIQUE, NOT NULL | 风格名 |
| slug | TEXT | UNIQUE, NOT NULL | URL 标识 |
| image | TEXT | | 封面图 R2 key |
| build_count | INTEGER | DEFAULT 0 | 关联数 |
| sort_order | INTEGER | DEFAULT 0 | 排序 |

### 3.3 初始化数据
```sql
INSERT INTO styles (name, slug, sort_order) VALUES 
  ('Modern', 'modern', 1),
  ('Cottage', 'cottage', 2),
  ('Minimalist', 'minimalist', 3),
  ('Industrial', 'industrial', 4),
  ('Rustic', 'rustic', 5),
  ('Victorian', 'victorian', 6),
  ('Tropical', 'tropical', 7),
  ('Suburban', 'suburban', 8),
  ('Farmhouse', 'farmhouse', 9),
  ('Bohemian', 'bohemian', 10);
```

---

## 4. API 接口设计

### 4.1 接口规范
- Base URL: `https://paralivesbuilds.com/api`
- 响应格式: JSON
- 分页参数: `page` (默认1), `limit` (默认20, 最大50)

### 4.2 接口列表

#### GET /api/builds
获取房屋列表

**Query 参数:**
| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| style | string | 风格筛选 | `modern` |
| tag | string | 标签筛选 | `starter-home` |
| q | string | 搜索关键词 | `cozy loft` |
| sort | string | 排序: newest/popular/featured | `popular` |
| page | number | 页码 | 1 |
| limit | number | 每页数量 | 20 |

**响应:**
```json
{
  "data": [
    {
      "id": 1,
      "slug": "cozy-cottage-starter",
      "title": "Cozy Cottage Starter Home",
      "style": "cottage",
      "lot_size": "20x15",
      "floors": 1,
      "images": ["builds/cozy-cottage-starter/cover"],
      "creator": {
        "name": "Paralives Team",
        "slug": "paralives-official"
      },
      "likes_count": 128,
      "views_count": 2048
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "total_pages": 8
  }
}
```

#### GET /api/builds/[slug]
获取单个房屋详情

**响应:**
```json
{
  "id": 1,
  "slug": "cozy-cottage-starter",
  "title": "Cozy Cottage Starter Home",
  "description": "A perfect starter home for new Paralives players...",
  "style": "cottage",
  "lot_size": "20x15",
  "floors": 1,
  "bedrooms": 2,
  "bathrooms": 1,
  "budget": 18000,
  "images": [
    "builds/cozy-cottage-starter/cover",
    "builds/cozy-cottage-starter/1",
    "builds/cozy-cottage-starter/2"
  ],
  "workshop_url": "https://steamcommunity.com/sharedfiles/...",
  "video_url": "https://youtube.com/watch?v=...",
  "creator": {
    "id": 1,
    "name": "Paralives Team",
    "slug": "paralives-official",
    "avatar": "creators/paralives-official/avatar",
    "patreon_url": null
  },
  "tags": ["starter-home", "budget-friendly", "family"],
  "likes_count": 128,
  "views_count": 2048,
  "created_at": "2026-06-01T10:00:00Z"
}
```

#### GET /api/creators/[slug]
获取创作者详情及作品列表

#### GET /api/styles
获取所有风格列表

#### GET /api/styles/[slug]
获取风格详情及关联房屋

#### GET /api/featured
获取精选房屋（首页展示）

#### GET /api/search?q={keyword}
搜索房屋（标题 + 描述 + 标签）

---

## 5. 页面设计

### 5.1 页面清单

| 页面 | 路由 | 优先级 | 说明 |
|------|------|--------|------|
| 首页 | `/` | P0 | 精选瀑布流 + 热门风格 |
| 浏览页 | `/builds` | P0 | 筛选 + 网格列表 |
| 房屋详情 | `/builds/[slug]` | P0 | 图库 + 信息 + 下载 |
| 风格页 | `/styles/[slug]` | P0 | 风格聚合 |
| 创作者主页 | `/creators/[slug]` | P1 | 作品集 |
| 教程页 | `/guides` | P1 | 建造技巧 |
| 关于页 | `/about` | P2 | 项目介绍 |
| 上传页 | `/upload` | P2 | 创作者提交 |

### 5.2 首页设计

**布局结构:**
```
┌─────────────────────────────────────────┐
│  Navbar (Logo + 搜索 + 风格导航)         │
├─────────────────────────────────────────┤
│  Hero Section                            │
│  - 大标题: "Paralives Build Inspiration"  │
│  - 副标题: "Discover amazing homes..."  │
│  - CTA: Browse Builds / Submit Build    │
├─────────────────────────────────────────┤
│  风格快捷入口 (8个风格卡片横向滚动)         │
├─────────────────────────────────────────┤
│  精选房屋 (Featured Builds)              │
│  - 瀑布流 Masonry 布局                   │
│  - 每张卡片: 封面图 + 标题 + 创作者 + 风格标签 │
├─────────────────────────────────────────┤
│  最新上传 (Latest Builds)                │
│  - 同上瀑布流                            │
├─────────────────────────────────────────┤
│  Footer                                  │
└─────────────────────────────────────────┘
```

**卡片设计:**
- 圆角 12px
- 阴影: 0 2px 8px rgba(0,0,0,0.08)
- 悬停: 阴影加深 + 图片放大 1.05
- 信息 overlay: 底部渐变遮罩 + 白色文字

### 5.3 房屋详情页设计

**布局结构:**
```
┌─────────────────────────────────────────┐
│  Navbar                                  │
├─────────────────────────────────────────┤
│  Breadcrumb: Home > Cottage > Title       │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────┐  │
│  │              │  │ 标题              │  │
│  │   图片画廊    │  │ 创作者信息         │  │
│  │  (主图 + 缩略图)│  │ 风格标签          │  │
│  │              │  │                   │  │
│  │              │  │ 房屋信息网格       │  │
│  │              │  │ (格子数/楼层/卧室)  │  │
│  │              │  │                   │  │
│  │              │  │ 下载按钮           │  │
│  │              │  │ (Steam Workshop)   │  │
│  │              │  │                   │  │
│  │              │  │ 描述文本           │  │
│  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────┤
│  相关推荐 (同风格其他房屋)                │
├─────────────────────────────────────────┤
│  Footer                                  │
└─────────────────────────────────────────┘
```

### 5.4 浏览页设计

**筛选栏:**
- 风格下拉: All / Modern / Cottage / Minimalist / ...
- 排序: Newest / Most Popular / Most Viewed
- 搜索框: 实时搜索

**响应式布局:**
- Desktop: 4 列网格
- Tablet: 3 列
- Mobile: 2 列

---

## 6. 图片资源规范

### 6.1 R2 存储结构
```
paralivesbuilds-images (bucket)
├── builds/
│   ├── {slug}/
│   │   ├── cover.webp      (1200x800, 封面)
│   │   ├── 1.webp          (1200x800, 截图1)
│   │   ├── 2.webp          (1200x800, 截图2)
│   │   ├── 3.webp          (1200x800, 截图3)
│   │   └── thumb.webp      (400x300, 列表缩略图)
│   └── ...
├── creators/
│   ├── {slug}/
│   │   └── avatar.webp     (200x200)
│   └── ...
└── styles/
    └── {slug}/
        └── cover.webp      (600x400, 风格封面)
```

### 6.2 图片处理 URL
```
原图: https://images.paralivesbuilds.com/builds/{slug}/cover.webp
缩略图: https://images.paralivesbuilds.com/cdn-cgi/image/width=400,quality=80/builds/{slug}/cover.webp
WebP 转换: https://images.paralivesbuilds.com/cdn-cgi/image/format=webp/builds/{slug}/cover.webp
```

### 6.3 图片要求
- 格式: WebP (优先), JPEG 备选
- 尺寸: 封面 1200x800, 缩略图 400x300
- 大小: 单张 < 500KB
- 命名: 小写，连字符分隔

---

## 7. SEO 策略

### 7.1 关键词布局

| 页面 | 主关键词 | Title 模板 | Meta Description |
|------|---------|-----------|-----------------|
| 首页 | paralives builds, paralives house ideas | Paralives Builds - House Design Inspiration & Ideas | Discover amazing Paralives builds, house designs, and building inspiration. Browse modern, cottage, and minimalist homes. |
| 浏览页 | paralives build ideas | Browse {Style} Paralives Builds | Find the best {style} builds for Paralives. Filter by style, lot size, and more. |
| 详情页 | [title] paralives build | {Title} - Paralives Build by {Creator} | Check out {title}, a {style} {lot_size} build in Paralives. Download on Steam Workshop. |
| 风格页 | paralives [style] builds | Best {Style} Paralives Builds | Explore the top {style} builds in Paralives. Find inspiration for your next home. |

### 7.2 技术 SEO
- 生成 sitemap.xml (动态，包含所有 builds)
- 配置 robots.txt
- 添加 Open Graph / Twitter Card 标签
- 结构化数据 (Schema.org): Article / CreativeWork
- 图片 alt 文本: "{title} - {style} Paralives build"

### 7.3 性能优化
- 图片懒加载 (Intersection Observer)
- 核心 Web Vitals 目标: LCP < 2.5s, CLS < 0.1
- 使用 Cloudflare Cache API 缓存 API 响应

---

## 8. 内容策略

### 8.1 种子内容来源
1. **Steam Workshop** — 手动收集优质房屋，截图保存
2. **Reddit r/Paralives** — 热门建造分享帖
3. **YouTube** — 建造视频封面 + 嵌入
4. **官方社交媒体** — 官方展示的房屋

### 8.2 内容标准
- 每套房屋至少 3 张截图（外观/内饰/俯视图）
- 必须标注原作者和 Steam Workshop 链接
- 信息完整: 风格、格子数、楼层、卧室/浴室数

### 8.3 内容审核流程
```
创作者提交 → 审核队列 → 管理员检查 → 发布上线
                ↓
           不通过 → 退回修改
```

### 8.4 冷启动目标
- **Week 1**: 30 套种子房屋
- **Week 2**: 50 套
- **Month 1**: 100 套
- **Month 3**: 300 套
- **Month 6**: 500+ 套

---

## 9. 用户功能

### 9.1 MVP 阶段 (P0)
- [x] 浏览房屋列表
- [x] 查看房屋详情
- [x] 风格筛选
- [x] 搜索
- [x] 响应式设计

### 9.2 Phase 1 (P1, 1-2月)
- [ ] 创作者主页
- [ ] 收藏功能 (本地存储)
- [ ] 分享按钮 (Twitter/X, Reddit)
- [ ] 教程页面
- [ ] 相关推荐

### 9.3 Phase 2 (P2, 2-3月)
- [ ] 用户注册/登录 (Clerk)
- [ ] 创作者上传功能
- [ ] 点赞系统
- [ ] 评论系统
- [ ] 收藏同步到账号

### 9.4 Phase 3 (P3, 3-6月)
- [ ] 高级筛选 (预算/格子数/房间数)
- [ ] 收藏夹管理
- [ ] 邮件订阅 (新作品通知)
- [ ] 暗黑模式

---

## 10. 变现策略

### 10.1 变现路径

| 阶段 | 时间 | 方式 | 说明 |
|------|------|------|------|
| 1 | 0-1月 | 无 | 纯内容积累 |
| 2 | 1-2月 | Steam 联盟 | 游戏购买链接抽成 |
| 3 | 2-3月 | Patreon 导流 | 创作者页面展示 Patreon 链接 |
| 4 | 3-6月 | 高级功能 | 高级筛选/无广告会员 |
| 5 | 6月+ | 品牌广告 | 家具品牌/设计软件广告位 |

### 10.2 联盟营销
- Steam 联盟计划: 游戏购买 5-10% 抽成
- Amazon Associates: 游戏周边/硬件推荐
- 设计软件联盟: SketchUp, Blender 等

### 10.3 创作者经济
- 创作者页面展示 Patreon/Ko-fi 链接
- 不抽成，换取内容首发/独家
- 未来考虑创作者订阅分成

---

## 11. 推广计划

### 11.1 社区推广
- **Reddit r/Paralives**: 发布站点介绍帖，参与建造讨论
- **Steam 社区**: 在 Workshop 评论中推荐
- **Discord**: 加入 Paralives 官方 Discord，分享优质内容
- **X/Twitter**: 每日发布精选房屋，@创作者

### 11.2 内容营销
- 每周精选: "本周最佳 Paralives Builds"
- 建造挑战: 发起主题建造活动，收集作品
- 教程文章: "How to Build a Modern Loft in Paralives"

### 11.3 SEO 长期策略
- 持续产出长尾关键词内容
- 获取外部链接 (游戏媒体、博主推荐)
- 优化 Core Web Vitals

---

## 12. 项目里程碑

### Phase 0: 基础设施 (Week 1)
- [x] 域名购买
- [ ] D1 数据库创建 + Schema 部署
- [ ] R2 Bucket 配置 + 自定义域名
- [ ] Next.js 项目初始化 + Cloudflare Adapter
- [ ] 首页静态原型

### Phase 1: MVP 上线 (Week 2-3)
- [ ] 首页瀑布流实现
- [ ] 浏览页 + 筛选功能
- [ ] 详情页 + 图片画廊
- [ ] 30 套种子内容填充
- [ ] SEO 基础配置
- [ ] 部署上线

### Phase 2: 社区功能 (Month 2)
- [ ] 创作者页面
- [ ] 收藏/分享功能
- [ ] 内容增长到 100 套
- [ ] Reddit 推广启动

### Phase 3: 变现接入 (Month 3)
- [ ] Steam 联盟链接
- [ ] 创作者 Patreon 展示
- [ ] 高级筛选功能
- [ ] 内容增长到 200 套

### Phase 4: 规模化 (Month 6)
- [ ] 用户上传功能
- [ ] 评论/点赞系统
- [ ] 邮件订阅
- [ ] 内容增长到 500+ 套
- [ ] 月活 10K+

---

## 13. 风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|---------|
| Paralives 游戏热度下降 | 高 | 扩展至其他生活模拟游戏 (inZOI, The Sims) |
| 内容版权纠纷 | 中 | 严格标注来源，联系作者授权，建立申诉机制 |
| SEO 竞争加剧 | 中 | 先发优势，持续产出优质内容，建立品牌认知 |
| 技术性能瓶颈 | 低 | Cloudflare 边缘架构，图片优化，缓存策略 |
| 变现不及预期 | 中 | 多元化收入，联盟 + 广告 + 会员 |

---

## 14. 附录

### 14.1 参考竞品
- [The Sims Resource](https://www.thesimsresource.com/) — CC 内容站龙头
- [SimsDom](https://www.simsdom.com/) — 房屋展示社区
- [Nexus Mods](https://www.nexusmods.com/) — 模组分发平台

### 14.2 Paralives 官方资源
- Steam 页面: https://store.steampowered.com/app/1118520/Paralives/
- Reddit: https://www.reddit.com/r/Paralives/
- Discord: https://discord.gg/paralives
- Twitter/X: @ParalivesGame

### 14.3 工具推荐
- 截图工具: ShareX (Windows), CleanShot (Mac)
- 图片压缩: Squoosh, TinyPNG
- SEO 分析: Ahrefs Free, Google Search Console
- 分析: Cloudflare Analytics, Google Analytics 4

---

**文档版本**: v1.0
**创建日期**: 2026-06-04
**更新频率**: 每两周回顾更新
**负责人**: [你的名字]

---
