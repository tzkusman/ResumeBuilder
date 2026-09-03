/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * ResumeBuild — Electron wrapper (desktop app for Windows / macOS / Linux).
 *
 * The desktop build loads the same production bundle that Vercel serves:
 *   1. npm run build            → produces ./dist
 *   2. npx electron .           → launches this file against ./dist
 *   3. npm run dist (see ELECTRON.md) → electron-builder installers
 *
 * Installers are published to GitHub Releases by .github/workflows/release.yml
 * whenever you push a tag: git tag v1.2.0 && git push origin v1.2.0
 */
const { app, BrowserWindow, shell, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const DIST = path.join(__dirname, "..", "dist");
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: "ResumeBuild — ATS-Proof Resume Builder",
    backgroundColor: "#f2f3ec",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(DIST, "index.html"));

  // Open external links (payment, docs) in the system browser, not the app.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) shell.openExternal(url);
    return { action: "deny" };
  });
}

// Save-as dialog used by the desktop "Export PDF/DOCX" affordances.
ipcMain.handle("rb:save-file", async (_e, { defaultName, content }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName,
    filters: [
      { name: "Documents", extensions: ["doc", "txt", "html"] },
      { name: "All files", extensions: ["*"] },
    ],
  });
  if (canceled || !filePath) return null;
  fs.writeFileSync(filePath, content, "utf8");
  return filePath;
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
