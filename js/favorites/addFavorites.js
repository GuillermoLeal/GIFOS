import { getApiGifByID, getFavoritesLocal, setFavoritesLocal } from '../services/services.js';
import gif from '../common/gif.js';

/**
 * @description Agregar Evento de añadir gif a favoritos
 */
export const addEventFavorites = (pageFav = false) => {
	const btnFavorites = document.querySelectorAll('.btn-favorites');

	btnFavorites.forEach((item) => {
		item.addEventListener('click', () => addGifFavorites(pageFav));
	});
};

/**
 * @description Agregar gif a favoritos
 */
export const addGifFavorites = (validatePage) => {
	const gifId = event.target.id.replace('fav-', '');
	const iconGif = document.querySelector(`#fav-${gifId}`);

	getApiGifByID(gifId)
		.then((res) => {
			const { data } = res;
			const favorites = getFavoritesLocal();

			// Se valida si el Gif ya se encuentra en favoritos - si se encuentra lo quita.. si no lo agrega...
			if (favorites.some((fav) => fav.id === gifId)) {
				gif.removeItemObjFromArr(favorites, gifId);
				iconGif.innerText = 'favorite_border';
			} else {
				favorites.push(data);
				iconGif.innerText = 'favorite';
			}

			setFavoritesLocal(favorites);
			if (validatePage) location.reload();
		})
		.catch((err) => {
			console.log('Error al hacer la petición getApiGifByID en la API: ', err);
		});
};
