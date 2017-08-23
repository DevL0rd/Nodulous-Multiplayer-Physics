$.getScript('/js/Engine/Assets/Objects/player.js', function () {
    $.getScript('/js/Engine/Assets/Objects/blackhole.js', function () {
		$.getScript('/js/Engine/Assets/Objects/playerDebris.js', function () {
			$.getScript('/js/Engine/Assets/Objects/bullet.js', function () {
				engine.doneLoadingAssets()
			})
		})
	})
})
