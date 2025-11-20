const API_KEY = "68b5709703904449a65e2d300624da63";
const gameContainer = document.getElementById("game");

// ID du jeu RAWG (exemple : The Witcher 3)
const gameId = 3498;

async function loadGame() {
    try {
        const response = await fetch(
            `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`
        );

        const game = await response.json();
        console.log(game); // voir toutes les données dans la console

        gameContainer.innerHTML = `
            <h2>${game.name}</h2>
            <img src="${game.background_image}" width="400">
            <p><strong>Date de sortie :</strong> ${game.released}</p>
            <p><strong>Note :</strong> ⭐ ${game.rating}</p>
            <p><strong>Description :</strong> ${game.description_raw}</p>
        `;
    } catch (error) {
        console.error("Erreur :", error);
        gameContainer.textContent = "Impossible de charger le jeu.";
    }
}

loadGame();