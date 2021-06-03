import api from '../services/services.js';
import gif from '../common/gif.js';

const containerTrending = document.querySelector('#gifs-trending');
const btnLeft = document.querySelector('#btn-arrow-left');
const btnRight = document.querySelector('#btn-arrow-right');
let gidsIds = [];
let offset = 2;

//? FUNCTIONS ****************
/**
 * @description Trayendo gifs trending
 */
const handleDataTrending = (optionArrow = 'left', scroll = false) => {
	api.getApiTrending(36, 0)
		.then((res) => {
			const { data, pagination } = res;
			containerTrending.innerHTML = '';

			if (data.length) {
				// traemos los favoritos
				const gifsFav = api.getAllFavoritesLocal();
				let templateGifs = containerTrending.innerHTML;
				gidsIds = [];

				data.forEach((item) => {
					gidsIds.push(item.id);
					// Si se encuentra en favoritos cambia el icono del gif
					const iconFav = gifsFav.some((fav) => fav.id === item.id) ? 'favorite' : 'favorite_border';
					// Usamos el metodo para pintar los GIFS
					templateGifs += gif.maskGifs(item, iconFav);
				});

				containerTrending.innerHTML = templateGifs;

				btnLeft.setAttribute('style', 'display: none');

				// Agregamos eventos a los botones de accion de los GIFS...
				const validateRout = window.location.pathname == '/views/favoritos.html' ? true : false;
				gif.addEventFavorites(gidsIds, validateRout);
				addEventDownloadGif();
			}
		})
		.catch((err) => {
			console.warn('Error al hacer la petición getApiSearch en la API: ', err);
		});
};

const addEventDownloadGif = () => {
	const btnDownload = document.querySelectorAll('.btn-download');

	btnDownload.forEach((item) => {
		item.addEventListener('click', () => gif.downloadGif());
	});
};

const rightMove = () => {
	btnLeft.setAttribute('style', '');
	offset += 1;
	document.querySelector(`.gifId-${gidsIds[offset]}`).scrollIntoView();
	if (offset == 35) {
		offset = 33;
		btnRight.setAttribute('style', 'display: none');
	}
};
const leftMove = () => {
	btnRight.setAttribute('style', '');
	offset -= 3;
	document.querySelector(`.gifId-${gidsIds[offset]}`).scrollIntoView();
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
