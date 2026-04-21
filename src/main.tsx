import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { AppThemeProvider } from "./common/context/AppThemeContext";
import { applyCanonicalTag } from "./common/router/canonical-seo";
import { getCanonicalRedirect } from "./common/router/getCanonicalRedirect";
// oxlint-disable-next-line import/no-unassigned-import
import "./styles/globals.css";

/**
 * 副作用執行器
 */
function canonicalUrl(): boolean {
	// 使用完整的 href 確保 getCanonicalRedirect 獲得最精確的上下文
	const redirectPath = getCanonicalRedirect(window.location.href);
	if (redirectPath) {
		window.location.replace(redirectPath);
		return true;
	}
	return false;
}

const bootstrap = (): void => {
	if (canonicalUrl()) return; // 自動 redirect 到 /game3/

	applyCanonicalTag(); // SEO <link rel="canonical">

	const container = document.getElementById("root");
	// oxlint-disable-next-line no-console
	if (!container) return console.error("[Bootstrap] Root element not found");

	const content = (
		<StrictMode>
			<AppThemeProvider>
				<App />
			</AppThemeProvider>
		</StrictMode>
	);

	const isHydration = container.innerHTML.trim().length > 0;

	if (isHydration) {
		ReactDOM.hydrateRoot(container, content);
	} else {
		ReactDOM.createRoot(container).render(content);
	}
};

bootstrap();
