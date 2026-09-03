/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * ResumeBuild — Electron shell.
 *
 * The desktop app is a native window around the production web app
 * (https://resume-builder-pd3c.vercel.app/). That means:
 *   • login / signup / subscriptions / exports work exactly like the website
 *   • deploying a new version on Vercel instantly updates every installed app
 *   • the installer stays tiny and never goes stale
 * An internet connection is required; offline users get a branded retry screen.
 */
const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("path");

const PROD_URL = "https://resume-builder-pd3c.vercel.app/";
const ICON = path.join(__dirname, "..", "icon.png");

// One window per machine — a second launch focuses the existing window.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.setName("ResumeBuild");
  let mainWindow = null;

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1360,
      height: 860,
      minWidth: 1024,
      minHeight: 700,
      title: "ResumeBuild — ATS-Proof Resume Builder",
      icon: ICON,
      backgroundColor: "#131f1a",
      autoHideMenuBar: true,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    mainWindow.once("ready-to-show", () => mainWindow.show());

    // Tag desktop traffic so GA4 can separate app users from web users.
    try {
      mainWindow.webContents.setUserAgent(mainWindow.webContents.userAgent + " ResumeBuildDesktop/1.1");
    } catch { /* cosmetic only */ }

    loadApp();

    // Keep in-app SPA navigation inside the window; send real external
    // links (LinkedIn, payment providers, docs) to the system browser.
    mainWindow.webContents.on("will-navigate", (event, url) => {
      if (!url.startsWith(PROD_URL)) {
        event.preventDefault();
        if (url.startsWith("http")) shell.openExternal(url);
      }
    });
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith("http")) shell.openExternal(url);
      return { action: "deny" };
    });

    // Network failure → branded offline screen (error code -3 = navigation
    // aborted by a new load, which is normal and must be ignored).
    mainWindow.webContents.on("did-fail-load", (_e, code) => {
      if (code !== -3) showOffline();
    });
  }

  function loadApp() {
    mainWindow
      .loadFile(path.join(__dirname, "splash.html"))
      .then(() => new Promise((r) => setTimeout(r, 700))) // let the splash breathe
      .then(() => mainWindow.loadURL(PROD_URL))
      .catch(() => showOffline());
  }

  function showOffline() {
    mainWindow.loadFile(path.join(__dirname, "offline.html")).catch(() => {});
  }

  // Retry from the offline screen's button, or automatically on reconnect.
  ipcMain.on("rb:reload", () => {
    if (mainWindow) loadApp();
  });

  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
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
}
