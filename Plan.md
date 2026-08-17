# Blood App 主題切換計劃

在現有純前端 `blood-app` 中加入 Light/Dark 兩套主題：首頁上方放置太陽／月亮圖示按鈕，使用者可手動切換；選擇以獨立的 `localStorage` key 保存在同一瀏覽器／裝置。首次使用預設 Light，沿用現有品牌色與版面，不加入首次載入防閃爍策略或主題切換動畫。

## 步驟

### Phase 1：HTML 入口與可及性

1. 在 `index.html` 的 `.topbar` 加入主題切換 `button`，使用太陽／月亮圖示。
2. 為按鈕設定唯一 id、tooltip、`aria-label` 與 `aria-pressed` 等狀態，確保滑鼠與鍵盤都能操作。
3. 保留既有品牌與日期時間區塊，確認桌面和窄螢幕不會互相擠壓。

### Phase 2：CSS 主題樣式

4. 在 `styles.css` 保留目前 `:root` 的 Light 色彩 tokens，新增 `[data-theme="dark"]` 覆寫層。
5. 覆蓋 Dark 模式所需的背景、面板、文字、次要文字、邊框、陰影、表單、placeholder、按鈕、紀錄項目、空狀態、成功／錯誤／停用與刪除狀態。
6. 新增主題按鈕的圖示、hover、focus-visible 與 active 樣式。
7. 不加入主題切換動畫，並檢查 `.topbar` 在 500px 以下寬度是否溢位或重疊。

### Phase 3：主題狀態與儲存

8. 在 `script.js` 新增獨立的主題儲存 key，例如 `pulsenote-theme`。
9. 新增讀取、驗證、套用與保存主題的函式：
   - 有效值限定為 `light` 或 `dark`
   - 沒有值或值無效時回退到 Light
   - 使用 `document.documentElement.dataset.theme` 套用主題
   - 同步按鈕的圖示、tooltip、ARIA 狀態
10. 初始化時先套用已保存的主題，再執行現有的時間更新與紀錄渲染。
11. 儲存失敗時仍完成當次主題切換，不讓 UI 操作中斷。
12. 同步更新 `meta[name="theme-color"]`，讓瀏覽器 UI 色彩與頁面主題一致。

## 相關檔案

- `index.html`：新增主題按鈕，並保留現有 `theme-color` meta 與腳本載入方式。
- `styles.css`：新增 Dark 色彩 tokens、主題控制項樣式，以及所有頁面表面的深色樣式。
- `script.js`：新增主題初始化、切換、ARIA 狀態同步和 `localStorage` 儲存邏輯。

## 驗證

1. 清除主題偏好後重新開啟頁面，確認預設為 Light。
2. 點擊圖示按鈕，確認背景、面板、表單、紀錄與狀態訊息全部切換。
3. 重新整理頁面，確認保存的主題仍然維持。
4. 在 DevTools Application 中確認：
   - `pulsenote-theme` 只保存 `light` 或 `dark`
   - `pulsenote-blood-pressure-records` 未被更動
5. 使用鍵盤 Tab 聚焦，再以 Enter 或 Space 操作按鈕。
6. 確認兩套主題下的 focus、hover、錯誤、成功與停用狀態都具備足夠對比。
7. 在桌面、約 790px 與 500px 以下寬度檢查頁面是否溢位。
8. 測試新增、刪除與清除血壓紀錄，確認既有功能不受影響。
9. 手動設定無效主題值或刪除 storage key，確認能回退到 Light。
10. 切換主題後確認 `theme-color` meta 的 `content` 已同步變更。

## 已確認的決策

- 首次使用預設 Light。
- 使用同一瀏覽器／裝置的 `localStorage` 保存，不做帳號或跨裝置同步。
- 使用太陽／月亮圖示按鈕，搭配 tooltip 和 ARIA。
- 深色主題延續既有品牌色與版面。
- 同步瀏覽器 `theme-color`。
- 不追蹤作業系統主題。
- 不處理首屏無閃爍。
- 不加入主題切換動畫。
- 以手動瀏覽器測試和靜態檢查為主，不新增測試框架。

## 範圍界線

- 包含三個既有檔案的最小修改、主題切換、偏好保存、ARIA、響應式檢查與 `theme-color` 同步。
- 不包含登入、跨裝置同步、作業系統主題自動偵測、血壓紀錄資料結構變更、表單流程重構或自動化測試框架導入。
