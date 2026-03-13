// src/pages/index/main.tsx
import { type ComponentType, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { canonicalUrl } from "../../common/router/canonical-url";
import { applyCanonicalTag } from "../../common/router/canonical-seo";
import "../../styles/globals.css";

const bootstrap = (App: ComponentType) => {
  if (canonicalUrl()) return; // 自動 redirect 到 /game3/

  applyCanonicalTag(); // SEO <link rel="canonical">

  const container = document.getElementById("root");
  if (!container) return console.error("[Bootstrap] Root element not found");

  const content = (
    <StrictMode>
      <App />
    </StrictMode>
  );

  const isHydration = container.innerHTML.trim().length > 0;

  if (isHydration) {
    ReactDOM.hydrateRoot(container, content);
  } else {
    ReactDOM.createRoot(container).render(content);
  }
};

bootstrap(App);
