import { defineConfig, RsbuildPlugin } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { existsSync, readdirSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_MAP } from './src/common/config/pages';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 1. 動態讀取 package.json 中的專案名稱
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const repoName = pkg.name;

const isProd = process.env.NODE_ENV === 'production';

// 2. 統一路徑前綴邏輯：生產環境為 /repo-name/，開發環境為 /
const assetPrefix = isProd ? `/${repoName}/` : '/';

const getEntries = () => {
  const pagesDir = resolve(__dirname, 'src/pages');
  const folders = readdirSync(pagesDir);
  const entries: Record<string, string> = {};

  folders.forEach(name => {
    const key = name === 'index' ? '' : name;
    // 全部 Entry 共享 index/main.tsx 作為 CSR 超級入口
    entries[key] = resolve(__dirname, 'src/pages/index/main.tsx');
  });
  return entries;
};

const pluginFixPath = (): RsbuildPlugin => ({
  name: 'plugin-fix-path',
  setup(api) {
    api.onAfterBuild(async () => {
      const distDir = resolve(__dirname, 'dist');
      // 將 404/index.html 移至根目錄 404.html 以符合 GitHub Pages 規範
      if (existsSync(join(distDir, '404/index.html'))) {
        renameSync(join(distDir, '404/index.html'), join(distDir, '404.html'));
        rmSync(join(distDir, '404'), { recursive: true });
      }
    });
  },
});

export default defineConfig({
  plugins: [pluginReact(), pluginFixPath()],
  source: {
    entry: getEntries(),
    define: {
      // 修正：動態注入前端，不再寫死字串
      'process.env.ASSET_PREFIX': JSON.stringify(assetPrefix),
    }
  },
  output: {
    assetPrefix: assetPrefix,
    distPath: { root: 'dist', js: 'static/js', css: 'static/css' },
    // 強制檔名範本，確保 [name] 不為空
    filename: {
      // 這是最穩定的寫法：確保即使 entry 是空字串，檔名也會叫 index
      js: (pathData) => {
        const name = pathData.chunk?.name || 'index';
        return `static/js/${name}.[contenthash:8].js`;
      },
      css: (pathData) => {
        const name = pathData.chunk?.name || 'index';
        return `static/css/${name}.[contenthash:8].css`;
      },
    },
    cleanDistPath: true,
  },
  html: {
    template: './public/index.html',
    outputStructure: 'nested',
    templateParameters: ({ entryName }) => {
      const configKey = entryName === '' ? 'index' : entryName;
      const config = PAGE_MAP[configKey as keyof typeof PAGE_MAP] || PAGE_MAP.index;
      return {
        title: config.title,
        description: config.description,
        // 修正：同步使用動態產出的前綴
        base: assetPrefix,
      };
    },
  },
  server: {
    // 修正：讓本地 preview 功能正確模擬 GitHub Pages 子目錄環境
    base: assetPrefix,
    historyApiFallback: {
      // 確保單頁路由在子目錄環境下能正確回退到入口 HTML
      index: `${assetPrefix}index.html`,
    },
  }
});
