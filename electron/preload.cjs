/**
 * Preload bridge — minimal typed API, contextIsolation on.
 */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("resumebuild", {
  isDesktop: true,
  platform: process.platform,
  reload: () => ipcRenderer.send("rb:reload"),
});
