document.getElementById("searchForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("searchInput").value;

    // 📌 Envoie la commande au backend et récupère la réponse
    const result = await window.electronAPI.runGitCommand(query);

    // 📌 Affichage des résultats
    const resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = ""; // ✅ Nettoie l'affichage précédent

    if (Array.isArray(result)) {
        result.forEach(repo => {
            const listItem = document.createElement("li");
            listItem.classList.add("text-green-400");
            listItem.innerHTML = `<strong>📂 ${repo.path}</strong><br>🌍 ${repo.remote || "❌ Aucun remote"}<br>🕒 ${repo.lastCommit || "❌ Aucune date"}`;
            resultsList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement("li");
        listItem.textContent = result;
        listItem.classList.add("text-red-400");
        resultsList.appendChild(listItem);
    }
});
