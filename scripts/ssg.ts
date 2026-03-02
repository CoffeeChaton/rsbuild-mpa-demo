// scripts/ssg.ts
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { PAGE_MAP } from '../src/common/config/pages';

const DIST_DIR = resolve(process.cwd(), 'dist');

const runSSG = () => {
  console.log('🚀 Starting Mini-SSG Optimization...');

  // 先讀取主入口作為保底模板
  const indexTemplatePath = join(DIST_DIR, 'index.html');
  const indexContent = readFileSync(indexTemplatePath, 'utf-8');

  Object.entries(PAGE_MAP).forEach(([key, info]) => {
    let htmlPath = key === 'index' 
      ? indexTemplatePath 
      : join(DIST_DIR, key, 'index.html');

    // 特殊處理 404：GitHub Pages 需要根目錄下的 404.html
    if (key === '404') {
      htmlPath = join(DIST_DIR, '404.html');
    }

    try {
      // 如果檔案不存在（例如你沒在 rsbuild 設定該 entry），就用 index.html 複製一份
      if (!existsSync(htmlPath)) {
        console.log(`- Creating missing HTML for [${key}] using index template...`);
        if (key !== '404' && !key.includes('.')) {
          mkdirSync(join(DIST_DIR, key), { recursive: true });
        }
        writeFileSync(htmlPath, indexContent);
      }

      let content = readFileSync(htmlPath, 'utf-8');

      // 注入 SEO 資訊
      content = content.replace(/<title>.*?<\/title>/, `<title>${info.title}</title>`);
      content = content.replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="${info.description}" />`
      );

      writeFileSync(htmlPath, content);
      console.log(`✅ Optimized: ${htmlPath}`);
    } catch (e: unknown) {
      console.error(`❌ Failed to process [${key}]:`, e);
    }
  });

  console.log('✨ SSG Optimization Complete.');
};

runSSG();
