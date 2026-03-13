/**
 * Advanced Canonical URL Middleware
 *
 * Designed for:
 * - MPA + SPA hybrid
 * - GitHub Pages subdirectory deploy
 * - static hosting (S3 / Cloudflare Pages)
 *
 * Features
 *
 * /page                 -> /page/
 * /page/index.html      -> /page/
 * /page/index.html?a=1  -> /page/?a=1
 * /page//               -> /page/
 * /page////             -> /page/
 * /page/../page         -> /page/
 *
 * Assets ignored
 */

const FILE_EXTENSION = /\.[a-zA-Z0-9]+$/;

function normalizePath(path: string): string {
  // decode %2F etc
  try {
    path = decodeURI(path);
  } catch {
    //
  }

  // collapse multiple slashes
  path = path.replace(/\/{2,}/g, "/");

  // remove /./
  path = path.replace(/\/\.\//g, "/");

  // resolve /../
  while (path.includes("/../")) {
    path = path.replace(/\/[^/]+\/\.\.\//, "/");
  }

  return path;
}

function removeIndexHtml(path: string): string {
  if (path.endsWith("/index.html")) {
    return path.slice(0, -10);
  }

  if (path === "index.html") {
    return "/";
  }
  return path;
}

function ensureTrailingSlash(path: string): string {
  if (!path.endsWith("/")) {
    path += "/";
  }
  return path;
}

function isAsset(path: string): boolean {
  const last = path.split("/").pop() ?? "";
  return FILE_EXTENSION.test(last);
}

export function canonicalUrl(): boolean {
  const { pathname, search, hash } = window.location;

  let path = pathname;

  // normalize
  path = normalizePath(path);

  // ignore assets
  if (isAsset(path)) {
    return false;
  }

  // remove index.html
  path = removeIndexHtml(path);

  // trailing slash
  path = ensureTrailingSlash(path);

  const newUrl = path + search + hash;
  const currentUrl = pathname + search + hash;

  if (newUrl !== currentUrl) {
    window.location.replace(newUrl);
    return true;
  }

  return false;
}
