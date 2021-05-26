import api from '../services/services.js';
import gif from '../common/gif.js';
const sectionGifs = document.querySelector('#gifs-section');
const containerGifs = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-see-more');
let validateEvent = true;

export default {
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
						gif.removeItemObjFromArr(favorites, gifId);
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
};
