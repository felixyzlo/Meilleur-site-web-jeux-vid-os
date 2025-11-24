fetch('jeux.json')
  .then(response => response.json())
  .then(data => {
    // Affiche le premier jeu du JSON dans l'élément avec l'id 'jeu'
    const jeu = data.results[0].games[0];
    const container = document.getElementById('jeu');
    if (container && jeu) {
      container.innerHTML = `
        <div class="jeu-card">
          <h2>${jeu.name}</h2>
          <p>Slug : ${jeu.slug}</p>
          <p>Ajouté : ${jeu.added}</p>
        </div>
      `;
    }
  })
  .catch(error => console.error('Erreur de chargement du JSON:', error));
