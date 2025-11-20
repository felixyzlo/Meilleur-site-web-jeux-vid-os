const API_KEY = "68b5709703904449a65e2d300624da63";

fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=5`)
    .then(res => res.json())
    .then(data => {
        console.log(data); // voir les données RAWG
        document.body.innerHTML += data.results.map(game => `<p>${game.name}</p>`).join("");
    })
    .catch(err => console.error("Erreur :", err));
