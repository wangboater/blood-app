建立一個計劃 (Plan) ，新增dark/light 兩種佈景主題，首頁上方提供切換佈景主題的開關，並根據使用者來儲存選用的佈景主題。
計劃 (Plan)使用繁體中文撰寫。
逐一詢問我所有可能的問題# Blood-App 佈景主題系統建置計劃

**項目名稱：** Blood-App 佈景主題管理功能  
**建置日期：** 2026-08-17  
**優先級：** 高  
**狀態：** 規劃階段

---

## 📋 執行摘要

本計劃旨在為 Blood-App React 應用程式實現完整的佈景主題系統，支持深色模式、淺色模式和跟隨系統設置三種主題選項。用戶可以通過首頁上方的切換開關自訂主題，並能夠自定義主題顏色。所有用戶偏好設置將存儲在瀏覽器的 localStorage 中。

---

## 🎯 功能需求

### 1. 核心功能

#### 1.1 三種預設主題
- **淺色模式（Light Theme）**
  - 背景色：淺白 (#F5F5F5)
  - 文字色：深灰 (#1A1A1A)
  - 組件主色：藍色 (#2563EB)
  - 次要色：灰色 (#9CA3AF)
  - 互動色：綠色 (#10B981)

- **深色模式（Dark Theme）**
  - 背景色：深灰 (#1F2937)
  - 文字色：淺白 (#F3F4F6)
  - 組件主色：淺藍 (#60A5FA)
  - 次要色：淺灰 (#D1D5DB)
  - 互動色：淡綠 (#34D399)

- **系統模式（System Theme）**
  - 自動偵測作業系統設置
  - 優先使用系統 `prefers-color-scheme` 媒體查詢
  - 根據系統設置在 Light 與 Dark 之間切換

#### 1.2 主題切換功能
- **切換位置：** 首頁上方導覽列（正上方）
- **UI 元件：** 圖標按鈕（日月圖標切換）或開關元件
- **轉換效果：** 平滑的淡入淡出動畫（200-300ms）
- **視覺反饋：** 按鈕按下時有清晰的狀態變化

#### 1.3 顏色自定義功能
- **自定義方式：** 顏色選擇器工具
- **可自訂元素：**
  - 背景色（Background Color）
  - 文字色（Text Color）
  - 組件主色（Primary Component Color）
  - 次要色（Secondary Color）
  - 互動色（Interaction Color）
- **自定義範圍：** 用戶可完全自訂上述五種顏色
- **預設配色方案：** 提供 2-3 個預設配色方案供快速選擇
  - 方案 A: Ocean (藍色系)
  - 方案 B: Forest (綠色系)
  - 方案 C: Sunset (橘色系)

### 2. 存儲需求

#### 2.1 本地存儲（localStorage）
```json
{
  "theme": "light|dark|system",
  "customColors": {
    "background": "#RRGGBB",
    "text": "#RRGGBB",
    "primary": "#RRGGBB",
    "secondary": "#RRGGBB",
    "interactive": "#RRGGBB"
  },
  "timestamp": "2026-08-17T10:00:00Z"
}
```

#### 2.2 存儲位置
- **primary:** 瀏覽器 localStorage
- **key:** `blood-app-theme-settings`
- **讀取：** 應用程式初始化時讀取
- **更新：** 用戶變更設置時即時更新
- **過期策略：** 無過期時間，長期保留

---

## 🏗️ 技術架構

### 1. 技術棧

| 組件 | 技術 | 版本 |
|------|------|------|
| 前端框架 | React | Latest (CRA) |
| 專案設定 | Create React App | Latest |
| 樣式解決方案 | CSS Modules | -  |
| 狀態管理 | React Context API | - |
| 後端框架 | ASP.NET Core | Latest |
| 存儲方式 | localStorage + API | - |

### 2. 項目結構

```
blood-app/
├── src/
│   ├── components/
│   │   ├── ThemeToggle/
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── ThemeToggle.module.css
│   │   │   └── useThemeToggle.js
│   │   └── ThemeCustomizer/
│   │       ├── ThemeCustomizer.jsx
│   │       ├── ThemeCustomizer.module.css
│   │       ├── ColorPicker.jsx
│   │       └── PresetThemes.jsx
│   ├── context/
│   │   ├── ThemeContext.jsx
│   │   └── ThemeProvider.jsx
│   ├── hooks/
│   │   ├── useTheme.js
│   │   └── useSystemPreference.js
│   ├── utils/
│   │   ├── themeManager.js
│   │   ├── colorValidator.js
│   │   └── presetThemes.js
│   ├── styles/
│   │   ├── themes.css (CSS 變數定義)
│   │   └── globals.module.css
│   ├── App.jsx
│   └── index.js
├── public/
│   └── index.html
└── package.json
```

### 3. 核心模組

#### 3.1 ThemeContext (狀態管理)
**職責：**
- 管理當前主題狀態
- 提供主題變更函數
- 發佈訂閱主題變化

**導出內容：**
```javascript
{
  theme: 'light' | 'dark' | 'system',
  customColors: Object,
  setTheme: Function,
  setCustomColors: Function,
  getCurrentTheme: Function
}
```

#### 3.2 ThemeProvider (提供者)
**職責：**
- 在應用程式根層級提供主題上下文
- 初始化時讀取 localStorage
- 監聽系統主題變化
- 套用主題到 DOM

**初始化流程：**
1. 讀取 localStorage 中的主題設置
2. 如果設置為 "system"，監聽系統 `prefers-color-scheme` 媒體查詢
3. 向 DOM 根元素加入主題 class
4. 套用 CSS 變數

#### 3.3 useTheme 鉤子
**職責：**
- 提供簡化的主題操作介面
- 在組件中方便地訪問和修改主題

**使用方式：**
```javascript
const { theme, setTheme, customColors, setCustomColors } = useTheme();
```

#### 3.4 useSystemPreference 鉤子
**職責：**
- 監聽系統主題偏好設置變化
- 在系統模式下自動同步

**返回值：**
```javascript
{
  systemTheme: 'light' | 'dark',
  isSystemPreferenceAvailable: boolean
}
```

#### 3.5 themeManager 工具函數
**職責：**
- 主題資料的序列化和反序列化
- localStorage 的讀寫操作
- 主題應用到 DOM

**主要函數：**
- `saveTheme(theme, colors)` - 保存主題設置
- `loadTheme()` - 讀取主題設置
- `applyTheme(theme, colors)` - 應用主題到 DOM
- `removeTheme()` - 清除主題設置

#### 3.6 ThemeToggle 元件
**職責：**
- 在首頁上方顯示主題切換按鈕
- 提供直觀的切換 UI

**功能：**
- 顯示當前主題圖標（太陽/月亮/電腦）
- 點擊切換主題
- 支持多主題循環切換 (light → dark → system → light)
- 200-300ms 平滑轉換動畫

**位置：** 首頁導覽列頂部（正上方）

#### 3.7 ThemeCustomizer 元件
**職責：**
- 提供主題自定義介面
- 顯示顏色選擇器

**子組件：**
- **ColorPicker：** 顏色選擇器控制項
  - 支持十六進制輸入和拾取
  - 實時預覽變更
  - 驗證顏色格式
  
- **PresetThemes：** 預設配色方案
  - Ocean 配色
  - Forest 配色
  - Sunset 配色
  - 一鍵應用

### 4. CSS 變數設計

#### 4.1 全局主題變數

```css
:root[data-theme="light"] {
  --color-bg: #F5F5F5;
  --color-text: #1A1A1A;
  --color-primary: #2563EB;
  --color-secondary: #9CA3AF;
  --color-interactive: #10B981;
  --transition-duration: 200ms;
}

:root[data-theme="dark"] {
  --color-bg: #1F2937;
  --color-text: #F3F4F6;
  --color-primary: #60A5FA;
  --color-secondary: #D1D5DB;
  --color-interactive: #34D399;
  --transition-duration: 200ms;
}

:root[data-theme="system"] {
  /* 根據 prefers-color-scheme 媒體查詢動態設置 */
}
```

#### 4.2 過渡效果

```css
body {
  transition: background-color var(--transition-duration) ease-in-out,
              color var(--transition-duration) ease-in-out;
}
```

---

## 📅 實施計劃

### 第 1 階段：基礎設置（第 1-2 天）
- [ ] 初始化 Create React App 專案結構
- [ ] 創建 ThemeContext 和 ThemeProvider
- [ ] 實現 localStorage 讀寫邏輯
- [ ] 創建 useTheme 和 useSystemPreference 自定義鉤子
- [ ] 編寫 themeManager 工具函數
- [ ] 定義 CSS 變數和全局樣式

**交付物：**
- ThemeProvider 可正常初始化
- localStorage 讀寫功能正常
- CSS 變數系統完整

### 第 2 階段：主題切換 UI（第 3-4 天）
- [ ] 開發 ThemeToggle 元件
- [ ] 實現按鈕切換邏輯
- [ ] 添加 200-300ms 轉換動畫
- [ ] 設計按鈕 UI（日月圖標）
- [ ] 進行視覺測試

**交付物：**
- ThemeToggle 元件功能完整
- 動畫效果流暢自然
- 按鈕置於首頁上方導覽列

### 第 3 階段：顏色自定義（第 5-6 天）
- [ ] 開發 ColorPicker 元件
- [ ] 創建 PresetThemes 配色方案選擇
- [ ] 實現顏色驗證邏輯
- [ ] 實現 ThemeCustomizer 主容器
- [ ] 添加顏色預覽功能

**交付物：**
- 顏色選擇器功能完整
- 預設配色方案可用
- 實時顏色預覽工作正常

### 第 4 階段：系統主題集成（第 7 天）
- [ ] 實現 System 主題模式
- [ ] 監聽 prefers-color-scheme 媒體查詢
- [ ] 測試系統主題同步
- [ ] 測試不同作業系統環境

**交付物：**
- System 主題模式可正常工作
- 系統主題變化自動同步
- 跨浏覽器兼容性驗證

### 第 5 階段：後端 API 開發（第 8-9 天）
- [ ] 設計 API 端點結構
- [ ] 在 ASP.NET Core 中創建 ThemeController
- [ ] 實現主題設置端點：
  - GET /api/themes/current - 獲取當前主題設置
  - POST /api/themes/update - 更新主題設置
  - GET /api/themes/presets - 獲取預設配色方案
- [ ] 數據驗證和錯誤處理
- [ ] API 文檔編寫

**交付物：**
- API 端點完整可用
- 請求響應格式規範
- 錯誤處理完善

### 第 6 階段：集成和測試（第 10-11 天）
- [ ] 集成前後端代碼
- [ ] 功能整合測試
- [ ] 性能測試
- [ ] 跨瀏覽器相容性測試
- [ ] 用戶體驗測試

**交付物：**
- 全功能測試通過
- 文檔完成
- 性能達標

### 第 7 階段：文檔和優化（第 12 天）
- [ ] 編寫完整的技術文檔
- [ ] 編寫用戶使用指南
- [ ] 代碼註釋和優化
- [ ] 最後的微調和 bug 修復

**交付物：**
- 完整的技術文檔
- 用戶指南
- 優化後的代碼

---

## 🔄 API 設計規範

### 1. 端點定義

#### 1.1 獲取當前主題設置
```
GET /api/themes/current

Response (200 OK):
{
  "theme": "light",
  "customColors": {
    "background": "#F5F5F5",
    "text": "#1A1A1A",
    "primary": "#2563EB",
    "secondary": "#9CA3AF",
    "interactive": "#10B981"
  },
  "timestamp": "2026-08-17T10:00:00Z"
}
```

#### 1.2 更新主題設置
```
POST /api/themes/update

Request Body:
{
  "theme": "dark",
  "customColors": {
    "background": "#1F2937",
    "text": "#F3F4F6",
    "primary": "#60A5FA",
    "secondary": "#D1D5DB",
    "interactive": "#34D399"
  }
}

Response (200 OK):
{
  "success": true,
  "message": "主題設置已更新",
  "data": { /* 同上 */ }
}
```

#### 1.3 獲取預設配色方案
```
GET /api/themes/presets

Response (200 OK):
{
  "presets": [
    {
      "name": "Ocean",
      "description": "藍色系配色",
      "colors": {
        "background": "#E0F4FF",
        "text": "#001F3F",
        "primary": "#0074D9",
        "secondary": "#7FDBCA",
        "interactive": "#2ECC40"
      }
    },
    {
      "name": "Forest",
      "description": "綠色系配色",
      "colors": { /* ... */ }
    },
    {
      "name": "Sunset",
      "description": "橘色系配色",
      "colors": { /* ... */ }
    }
  ]
}
```

### 2. 錯誤處理

| 狀態碼 | 情況 | 響應 |
|--------|------|------|
| 400 | 無效的顏色格式 | `{ "error": "Invalid color format" }` |
| 400 | 無效的主題選項 | `{ "error": "Invalid theme option" }` |
| 500 | 服務器內部錯誤 | `{ "error": "Internal server error" }` |

---

## 🛠️ 開發工具和依賴

### 前端依賴
```json
{
  "dependencies": {
    "react": "^18.x.x",
    "react-dom": "^18.x.x"
  },
  "devDependencies": {
    "react-scripts": "^5.x.x"
  }
}
```

### 後端依賴（ASP.NET Core）
```xml
<PackageReference Include="Microsoft.AspNetCore.Mvc" Version="latest" />
<PackageReference Include="Newtonsoft.Json" Version="latest" />
```

---

## 🧪 測試計劃

### 1. 單元測試
- [ ] ThemeContext 狀態管理測試
- [ ] useTheme 鉤子測試
- [ ] themeManager 工具函數測試
- [ ] 顏色驗證邏輯測試

### 2. 集成測試
- [ ] 主題切換流程測試
- [ ] 前後端數據同步測試
- [ ] localStorage 持久化測試

### 3. UI/UX 測試
- [ ] ThemeToggle 按鈕交互測試
- [ ] 動畫流暢性測試
- [ ] ColorPicker 用戶體驗測試

### 4. 兼容性測試
- [ ] Chrome / Edge / Firefox 相容性
- [ ] Safari 相容性
- [ ] 不同操作系統的 prefers-color-scheme 測試

---

## ⚠️ 風險評估

| 風險 | 概率 | 影響 | 缓解措施 |
|------|------|------|---------|
| 系統主題 API 兼容性問題 | 中 | 中 | 提供 fallback 機制 |
| localStorage 容量限制 | 低 | 低 | 監控儲存大小 |
| 顏色選擇器跨瀏覽器問題 | 低 | 中 | 使用成熟的第三方元件 |
| 動畫性能問題 | 低 | 中 | 使用 CSS 動畫而非 JS |

---

## 📊 成功指標

- ✅ 所有三種主題模式正常運作
- ✅ 主題切換動畫流暢（200-300ms）
- ✅ 用戶設置成功保存至 localStorage
- ✅ 顏色選擇器界面直觀易用
- ✅ API 響應時間 < 200ms
- ✅ 跨瀏覽器兼容性達 95% 以上
- ✅ 代碼覆蓋率 > 80%
- ✅ 文檔完整清晰

---

## 📝 後續迭代

### Phase 2 (未來考慮)
- [ ] 支持更多預設主題
- [ ] 高級顏色主題編輯器
- [ ] 主題分享和導入功能
- [ ] 動態主題生成器
- [ ] 用戶主題社區庫

---

## 🔗 相關文檔

- API 完整規範文檔（待建立）
- 組件開發指南（待建立）
- 樣式指南（待建立）
- 部署和發佈指南（待建立）

---

**計劃撰寫者：** Copilot  
**最後更新：** 2026-08-17  
**下一步行動：** 審批計劃後開始第 1 階段開發
