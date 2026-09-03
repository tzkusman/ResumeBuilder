/**
 * Preload bridge — exposes a minimal, typed API to the renderer
 * with contextIsolation enabled (no Node access in the page).
 */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("resumebuild", {
  platform: process.platform,
  isDesktop: true,
  saveFile: (defaultName, content) => ipcRenderer.invoke("rb:save-file", { defaultName, content }),
});
