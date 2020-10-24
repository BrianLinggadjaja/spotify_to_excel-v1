async function getLikedTracks() {
	const limit = '?limit=' + 50

	let data = await axios({
		method: 'get',
		url: 'https://api.spotify.com/v1/me/tracks/' + limit, // /me/playlists
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

async function displayLikedTracks() {
	const section = document.getElementById('content')
	section.innerHTML = ''
	const tracks = await getLikedTracks()
	let likedTracks = document.createElement('div')
	likedTracks.classList.add('content')
	section.append(likedTracks)

	let exportExcel = document.getElementById('exportExcel')
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
		likedTracks.append(trackItem)

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
