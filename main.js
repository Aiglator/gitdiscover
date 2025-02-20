const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { findGitRepos, getRemoteUrl, getLastCommitDate, baseDir } = require("./git.js"); // ✅ Utilisation des nouvelles fonctions

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "src", "preload.js"),
            nodeIntegration: false,  // ✅ Sécurité renforcée
            contextIsolation: true,  // ✅ Empêche l’accès direct aux objets Node.js
        },
    });

    // ✅ Chargement sécurisé du fichier index.html
    const indexPath = path.join(__dirname, "src", "index.html");
    console.log("Chargement de :", indexPath);

    mainWindow.loadFile(indexPath).catch(err => {
        console.error("Erreur de chargement de index.html :", err);
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});

// ✅ Gérer les commandes Git envoyées par `renderer.js`
ipcMain.handle("run-git-command", async (_, command) => {
    if (command === "/all") {
        console.log("📌 Commande `/all` reçue !");
        const repos = findGitRepos(baseDir);
        return repos.map(repo => ({
            path: repo,
            remote: getRemoteUrl(repo),
        }));
    }

    if (command === "/date") {
        console.log("📌 Commande `/date` reçue !");
        const repos = findGitRepos(baseDir);
        return repos.map(repo => ({
            path: repo,
            remote: getRemoteUrl(repo),
            lastCommit: getLastCommitDate(repo),
        }));
    }

    return `Commande inconnue : ${command}`;
});

// ✅ Fermeture correcte de l'application
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
