import api from '../services/services.js';
const sectionGifs = document.querySelector('#gifs-section');
const containerGifs = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-see-more');
let validateEvent = true;

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
	/**
	 * @description Agregar Evento de añadir gif a favoritos
	 * @param ids - id de los gifs los cuales se le agregara el evento al boton de favoritos - type: Array
	 * @param validatePage - validar si se encuentra en la ruta de favoritos, si es asi elimina el item de la vista - type: Boolean
	 */
	addEventFavorites(ids, validatePage = false) {
		ids.forEach((id) => {
			const btnFavorites = document.querySelector(`#fav-${id}`);
			btnFavorites.addEventListener('click', () => this.addGifFavorites(validatePage));
		});
	},
	/**
	 * @description Agregar gif a favoritos
	 * @param validatePage - validar si se encuentra en la ruta de favoritos, si es asi elimina el item de la vista - type: Boolean
	 */
	addGifFavorites(validatePage = false) {
		if (validateEvent) {
			validateEvent = false;
			const gifId = event.target.id.replace('fav-', '');
			const iconGif = document.querySelector(`#fav-${gifId}`);

			api.getApiGifByID(gifId)
				.then((res) => {
					const { data } = res;
					const favorites = api.getAllFavoritesLocal();

					// Se valida si el Gif ya se encuentra en favoritos - si se encuentra lo quita.. si no lo agrega...
					if (favorites.some((fav) => fav.id === gifId)) {
						this.removeItemObjFromArr(favorites, gifId);
						iconGif.innerText = 'favorite_border';
					} else {
						favorites.push(data);
						iconGif.innerText = 'favorite';
					}

					api.setFavoritesLocal(favorites);

					if (validatePage) document.querySelector(`#gifId-${gifId}`).remove();
					// Si NO se tienen mas gifs oculta el boton ver mas...
					favorites.length > 12 ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');

					// Mostrar secciona de data o sin data en Favoritos
					if (window.location.pathname == '/favoritos.html') {
						if (favorites.length) {
							sectionGifs.classList.add('active-data');
							sectionGifs.classList.remove('active-no-data');
						} else {
							sectionGifs.classList.add('active-no-data');
							sectionGifs.classList.remove('active-data');
						}
					}
				})
				.catch((err) => {
					console.log('Error al hacer la petición getApiGifByID en la API: ', err);
				})
				.finally(() => {
					validateEvent = true;
				});
		}
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
	 * @param array - Array de objetos el cual se le eliminara el item - type: Array
	 * @param id - item a buscar en el array - type: String | Number
	 */
	removeItemObjFromArr(arr, id) {
		const i = arr.map((itemArray) => itemArray.id).indexOf(id);

		if (i !== -1) {
			arr.splice(i, 1);
		}
	},
};
