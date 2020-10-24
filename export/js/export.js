async function getArtistGenre(artistsId) {
	let genre = await axios({
		method: 'get',
		url: 'https://api.spotify.com/v1/artists/'
		+ artistsId,
		headers: {
			'Authorization': sessionStorage.token_type + ' ' + sessionStorage.access_token,
			'content-type': 'application/json'
		}
	})
	.then((response) => {
		return response.data.genres[0]
	})
	.catch((error) => {
		sessionStorage.error = error
		window.location.href = sessionStorage.mount_path + 'error/'
	})

	return genre
}

function enableExport() {
	let exportContainer = document.getElementById('export')
	let exportButton = document.createElement('button')
	exportButton.onclick = () => {
		exportExcelFromTable()
	}
	exportButton.innerHTML = 'Export'
	exportButton.classList.add('option-selector__export')
	exportContainer.append(exportButton)
}

function disableExport() {
	let exportContainer = document.getElementById('export')
	exportContainer.innerHTML = ''
}

function exportExcelFromTable() {
	let table = document.getElementById('data');
	let workbook = XLSX.utils.table_to_book(table);
	XLSX.writeFile(workbook, 'song_list' + '.xlsx', {bookType:'xlsx',  type: 'string'})
}

function createTableHeader(tableHeader) {
	let header = document.createElement('td')
	header.innerHTML = tableHeader
	return header
}
