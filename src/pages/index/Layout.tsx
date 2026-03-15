import { useLocation } from "react-router-dom";
import { type IPageInfo, PAGE_MAP, type TPageKey } from "../../common/config/pages";
import { type ReactNode, useEffect } from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

const MetaUpdater = () => {
	// 1. 強制排除 any，符合 IPageInfo 嚴格型別
	const location = useLocation();

	useEffect(() => {
		// 2. 處理子目錄 Prefix (例如 /rsbuild-mpa-demo/)
		const prefix = "/";
		// 移除 Prefix 後取得第一層路徑
		const normalizedPath = location.pathname.replace(prefix, "").split("/")[0] || "index";

		// 3. 使用 Object.hasOwn 進行精簡的安全檢查
		// 確保路徑 Key 存在於 PAGE_MAP 自有屬性中，且不是 __proto__ 等原型屬性
		const isValidKey = Object.hasOwn(PAGE_MAP, normalizedPath);

		// 4. 取得正確的配置，若無效則回退至 index
		const activeKey = isValidKey ? (normalizedPath as TPageKey) : "index";
		const config: IPageInfo = PAGE_MAP[activeKey];

		// 5. 更新 DOM 資訊
		document.title = config.title;

		const metaDesc = document.querySelector('meta[name="description"]');
		if (metaDesc instanceof HTMLMetaElement) {
			metaDesc.content = config.description;
		}

		const ogTitle = document.querySelector('meta[property="og:title"]');
		if (ogTitle instanceof HTMLMetaElement) {
			ogTitle.content = config.title;
		}
	}, [location]);

	return null;
};

export const Layout = ({ children }: { children: ReactNode }) => (
	<Theme>
		<MetaUpdater />
		{children}
	</Theme>
);
