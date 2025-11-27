const apiKey = '68b5709703904449a65e2d300624da63'

async function getGamesList() {
    const container = document.getElementById('games')
    container.innerHTML = ''
    try{
        const res = await fetch('https://api.rawg.io/api/games?key=' + apiKey)
        if(!res.ok) throw new Error('Erreur réseau')
        const data = await res.json()
        const results = data.results || []

        results.forEach(game => {
            const cover = game && game.background_image ? game.background_image : 'https://via.placeholder.com/640x360?text=No+Image'
            const title = (game && (game.name || game.slug)) ? (game.name || game.slug) : 'Titre inconnu'
            const released = (game && game.released) ? formatDateFR(game.released) : 'Date inconnue'
            const rating = (game && (typeof game.rating === 'number')) ? game.rating.toFixed(1) : 'NC'

            const card = document.createElement('article')
                        card.className = 'game-card'
                        card.innerHTML = `
                                <div class="game-left">
                                        <img class="game-cover" src="${cover}" alt="Couverture ${escapeHtml(title)}" />
                                        <div class="game-info">
                                            <h3 class="game-title">${escapeHtml(title)}</h3>
                                            <div style="display:flex;align-items:center;gap:8px;">
                                                <div class="game-meta">Sortie: ${escapeHtml(released)}</div>
                                                <div style="flex:1"></div>
                                                <div class="game-rating">${escapeHtml(rating)}</div>
                                            </div>
                                        </div>
                                </div>
                                <div class="game-right">
                                        <div class="reviews">
                                            <div class="reviews-list" data-gameid="${escapeHtml(getGameKey(game))}"></div>
                                            <button type="button" class="add-review">Ajouter un commentaire</button>
                                            <form class="review-form" style="display:none;" aria-hidden="true">
                                                <label>
                                                    <div style="font-weight:700;margin-bottom:6px;color:inherit">Votre avis</div>
                                                    <textarea name="text" rows="3" placeholder="Racontez ce que vous en pensez..." required style="width:100%;padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:inherit"></textarea>
                                                </label>
                                                <label style="display:block;margin-top:8px">Note: 
                                                            <select name="rating" style="margin-left:8px;padding:6px;border-radius:6px;background:transparent;color:inherit">
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                            </select>
                                                </label>
                                                <div style="display:flex;gap:8px;margin-top:8px">
                                                    <button type="submit" class="submit-review">Envoyer</button>
                                                    <button type="button" class="cancel-review">Annuler</button>
                                                </div>
                                            </form>
                                        </div>
                                </div>
                        `
            container.appendChild(card)

                        const gameKey = getGameKey(game)
                        const reviewsList = card.querySelector('.reviews-list')
                        const addBtn = card.querySelector('.add-review')
                        const form = card.querySelector('.review-form')
                        const submitBtn = card.querySelector('.submit-review')
                        const cancelBtn = card.querySelector('.cancel-review')

                        renderReviews(reviewsList, gameKey)

                        addBtn.addEventListener('click', () => {
                            form.style.display = form.style.display === 'none' ? 'block' : 'none'
                            form.setAttribute('aria-hidden', form.style.display === 'none' ? 'true' : 'false')
                        })

                        cancelBtn.addEventListener('click', () => {
                            form.style.display = 'none'
                            form.setAttribute('aria-hidden', 'true')
                            form.reset()
                        })

                        form.addEventListener('submit', (e) => {
                            e.preventDefault()
                            const text = (form.text.value || '').trim()
                            const r = parseInt(form.rating.value || '5', 10)
                            if (!text) return
                            const review = { text: text, rating: r, date: new Date().toISOString(), reviewerId: getLocalReviewerId() }
                            saveReview(gameKey, review)
                            renderReviews(reviewsList, gameKey)
                            form.reset()
                            form.style.display = 'none'
                            form.setAttribute('aria-hidden', 'true')
                        })

                        const editBtns = card.querySelectorAll('.edit-review')
                        if(editBtns && editBtns.length){
                            editBtns.forEach(btn => {
                                btn.addEventListener('click', () => {
                                    const txt = btn.dataset.text || ''
                                    const ratingVal = btn.dataset.rating || '5'
                                    form.text.value = txt
                                    form.rating.value = ratingVal
                                    form.style.display = 'block'
                                    form.setAttribute('aria-hidden', 'false')
                                })
                            })
                        }
        })

    }catch(e){
        container.innerHTML = '<p>Impossible de charger les jeux pour le moment.</p>'
        console.error(e)
    }
}

function escapeHtml(text){
    if(!text) return ''
    return String(text).replace(/[&<>"']/g, function(s){
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]
    })
}

document.addEventListener('DOMContentLoaded', () => {
    getGamesList()
})

function formatDateFR(dateStr){
    try{
        const d = new Date(dateStr)
        if (isNaN(d)) return dateStr
        return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d)
    }catch(e){
        return dateStr
    }
}

function getGameKey(game){
    if(!game) return 'unknown'
    return game.id ? String(game.id) : (game.slug ? String(game.slug) : (game.name ? String(game.name).replace(/\s+/g,'_') : 'unknown'))
}

function getLocalReviewerId(){
    try{
        let id = localStorage.getItem('localReviewerId')
        if(!id){
            id = 'u_' + Date.now() + '_' + Math.floor(Math.random()*100000)
            localStorage.setItem('localReviewerId', id)
        }
        return id
    }catch(e){ return 'local' }
}

function getReviews(gameKey){
    try{
        const raw = localStorage.getItem('reviews_' + gameKey)
        if(!raw) return []
        return JSON.parse(raw)
    }catch(e){ return [] }
}

function saveReview(gameKey, review){
    const current = getReviews(gameKey)
    const localId = getLocalReviewerId()
    if(review.reviewerId && current.length){
        const idx = current.findIndex(r=> r.reviewerId === review.reviewerId)
        if(idx !== -1){
            current[idx] = Object.assign({}, current[idx], review)
            try{ localStorage.setItem('reviews_' + gameKey, JSON.stringify(current)) }catch(e){ console.error(e) }
            return
        }
    }

    current.unshift(review)
    try{ localStorage.setItem('reviews_' + gameKey, JSON.stringify(current)) }catch(e){ console.error(e) }
}

function updateReviewAt(gameKey, index, review){
    const current = getReviews(gameKey)
    if(index < 0 || index >= current.length) return

    review.reviewerId = review.reviewerId || current[index].reviewerId
    current[index] = Object.assign({}, current[index], review)
    try{ localStorage.setItem('reviews_' + gameKey, JSON.stringify(current)) }catch(e){ console.error(e) }
}

function renderReviews(container, gameKey){
    if(!container) return
    const reviews = getReviews(gameKey)
    container.innerHTML = ''
    if(reviews.length === 0){
        container.innerHTML = '<div class="no-reviews">Aucun avis</div>'
        return
    }
    const list = document.createElement('div')
    list.className = 'reviews-list-inner'
    reviews.slice(0,5).forEach((r, idx) => {
        const item = document.createElement('div')
        item.className = 'review'
        const date = r.date ? formatDateFR(r.date) : ''
        item.innerHTML = `<div class="review-text">${escapeHtml(r.text)}</div><div class="review-meta">${escapeHtml(String(r.rating))} ★ — ${escapeHtml(date)}</div>`
        const editBtn = document.createElement('button')
        editBtn.type = 'button'
        editBtn.className = 'edit-review'
        editBtn.textContent = 'Modifier'
        editBtn.style.marginTop = '6px'
        editBtn.dataset.index = String(idx)
        editBtn.addEventListener('click', () => {
            const reviewsContainer = container
            const card = reviewsContainer.closest('.game-card')
            if(!card) return
            const form = card.querySelector('.review-form')
            if(!form) return
            form.style.display = 'block'
            form.setAttribute('aria-hidden','false')
            form.text.value = r.text || ''
            form.rating.value = String(r.rating || '5')
            form.dataset.editIndex = String(idx)
            form.dataset.reviewerId = r.reviewerId || ''
        })
        item.appendChild(editBtn)
        list.appendChild(item)
    })
    container.appendChild(list)
}
