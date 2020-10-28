function toggleSelection() {
	let toggleSelector = document.getElementById('optionSelector').classList

	if (toggleSelector.contains('left')) {
		disableExport()
		disableToggleButton()
		displayLikedTracks()
		toggleSelector.remove('left')
		toggleSelector.add('right')
	} else {
		disableExport()
		displayUserPlaylist()
		toggleSelector.remove('right')
		toggleSelector.add('left')
	}
}