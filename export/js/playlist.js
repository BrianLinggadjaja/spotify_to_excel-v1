async function displayUserPlaylist() {
	const playlists = await getUserPlaylist()
	const section = document.getElementById('content')
	section.innerHTML = ''
	const playlistContainer  = document.createElement('div')
	playlistContainer.classList.add('content')
	section.appendChild(playlistContainer)

	for (let i = 0; i < playlists.length; i += 1) {
		let playlistItem = document.createElement('div')
		playlistItem.innerHTML = playlists[i].name
		playlistItem.classList.add('content__item')
		playlistItem.onclick = () => {
			displayTracksInPlaylist(playlists[i].id)
		}
		playlistContainer.append(playlistItem)
	}
}

async function getUserPlaylist() {
	const limit = '?limit=' + 50

	const data = await axios({
		method: 'get',
		url: 'https://api.spotify.com/v1/me/playlists/' + limit,
		headers: {
			'Authorization': sessionStorage.token_type + ' ' + sessionStorage.access_token,
			'content-type': 'application/json'
		}
	})
	.then((response) => {
		return response.data.items
	})
	.catch((error) => {
		sessionStorage.error = error
		window.location.href = sessionStorage.mount_path + '/error/'
	})

	return data
}

async function displayTracksInPlaylist(id) {
	let tracks = await getTracksFromPlaylist(id)
	const section = document.getElementById('content')
	section.innerHTML = ''
	const playlistContainer  = document.createElement('div')
	playlistContainer.classList.add('content')
	section.appendChild(playlistContainer)

	const exportExcel = document.getElementById('exportExcel')
	exportExcel.innerHTML = ''
	let data = document.createElement('table')
	data.id = 'data'
	data.classList.add('data')
	exportExcel.append(data)

	// Creates headers before populating table
	let tr = document.createElement('tr')
	let header = ['Song_id', 'Artist', 'Song Name', 'Genre', 'Downloaded', 'Track Downloaded'];

	for (let i = 0; i < header.length; i += 1) {
		let tableHead = createTableHeader(header[i]);
		tr.append(tableHead)
	}

	data.append(tr)

	// Populates Data
	for (let i = 0; i < tracks.length; i += 1) {
		let trackItem = document.createElement('div')
		trackItem.innerHTML = tracks[i].track.name
		trackItem.classList.add('content__item')
		playlistContainer.append(trackItem)

		let row = document.createElement('tr')
		let item = []
		item.push(i)
		item.push(tracks[i].track.artists[0].name)
		item.push(tracks[i].track.name)
		let genre = await getArtistGenre(tracks[i].track.artists[0].id)
		item.push(genre)
		item.push('N')

		for (let j = 0; j < item.length; j += 1) {
			let col = document.createElement('td')
			col.innerHTML = item[j]
			row.append(col)
		}
		data.append(row)
	}

	enableToggleButton()
	enableExport()
}

async function getTracksFromPlaylist(id) {
	let tracks = []
	let offsetNumber = 0

	let seekMoreTracks = true
	while (seekMoreTracks) {
		let data = await seekTracks(id, offsetNumber)

		for (let i = 0; i < data.length; i += 1) {
			tracks[offsetNumber + i] = Array.from(data)[i]
		}

		if (data.length > 49) {
			offsetNumber += 50
		} else {
			return tracks
		}
	}
}

async function seekTracks(id, offsetNumber) {
	const limit = '?limit=' + 50
	let offset = '&offset=' + offsetNumber

	let data = await axios({
		method: 'get',
		url: 'https://api.spotify.com/v1/playlists/' + id + '/tracks/' + limit + offset,
		headers: {
			'Authorization': sessionStorage.token_type + ' ' + sessionStorage.access_token,
			'content-type': 'application/json'
		}
	})
	.then((response) => {
		return response.data.items
	})
	.catch((error) => {
		sessionStorage.error = error
		window.location.href = sessionStorage.mount_path + '/error/'
	})

	return data
}
