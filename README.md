# alice-greyrat · 艾莉丝 狂剑王

DeepSeek Harness Web GUI 的《无职转生》艾莉丝·伯雷亚斯·格雷拉特主题皮肤。
纯展示层客户端插件——`apply()` 设置 `data-dsh-alice-greyrat` 作用域、按亮/暗主题
切换对话区场景、在对话区内挂载两幅立绘与魔法阵层、在左侧任务栏空白处立一块
Q 版立牌，并重新装饰侧栏与输入框。effect 销毁器还原全部 CSS/DOM 写入；不注入
服务、不发出 Cordis 事件、不触达模型请求。

## 特性

**对话区**

- **场景背景**：浅色（风车花田）与深色（黄昏城塞）两张场景图随亮/暗主题切换，
  经淡化处理并由一层可调的阅读遮罩压住，正文始终落在淡色面板上。
- **双立绘**：左侧黑衣皮草、右侧褐衣剑士两幅艾莉丝立绘（去底透明），贴对话区
  底部左右，带轻微浮动动画；窄屏与手机自动收起。
- **魔法阵与余烬**：程序化绘制的七芒魔法阵缓慢旋转，叠加飘动余烬与细斜纹。
- **鎏金边框**：对话区上下各一条金色细线，两端与中央各有小菱形结点。

**侧栏（左侧任务栏）**

- **幼年立牌**：幼年艾莉丝全身立绘（红斗篷、黑裙、抱臂），站在会话列表下方的空白处，带亚克力底座
  投影。**点开/收起侧栏时它会一起收放**——折叠成图标栏时淡出并下沉，展开时
  淡入复位。
- **淡绯金配色**：侧栏为淡玫瑰渐变 + 鎏金细描边，底部铺一枚淡魔法阵水印。
- **图标美化**：插件与工作区图标的字形（`panelGlyph`）获得鎏金圆角底盘，
  激活项反白；新建会话按钮、搜索框、底部设置按钮都改为淡色鎏金牌匾；
  Windows 标题栏按钮与品牌行也一并重绘。
- **会话行**：选中项带玫瑰色渐变底 + 左侧强调色竖条。

**其它**

- 输入框：鎏金描边、聚焦时强调色光环、正文使用衬线字体。
- 设置面板：随本皮肤注册，见「设置 → 皮肤管理 → 艾莉丝 狂剑王」。
- 可热切换：加载即生效、卸载即复原（`wiring.id` 为 `ui-skin-alice-greyrat`）。
- 图片素材随包分发，由皮肤自己的同源路由 `/skin-assets/alice-greyrat/` 提供，
  按内容 sha256 命名并可永久缓存；激活不依赖任何远程 URL。
- 标签页与 Windows 桌面快捷方式图标随皮肤切换。

## 配色

刻意取淡：所有被覆盖的宿主表面都是**不透明**的浅色（暗色主题下为深色）色块，
因此正文永远不会落在看不清的背景上。

| 令牌 | 浅色 | 深色 |
| --- | --- | --- |
| 应用底色 `--dsw-alias-bg-base` | `#f9f2ef` | `#1c0d12` |
| 面板 | `#fffdfb` | `#2e1a20` |
| 强调色 | `#c2606a` | `#d98a90` |
| 鎏金 | `#c2a05a` | `#d3b273` |
| 侧栏 | `#fdf7f5 → #f1e0de` | `#341a21 → #221017` |

## 安装

```powershell
$pkg  = "dsh-client-ui-skin-alice-greyrat"
$dest = "$env:USERPROFILE\.dsh\profiles\desktop\node_modules\$pkg"
New-Item -ItemType Directory -Force (Split-Path $dest) | Out-Null
New-Item -ItemType Junction -Path $dest -Target "<本仓库路径>\$pkg"
```

然后在 `~/.dsh/profiles/<profile>/package.json` 的 `dependencies` 与
`dsh.profile.bundles` 中各加入 `"dsh-client-ui-skin-alice-greyrat"`，重启一次
DSH，在「设置 → 皮肤管理」中启用。之后启用/停用走配置热重载，无需重启。

皮肤管理器通过扫描 profile 的 `dependencies` 与 `dsh.profile.bundles` 发现带
有效 `skin.json` 的包，因此两处都必须登记：前者让它出现在管理页，后者让它的
`cordis.patch.yml` 把 `ui-skin-alice-greyrat` 插入 web 插件花名册。

## 目录结构

```
skin.json               皮肤清单（管理器据此发现与展示）
cordis.patch.yml        把 ui-skin-alice-greyrat 插入插件花名册
skin.build.json         构建指纹（管理器用于版本识别）
lib/index.js            宿主半侧：只读地发布本包的美术资源
lib/client.js           浏览器半侧：样式、DOM 舞台、侧栏立牌与设置面板
assets/runtime/         内容寻址的美术资源 + manifest.json 白名单
assets/icons/*.ico      Windows 快捷方式图标
preview/                亮/暗预览图
locale/                 面板标题的本地化
```

## 可用设置

| 键 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `backdrop` | boolean | `true` | 对话区场景背景 |
| `backdropDim` | range | `30` | 背景压暗百分比 |
| `sigil` | boolean | `true` | 魔法阵纹章（对话区 + 侧栏水印） |
| `artwork` | boolean | `true` | 对话区两幅立绘 |
| `artworkOpacity` | range | `85` | 立绘 / 立牌不透明度 |
| `sidebarStandee` | boolean | `true` | 侧栏幼年立牌 |
| `accent` | color | `#c2606a` | 强调色 |
| `accentTargets` | checkbox-group | `frame,composer,title` | 强调目标 |
| `sfwMode` | visibility-schedule | 关闭 | 时段内隐藏立绘与立牌 |

## 已知取舍

- 皮肤用 `!important` 覆盖 `--dsw-alias-*` 设计令牌。DeepSeek Harness 把主题令牌
  写成 `body` 的**内联**自定义属性，普通样式表声明压不过它们；同时所有被覆盖的
  表面都取不透明色，避免出现"文字与背景同色"。
- **侧栏不覆盖文本令牌**。宿主的设置对话框会被 portal 到侧栏列内部，若在
  `[class*=sidebarCol]` 上改写 `--dsw-alias-label-*`，对话框会继承这些颜色落到
  自己的浅色面板上而看不见字。侧栏因此沿用全局标签色。
- `load` 后客户端 loader 会把所有未标记的 `<style>` 打上本插件的 id，并在插件
  卸载时一并删除。`lib/client.js` 因此给自己注入的样式打上 `data-plugin-css`，
  并在安装与卸载时各调用一次 `releaseClaimedStyles()`，把被误认领的他人样式
  交还出去。
- 立牌挂在 `regionArea`（`flex:1` 的会话区）底部，因此它正好落在会话列表下方
  的空白处，并被该区域的 `overflow:hidden` 裁切——不需要测量页脚高度。会话
  列表变长时会自然盖住它。
- 皮肤不修改 `document.title`，避免与宿主自身的会话标题更新互相覆盖。

## 素材来源与许可

代码采用 **MIT**。全部美术资源为《无职转生》同人创作，**禁止商业性使用**；
署名链见 [NOTICE](NOTICE)，美术许可见 [LICENSE-ARTWORK](LICENSE-ARTWORK)。
