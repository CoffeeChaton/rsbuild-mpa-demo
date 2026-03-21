/**
 * 規範化路徑邏輯
 */
export function getCanonicalRedirect(urlStr: string): string | null {
	try {
		// 1. 預洗領先斜線：避免 // 或 /// 被解析為協議相對路徑或 Host
		// 我們只在非絕對網址（無 http）的情況下才做此處理
		const cleanInput = (!/^https?:\/\//i.test(urlStr) && urlStr.startsWith("//"))
			? urlStr.replace(/^\/+/, "/")
			: urlStr;

		// 使用標準保留域名進行解析
		const base = "http://example.com";
		const url = new URL(cleanInput, base);

		const originalPath = url.pathname;
		const originalSearch = url.search;
		const originalHash = url.hash;
		const originalFull = originalPath + originalSearch + originalHash;

		// 1. 合併重複斜線 (例如 //page -> /page)
		let path = originalPath.replace(/\/+/g, "/");

		// 2. 核心修正：處理 index.html
		// 必須處理 /index.html (根) 以及 /page/index.html (子頁)
		if (path === "/index.html") {
			path = "/";
		} else if (path.endsWith("/index.html")) {
			path = path.replace(/\/index\.html$/, "/");
		}

		// 3. 補全尾隨斜線
		const segments = path.split("/");
		const lastSegment = segments[segments.length - 1];

		// 條件：不是根目錄、不是以斜線結尾、最後一段不含點（非檔案）
		if (path !== "/" && !path.endsWith("/") && !lastSegment.includes(".")) {
			path += "/";
		}

		const finalFull = path + originalSearch + originalHash;

		// 比對原始完整路徑與處理後的路徑
		return originalFull !== finalFull ? finalFull : null;
	} catch (error) {
		console.warn("unknon url error", { urlStr, error });
		return null;
	}
}
