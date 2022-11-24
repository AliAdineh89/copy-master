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
let startCopyBtn = document.querySelector('.start-deep-copy')
let loadingCircle = document.querySelector('.loader')

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
    
    startCopyBtn.setAttribute('disabled', true)
    loadingCircle.style.display = 'block'
    if(paths.srcPath &&  paths.desPath)
    window.electronAPI.startDeepCopy(paths)
    
})

window.electronAPI.endDeepCopy((event, data) => {
     console.log(data)
    startCopyBtn.removeAttribute('disabled')
    loadingCircle.style.display = 'none'

})








