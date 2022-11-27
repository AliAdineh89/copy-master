const { contextBridge, ipcRenderer } = require("electron")

/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})



contextBridge.exposeInMainWorld("electronAPI", {
  getDirectoryPath: (payload) => ipcRenderer.send("get-directory-path", payload),
  setDirectoryPath: (callback) => ipcRenderer.on("set-directory-path", callback),

  startDeepCopy: (payload) => ipcRenderer.send("start-deep-copy", payload),
  endDeepCopy: (callback) => ipcRenderer.on("end-deep-copy", callback),
  hideProgress: (callback) => ipcRenderer.on("hide-progress", callback)
})