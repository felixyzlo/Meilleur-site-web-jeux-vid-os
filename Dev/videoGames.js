const API_KEY = "68b5709703904449a65e2d300624da63";
const container = document.getElementById("games");

async function loadGames() {
    const url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=9`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        data.results.forEach(game => {
            const div = document.createElement("div");
            div.className = "game";
            div.innerHTML = `
                <h3>${game.name}</h3>
                <img src="${game.background_image}" alt="${game.name}">
                <p>⭐ Note : ${game.rating}</p>
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error("Erreur :", error);
        container.innerHTML = "<p>Impossible de charger les jeux.</p>";
    }
}

loadGames();
