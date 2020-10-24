function requestAuth() {
	let api = 'http://accounts.spotify.com/authorize'
	let responseType = '?response_type=' + 'token'
	let clientId = '&client_id=' + 'f800745ced564b6a8672795b779cfa15'
	let scope = '&scope=' + 'user-library-read playlist-read-private'
	let redirectUri = '&redirect_uri=' + window.location.href
	let randomKey = generateRandomKey(9)
	let state = '&state=' + randomKey

	// Store randomKey to match against state for later
	sessionStorage.state = randomKey

	// Route user to Spotify authentication service
	window.location.href = api + responseType + scope + clientId + redirectUri + state
}

function generateRandomKey(length) {
	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;

	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}

// Checks if user is Authorized
function checkAuth() {
	const mountPath = sessionStorage.mount_path.toString()
	const route = new URLSearchParams(window.location.hash)
	const routeState = route.get('state')

	sessionStorage.mount_path = mountPath
	sessionStorage.access_token = window.location.hash.split('&')[0].split('=')[1]
	sessionStorage.token_type = route.get('token_type')
	sessionStorage.expires_in = route.get('expires_in')

	if ( route.has('expires_in') && validateSession(routeState) ) {
		window.location.href =  mountPath + 'export/'
	} else if (window.location.pathname !== mountPath) {
		window.location.href =  mountPath
	}
}

// Check sessionState against routeState
function validateSession(routeState) {
	if ( sessionStorage.state === routeState ) {
		return true
	} else {
		return false
	}
}
