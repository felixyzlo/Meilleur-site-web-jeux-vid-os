// Ta clé API RAWG
const API_KEY = "68b5709703904449a65e2d300624da63";

// URL pour récupérer les 5 premiers jeux
const url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=5`;

// Fonction pour récupérer les données
async function getGames() {
    try {
        const response = await fetch(url); // Appel de l'API
        const data = await response.json(); // Conversion en JSON
        console.log(data); // Affiche toutes les données dans la console

        // Exemple simple : afficher les noms des jeux sur la page
        const container = document.getElementById("games");
        container.innerHTML = data.results.map(game => `<p>${game.name}</p>`).join("");
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Appel de la fonction
getGames();


    
