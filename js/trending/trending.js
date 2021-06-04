import api from '../services/services.js';
import gif from '../common/gif.js';

const containerTrending = document.querySelector('#gifs-trending');
const btnLeft = document.querySelector('#btn-arrow-left');
const btnRight = document.querySelector('#btn-arrow-right');
let gifsId = [];
let offset = 2;

//? FUNCTIONS ****************
/**
 * @description Trayendo gifs trending
 */
const handleDataTrending = () => {
	api.getApiTrending(36, 0)
		.then((res) => {
			const { data, pagination } = res;
			containerTrending.innerHTML = '';

			if (data.length) {
				// traemos los favoritos
				const gifsFav = api.getAllFavoritesLocal();
				let templateGifs = '';
				gifsId = [];

				data.forEach((item) => {
					gifsId.push(item.id);
					// Si se encuentra en favoritos cambia el icono del gif
					const iconFav = gifsFav.some((fav) => fav.id === item.id) ? 'favorite' : 'favorite_border';
					// Usamos el metodo para pintar los GIFS
					templateGifs += gif.maskGifs(item, iconFav);
				});
				// Pintar los gifs
				containerTrending.insertAdjacentHTML('beforeend', templateGifs);

				btnLeft.setAttribute('style', 'display: none');
				// Agregamos eventos a los botones de accion de los GIFS...
				gif.addEventFavorites(gifsId);
				gif.addEventDownloadGif(gifsId);
			}
		})
		.catch((err) => {
			console.warn('Error al hacer la petición getApiSearch en la API: ', err);
		});
};

/**
 * @description Mover a la derecha el carrusel de trending
 */
const rightMove = () => {
	btnLeft.setAttribute('style', '');
	offset += 1;
	document.querySelector(`.gifId-${gifsId[offset]}`).scrollIntoView();
	if (offset == 35) {
		offset = 33;
		btnRight.setAttribute('style', 'display: none');
	}
};
/**
 * @description Mover a la izquierda el carrusel de trending
 */
const leftMove = () => {
	btnRight.setAttribute('style', '');
	offset -= 3;
	document.querySelector(`.gifId-${gifsId[offset]}`).scrollIntoView();
	if (offset == 0) {
		offset = 2;
		btnLeft.setAttribute('style', 'display: none');
	} else {
		offset += 2;
	}
};

//? EVENTS *******************
btnLeft.addEventListener('click', leftMove);
btnRight.addEventListener('click', rightMove);

handleDataTrending();
