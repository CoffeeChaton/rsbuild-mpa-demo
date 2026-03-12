import "../styles/global.css";
import React from "react";
import ReactDOM from "react-dom/client";

export const bootstrap = (App: React.ComponentType): void => {
  const container: unknown = document.getElementById("root");

  if (!(container instanceof HTMLElement)) {
    console.error("[Bootstrap] Root element not found");
    return;
  }

  // RR7 需要在嚴格模式下執行以獲得最佳 CSR 體驗
  const content = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  if (container.hasChildNodes()) {
    ReactDOM.hydrateRoot(container, content);
  } else {
    ReactDOM.createRoot(container).render(content);
  }
};
