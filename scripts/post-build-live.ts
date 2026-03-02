import { readFileSync, renameSync, mkdirSync, existsSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const repoName = pkg.name;
const DIST_DIR = resolve(process.cwd(), 'dist');
const TEMP_HOLD = resolve(process.cwd(), '.dist_temp_hold'); // 隱藏的暫存區

const prepareLiveServerDir = () => {
  console.log(`🧹 In-place restructuring for /${repoName}...`);

  try {
    // 1. 先把原本 dist 的內容「暫時」移到外面（同磁區搬移，極快且不傷硬碟）
    if (existsSync(TEMP_HOLD)) rmSync(TEMP_HOLD, { recursive: true });
    renameSync(DIST_DIR, TEMP_HOLD);

    // 2. 重新建立乾淨的 dist
    mkdirSync(DIST_DIR);

    // 3. 把內容搬回 dist/${repoName}
    const targetDir = join(DIST_DIR, repoName);
    renameSync(TEMP_HOLD, targetDir);

    // 4. 在 dist 根目錄放一個超迷你的 index.html 跳轉 (不到 1KB)
    const redirectHtml = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/${repoName}/"></head></html>`;
    writeFileSync(join(DIST_DIR, 'index.html'), redirectHtml);

    // 5. 自動產生 serve.json 解決 SPA 刷新 404 問題
    const serveConfig = {
      rewrites: [
        { source: `/${repoName}/**`, destination: `/${repoName}/index.html` }
      ]
    };
    writeFileSync(join(DIST_DIR, 'serve.json'), JSON.stringify(serveConfig, null, 2));

    console.log(`✅ Ready! dist/ structure is now optimized for subdirectory testing.`);
  } catch (e: unknown) {
    console.error('❌ Restructure failed:', e);
  }
};

prepareLiveServerDir();
