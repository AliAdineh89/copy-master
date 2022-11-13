/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const sourceFileBrowserBtn = document.querySelector(".open-source-file-browser");
const destinationFileBrowserBtn = document.querySelector(".open-destination-file-browser");
let paths = {}

sourceFileBrowserBtn.addEventListener("click", () => {
    window.electronAPI.getDirectoryPath({
        selectSourcePath: true
    })
})

destinationFileBrowserBtn.addEventListener("click", () => {
    window.electronAPI.getDirectoryPath({
        selectDestinationPath: true
    })
})

window.electronAPI.setDirectoryPath((event, response) => {

    paths = {
        ...paths,
        ...response,
    };
})

document.querySelector(".start-deep-copy").addEventListener("click", () => {
    console.log("==>>", paths)
    if(paths.srcPath &&  paths.desPath)
    window.electronAPI.startDeepCopy(paths)
    
})

window.electronAPI.endDeepCopy((event, data) => {
    console.log("==>>", data)
})




