// scripts/ssg.ts (需安裝 tsx 執行)
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App as IndexApp } from '../src/pages/index/App';
import { readFileSync, writeFileSync } from 'node:fs';

// 讀取編譯後的 HTML
const template = readFileSync('./dist/index.html', 'utf-8');
// 渲染 React 組件為字串
const appHtml = renderToString(React.createElement(IndexApp));
// 注入回 HTML
const finalHtml = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

writeFileSync('./dist/index.html', finalHtml);
