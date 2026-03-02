import { readFileSync, renameSync, mkdirSync, existsSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const repoName = pkg.name;
const DIST_DIR = resolve(process.cwd(), 'dist');
const SUB_DIR = join(DIST_DIR, repoName);
const TEMP_HOLD = resolve(process.cwd(), '.dist_temp_hold');

const prepareLiveServerDir = () => {
  console.log(`🧹 In-place restructuring for /${repoName}...`);

  try {
    // 防呆：如果已經是重組過的結構（dist 裡面已經有 repoName 資料夾），先清理它
    if (existsSync(SUB_DIR)) {
      console.log('Detected existing subdirectory, cleaning up...');
      // 注意：這裡不能直接刪除 dist，要刪除裡面的內容
    }

    // 1. 建立一個臨時目錄存放所有目前的 dist 內容
    if (existsSync(TEMP_HOLD)) rmSync(TEMP_HOLD, { recursive: true, force: true });
    mkdirSync(TEMP_HOLD);

    // 2. 搬移 dist 內的所有檔案到 TEMP_HOLD
    const items = readdirSync(DIST_DIR);
    items.forEach(item => {
      // 跳過隱藏檔案或正在使用的鎖定檔
      try {
        renameSync(join(DIST_DIR, item), join(TEMP_HOLD, item));
      } catch (e) {
        console.warn(`⚠️ Could not move ${item}, it might be in use.`);
      }
    });

    // 3. 在 dist 內建立子目錄
    if (!existsSync(SUB_DIR)) mkdirSync(SUB_DIR, { recursive: true });

    // 4. 把 TEMP_HOLD 的內容搬回 dist/${repoName}
    const movedItems = readdirSync(TEMP_HOLD);
    movedItems.forEach(item => {
      renameSync(join(TEMP_HOLD, item), join(SUB_DIR, item));
    });

    // 5. 清理 TEMP_HOLD
    rmSync(TEMP_HOLD, { recursive: true, force: true });

    // 6. 產生跳轉 HTML 與 serve.json
    const redirectHtml = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/${repoName}/"></head></html>`;
    writeFileSync(join(DIST_DIR, 'index.html'), redirectHtml);

    const serveConfig = {
      rewrites: [
        { source: `/${repoName}/**`, destination: `/${repoName}/index.html` }
      ]
    };
    writeFileSync(join(DIST_DIR, 'serve.json'), JSON.stringify(serveConfig, null, 2));

    console.log(`✅ Success! dist/${repoName} is ready.`);
  } catch (e: unknown) {
    console.error('❌ Restructure failed. Tip: Make sure no terminal or explorer is inside the "dist" folder.');
    console.error(e);
  }
};

prepareLiveServerDir();
