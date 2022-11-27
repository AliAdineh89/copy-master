/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const sourceFileBrowserBtn = document.querySelector(".open-source-file-browser");
const destinationFileBrowserBtn = document.querySelector(".open-destination-file-browser");
const loadingWrapper = document.querySelector(".progress-bar");
const loadingBar = document.querySelector(".progress-bar-fill");

let startCopyBtn = document.querySelector('.start-deep-copy')
let paths = {
    srcPath: localStorage.getItem('srcPath') || '',
    desPath: localStorage.getItem('desPath') || ''
}

function initPathValue() {
    document.getElementById("source-folder").value = localStorage.getItem('srcPath') || ''
    document.getElementById("destination-folder").value = localStorage.getItem('desPath') || ''

}

initPathValue()

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
    if(response.srcPath)localStorage.setItem('srcPath', response.srcPath)
    if(response.desPath)localStorage.setItem('desPath', response.desPath)
    paths = {
        ...paths,
        ...response,
    
    };
    initPathValue()
    
})


startCopyBtn.addEventListener("click", () => {
    loadingBar.style.width = '0px'
    if(paths.srcPath &&  paths.desPath) {
        startCopyBtn.setAttribute('disabled', true)
        loadingWrapper.style.display = 'block'
        window.electronAPI.startDeepCopy(paths)
    }
    
})

window.electronAPI.endDeepCopy((event, data) => {
    startCopyBtn.removeAttribute('disabled')
    loadingBar.style.width = data.message
})

window.electronAPI.hideProgress((event, data) => {
    setTimeout(() => {
        loadingWrapper.style.display = 'none'
    }, 1500)
})


window.electronAPI.showError((event, response) => {
    console.log(response)
})








