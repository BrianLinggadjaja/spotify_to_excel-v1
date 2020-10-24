function toggleSelection() {
	let toggleSelector = document.getElementById('optionSelector').classList

	if (toggleSelector.contains('left')) {
		disableToggleButton()
		displayLikedTracks()
		toggleSelector.remove('left')
		toggleSelector.add('right')
	} else {
		disableToggleButton()
		displayUserPlaylist()
		toggleSelector.remove('right')
		toggleSelector.add('left')
	}
}