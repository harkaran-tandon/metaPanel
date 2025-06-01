// src/registerServiceWorker.ts
import { registerSW } from 'virtual:pwa-register';

export const updateSW = registerSW({
  onNeedRefresh() {
    if (window.confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});
