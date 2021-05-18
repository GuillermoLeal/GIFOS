export default {
	/**
	 * @description Se encarga de pintar la lista de gifs
	 */
	maskGifs: function (gif, iconFav = 'favorite') {
		return `
			<div class="gif-container">
				<img class="gif" src="${gif.images.fixed_height.url}"></img>
				<div class="hover-gif">
					<div class="gif-actions">
						<i class="material-icons btn-favorites" id="fav-${gif.id}">${iconFav}</i>
						<i class="material-icons btn-download">save_alt</i>
						<i class="material-icons btn-show">open_in_full</i>
					</div>
					<div class="gif-info">
						<p class="gif-user">${gif.username}</p>
						<p class="gif-title">${gif.title}</p>
					</div>
				</div>
			</div>
		`;
	},
	/**
	 * @description Eliminar objeto de un array
	 */
	removeItemObjFromArr: function (arr, id) {
		const i = arr.map((itemArray) => itemArray.id).indexOf(id);

		if (i !== -1) {
			arr.splice(i, 1);
		}
	},
};
