console.log("📌 `git.js` est chargé comme module !"); // ✅ Vérification au chargement

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 📌 Détection automatique du dossier utilisateur
const baseDir = os.homedir(); 

// ✅ Liste des dossiers à ignorer pour éviter les erreurs d'accès
const ignoreDirs = ['AppData', 'Program Files', 'Windows', 'System32', 'Temp', 'node_modules'];

// Empêche l’exécution directe du fichier
if (require.main === module) {
    console.error("❌ Erreur : `git.js` NE DOIT PAS être exécuté directement !");
    process.exit(1);
}

/**
 * 🔍 Recherche récursive des dépôts Git dans un dossier
 * @param {string} startPath - Chemin du dossier de départ
 * @returns {string[]} - Liste des chemins des dépôts Git trouvés
 */
function findGitRepos(startPath) {
    console.log(`🔍 Recherche de dépôts Git dans : ${startPath}`);

    let repos = [];

    function search(dir) {
        try {
            let files = fs.readdirSync(dir);

            if (files.includes('.git')) {
                console.log(`✅ Dépôt trouvé : ${dir}`);
                repos.push(dir);
            }

            files.forEach(file => {
                let fullPath = path.join(dir, file);

                if (ignoreDirs.some(ignore => fullPath.includes(ignore))) {
                    console.log(`⚠️ Dossier ignoré : ${fullPath}`);
                    return;
                }

                if (fs.statSync(fullPath).isDirectory()) {
                    search(fullPath);
                }
            });
        } catch (error) {
            console.warn(`⚠️ Impossible d'accéder à : ${dir}`);
        }
    }

    search(startPath);
    return repos;
}

/**
 * 🌍 Récupère l'URL du remote d'un dépôt Git
 * @param {string} repoPath - Chemin du dépôt Git
 * @returns {string} - URL du remote ou message d'erreur
 */
function getRemoteUrl(repoPath) {
    try {
        return execSync(`git -C "${repoPath}" remote get-url origin`, { encoding: 'utf8' }).trim();
    } catch (error) {
        return "❌ Aucun remote détecté";
    }
}

/**
 * 🕒 Récupère la date du dernier commit d'un dépôt Git
 * @param {string} repoPath - Chemin du dépôt Git
 * @returns {string} - Date du dernier commit ou message d'erreur
 */
function getLastCommitDate(repoPath) {
    try {
        return execSync(`git -C "${repoPath}" log -1 --format=%cd`, { encoding: 'utf8' }).trim();
    } catch (error) {
        return "❌ Aucune date trouvée";
    }
}

// 📌 Exporte les fonctions pour les utiliser dans `main.js`
module.exports = { findGitRepos, getRemoteUrl, getLastCommitDate, baseDir };
