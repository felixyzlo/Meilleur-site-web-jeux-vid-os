const password = "jvd"
const email = "diarra@gmail.com"

document.addEventListener('DOMContentLoaded', () => {
	const loginForm = document.getElementById('loginForm')
	const registerForm = document.getElementById('registerForm')
	const errorBoxes = document.querySelectorAll('.error')

	function showError(formEl, message){
		const box = formEl.querySelector('.error')
		if(box) box.textContent = message
	}

	if (loginForm) {
		loginForm.addEventListener('submit', function (e) {
			e.preventDefault()
			showError(loginForm, '')

			const fEmail = (loginForm.email.value || '').trim()
			const fPass = (loginForm.password.value || '').trim()

			if (!fEmail || !fPass) {
				showError(loginForm, 'Veuillez remplir tous les champs.')
				return
			}

			if (fEmail !== email || fPass !== password) {
				showError(loginForm, 'Email ou mot de passe incorrect.')
				return
			}

			window.location.href = '../pageweb/accueil.html'
		})
	}

	if (registerForm) {
		registerForm.addEventListener('submit', function (e) {
			e.preventDefault()
			showError(registerForm, '')

			const fEmail = (registerForm.email.value || '').trim()
			const fPass = (registerForm.password.value || '').trim()

			if (!fEmail || !fPass) {
				showError(registerForm, 'Veuillez remplir tous les champs.')
				return
			}

			window.location.href = '../pageweb/accueil.html'
		})
	}
})