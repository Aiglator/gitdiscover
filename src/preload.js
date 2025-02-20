const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    runGitCommand: (command) => ipcRenderer.invoke("run-git-command", command),
});
