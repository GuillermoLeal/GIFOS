import api from '../services/services.js';

export default {
	/**
	 * @description Se encarga de pintar la lista de gifs
	 */
	maskGifs(gif, iconFav = 'favorite') {
		return `
			<div id="gifId-${gif.id}" class="gif-container">
				<img class="gif" src="${gif.images.fixed_height.url}"></img>
				<div class="hover-gif">
					<div class="gif-actions">
						<i class="material-icons btn-favorites" id="fav-${gif.id}">${iconFav}</i>
						<i class="material-icons btn-download" id="download-${gif.id}">save_alt</i>
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
	downloadGif() {
		const gifId = event.target.id.replace('download-', '');

		api.getApiGifByID(gifId)
			.then((res) => {
				const { data } = res;

				api.getApiGifDownlodad(data.images.original.hash)
					.then((res) => {
						console.log(res);
						const file = res;
						a.download = 'myGif';
						a.href = window.URL.createObjectURL(file);
						a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
						a.click();
					})
					.catch((err) => {
						console.warn('Error al hacer la petición downloadGif en la API: ', err);
					});
			})
			.catch((err) => {
				console.log('Error al hacer la petición getApiGifByID en la API: ', err);
			});
	},
	/**
	 * @description Eliminar objeto de un array
	 */
	removeItemObjFromArr(arr, id) {
		const i = arr.map((itemArray) => itemArray.id).indexOf(id);

		if (i !== -1) {
			arr.splice(i, 1);
		}
	},
};
