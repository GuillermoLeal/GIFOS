import api from '../services/services.js';
import gif from '../common/gif.js';
import favorites from '../favorites/addFavorites.js';

const containerTrending = document.querySelector('#gifs-trending');
const btnLeft = document.querySelector('#btn-arrow-left');
const btnRight = document.querySelector('#btn-arrow-right');
let totalGifs = 0;

//? FUNCTIONS ****************
/**
 * @description Trayendo gifs trending
 */
const handleDataTrending = (optionArrow = 'left', scroll = false) => {
	let offset = totalGifs || 0;
	const limit = scroll ? 12 : 3;

	if (optionArrow === 'left' && totalGifs > 0) {
		totalGifs -= 3;
		offset = totalGifs - 3;
	}

	api.getApiTrending(limit, offset)
		.then((res) => {
			const { data, pagination } = res;
			if (!scroll) containerTrending.innerHTML = '';

			if (data.length) {
				// Guardando la data que ya se buscó
				if (optionArrow == 'right' || totalGifs == 0) totalGifs += data.length;
				// traemos los favoritos
				const gifsFav = api.getAllFavoritesLocal();
				let templateGifs = containerTrending.innerHTML;

				data.forEach((item) => {
					// Si se encuentra en favoritos cambia el icono del gif
					const iconFav = gifsFav.some((fav) => fav.id === item.id) ? 'favorite' : 'favorite_border';
					// Usamos el metodo para pintar los GIFS
					templateGifs += gif.maskGifs(item, iconFav);
				});

				containerTrending.innerHTML = templateGifs;
				// Agregamos eventos a los botones de accion de los GIFS...
				addEventFavorites();
				addEventDownloadGif();
				// Ocultamos las flechas
				optionArrow === 'left' && totalGifs <= 3 ? btnLeft.setAttribute('style', 'display: none') : btnLeft.setAttribute('style', '');
				optionArrow === 'right' && totalGifs > pagination.total_count ? btnRight.setAttribute('style', 'display: none') : btnRight.setAttribute('style', '');
			}
		})
		.catch((err) => {
			console.warn('Error al hacer la petición getApiSearch en la API: ', err);
		});
};

/**
 * @description Agregar Evento de añadir gif a favoritos
 */
const addEventFavorites = () => {
	const btnFavorites = document.querySelectorAll('.btn-favorites');

	btnFavorites.forEach((item) => {
		item.addEventListener('click', () => favorites.addGifFavorites());
	});
};

const addEventDownloadGif = () => {
	const btnDownload = document.querySelectorAll('.btn-download');

	btnDownload.forEach((item) => {
		item.addEventListener('click', () => gif.downloadGif());
	});
};

//? EVENTS *******************
btnLeft.addEventListener('click', () => handleDataTrending('left'));
btnRight.addEventListener('click', () => handleDataTrending('right'));
containerTrending.addEventListener('scroll', () => {
	if (containerTrending.offsetWidth + containerTrending.scrollLeft >= containerTrending.scrollWidth) {
		handleDataTrending('right', true);
	}
});

handleDataTrending();
