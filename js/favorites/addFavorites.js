import api from '../services/services.js';
import gif from '../common/gif.js';

export default {
	/**
	 * @description Agregar gif a favoritos
	 */
	addGifFavorites(validatePage = false) {
		const gifId = event.target.id.replace('fav-', '');
		const iconGif = document.querySelector(`#fav-${gifId}`);

		api.getApiGifByID(gifId)
			.then((res) => {
				const { data } = res;
				const favorites = api.getFavoritesLocal();

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
			})
			.catch((err) => {
				console.log('Error al hacer la petición getApiGifByID en la API: ', err);
			});
	},
};
