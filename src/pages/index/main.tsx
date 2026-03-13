import { canonicalUrl } from "../../common/router/canonical-url";
import { App } from "./App";
import "../../styles/globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { applyCanonicalTag } from "../../common/router/canonical-seo";

const bootstrap = (App: React.ComponentType) => {
  // canonical redirect
  if (canonicalUrl()) return;

  // SEO canonical tag
  applyCanonicalTag();

  const container = document.getElementById("root");

  if (!container) {
    console.error("[Bootstrap] Root element not found");
    return;
  }

  const content = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  const isHydration = container.innerHTML.trim().length > 0;

  if (isHydration) {
    ReactDOM.hydrateRoot(container, content);
  } else {
    ReactDOM.createRoot(container).render(content);
  }
};

bootstrap(App);
