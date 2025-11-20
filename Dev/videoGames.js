const API_KEY = "68b5709703904449a65e2d300624da63";
const output = document.getElementById("output");

async function getGames() {
    try {
        const response = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&page_size=5`
        );
        
        const data = await response.json();
        console.log(data); // pour vérifier dans la console

        // Affichage simple dans la page
        output.innerHTML = data.results
            .map(game => `<p>${game.name}</p>`)
            .join("");

    } catch (error) {
        console.error("Erreur API :", error);
        output.textContent = "Impossible de récupérer les données.";
    }
}

getGames();
