
# ParalivesBuilds — 设计系统 Token

## 颜色系统

### 主色
| Token | 值 | 用途 |
|-------|-----|------|
| --color-accent | #e07a5f | 主按钮、链接、活跃状态 |
| --color-accent-hover | #c96a52 | 按钮悬停 |
| --color-accent-light | rgba(224,122,95,0.1) | 标签背景 |

### 中性色
| Token | 值 | 用途 |
|-------|-----|------|
| --color-bg | #faf9f7 | 页面背景 |
| --color-bg-card | #ffffff | 卡片背景 |
| --color-text-primary | #1a1a1a | 标题、主文本 |
| --color-text-secondary | #6b6b6b | 副标题、描述 |
| --color-text-muted | #9a9a9a | 辅助信息 |
| --color-border | #e8e6e3 | 边框、分割线 |

### 功能色
| Token | 值 | 用途 |
|-------|-----|------|
| --color-badge-bg | rgba(0,0,0,0.6) | 卡片角标 |
| --color-overlay | linear-gradient(transparent, rgba(0,0,0,0.7)) | 图片渐变遮罩 |

## 字体系统

| Token | 大小 | 字重 | 行高 | 字间距 | 用途 |
|-------|------|------|------|--------|------|
| --text-hero | 48px | 700 | 1.15 | -0.02em | 首页大标题 |
| --text-h1 | 32px | 700 | 1.2 | -0.01em | 详情页标题 |
| --text-h2 | 24px | 700 | 1.3 | 0 | 区块标题 |
| --text-h3 | 18px | 600 | 1.4 | 0 | 详情页小标题 |
| --text-body | 15px | 400 | 1.7 | 0 | 正文描述 |
| --text-small | 13px | 500 | 1.5 | 0 | 创作者名、统计 |
| --text-xs | 12px | 600 | 1.4 | 0.03em | 角标、标签 |
| --text-caption | 11px | 600 | 1.4 | 0.03em | 信息项标签 |

## 间距系统

| Token | 值 | 用途 |
|-------|-----|------|
| --space-xs | 4px | 图标间隙 |
| --space-sm | 8px | 元素内间距 |
| --space-md | 12px | 卡片内边距 |
| --space-lg | 16px | 组件间距 |
| --space-xl | 20px | 网格间隙 |
| --space-2xl | 24px | 页面边距 |
| --space-3xl | 32px | 区块间距 |
| --space-4xl | 40px | 大区块间距 |
| --space-5xl | 60px | Hero 间距 |
| --space-6xl | 80px | Footer 间距 |

## 圆角系统

| Token | 值 | 用途 |
|-------|-----|------|
| --radius-sm | 8px | 按钮、输入框 |
| --radius-md | 12px | 小卡片 |
| --radius-lg | 14px | 主卡片 |
| --radius-xl | 20px | 风格芯片 |
| --radius-full | 9999px | 头像、搜索框 |

## 阴影系统

| Token | 值 | 用途 |
|-------|-----|------|
| --shadow-card | 0 2px 12px rgba(0,0,0,0.06) | 默认卡片 |
| --shadow-hover | 0 8px 32px rgba(0,0,0,0.12) | 悬停卡片 |
| --shadow-nav | 0 2px 12px rgba(0,0,0,0.06) | 底部导航 |

## 布局规范

### 容器
- 最大宽度: 1280px
- 页面边距: 24px (桌面) / 16px (移动端)
- 网格间隙: 20px (桌面) / 12px (移动端)

### 响应式断点
| 断点 | 宽度 | 网格列数 |
|------|------|---------|
| sm | < 640px | 2列 |
| md | 640-768px | 2列 |
| lg | 768-1024px | 3列 |
| xl | 1024-1280px | 4列 |
| 2xl | > 1280px | 4列 |

### 卡片规范
- 圆角: 14px
- 图片比例: 4:3 (默认) / 3:4 (高卡片)
- 悬停: translateY(-4px) + shadow-hover
- 图片悬停: scale(1.05)
- 过渡: all 0.3s ease

### 图片渐变遮罩
```
linear-gradient(
  to bottom,
  transparent 0%,
  transparent 40%,
  rgba(0,0,0,0.7) 100%
)
```

### 角标规范
- 背景: rgba(0,0,0,0.6) + backdrop-filter: blur(4px)
- 文字: 白色, 11px, 600, uppercase
- 圆角: 20px
- 内边距: 4px 10px
