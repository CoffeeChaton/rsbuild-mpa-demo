import { defineConfig, RsbuildPlugin } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { existsSync, readdirSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_MAP } from './src/common/config/pages'; // 引入共用配置

const __dirname = dirname(fileURLToPath(import.meta.url));

// 讀取 package.json 以獲取 repo 名稱
const pkg: unknown = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
);

// 類型守衛：安全地獲取專案名稱
const getProjectName = (p: unknown): string => {
  if (typeof p === 'object' && p !== null && 'name' in p && typeof (p as { name: unknown }).name === 'string') {
    return (p as { name: string }).name;
  }
  return '';
};

const repoName = getProjectName(pkg);
const isProd = process.env.NODE_ENV === 'production';

// 判斷是否在 GitHub Actions 環境中執行
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

// 只有在 GitHub Actions 部署時才加上 repoName
// 本地執行 pnpm build 依然維持 '/'，方便 Live Server 測試
const assetPrefix = isProd && isGitHubActions ? `/${repoName}/` : '/';


const getEntries = () => {
  const pagesDir = resolve(__dirname, 'src/pages');
  const folders = readdirSync(pagesDir);
  const entries: Record<string, string> = {};

  folders.forEach(name => {
    const key = name === 'index' ? '' : name;
    // 重點：全部 Entry 共享同一個渲染邏輯 (CSR 核心)
    entries[key] = resolve(__dirname, 'src/pages/index/main.tsx');
  });
  return entries;
};

const pluginFixPath = (): RsbuildPlugin => ({
  name: 'plugin-fix-path',
  setup(api) {
    api.onAfterBuild(async () => {
      const distDir = resolve(__dirname, 'dist');
      // 將空字串 entry (產出在 dist/index.html) 與 404 進行標準化
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
      'process.env.ASSET_PREFIX': JSON.stringify(process.env.NODE_ENV === 'production' ? '/repo-name/' : '/'),
    }
  },
  output: {
    assetPrefix: assetPrefix,
    distPath: { root: 'dist', js: 'static/js', css: 'static/css' },
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
        base: process.env.NODE_ENV === 'production' ? '/repo-name/' : '/',
      };
    },
  },
server: {
    historyApiFallback: {
      index: '/index.html',
      rewrites: [
        // 確保開發環境刷新頁面時能找到對應的 HTML 入口
        ...Object.keys(getEntries()).map(key => ({
          from: new RegExp(`^\\/${key}`),
          to: `/${key}/index.html`
        }))
      ]
    }
  }
});
