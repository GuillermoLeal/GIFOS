import api from '../services/services.js';
import gif from '../common/gif.js';
import favorites from './addFavorites.js';

const sectionDataSearch = document.querySelector('#data-search');
const containerGifsSearch = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-see-more');
// data
let totalGifs = 0;

//? FUNCTIONS ****************
/**
 * @description mostrar los gifs que estan en favoritos
 */
const handleDataFav = (seeMore = false) => {
	if (!seeMore) totalGifs = 0;
	const offset = totalGifs || 0;
	// traemos los favoritos
	const gifFav = api.getPageFavoritesLocal(12, offset);
	const totalAllGifs = api.getAllFavoritesLocal();

	let templateGifs = containerGifsSearch.innerHTML;

	if (gifFav.length) totalGifs += gifFav.length;

	gifFav.forEach((item) => {
		templateGifs += gif.maskGifs(item);
	});

	containerGifsSearch.innerHTML = templateGifs;
	// Agregamos eventos a los botones de accion de los GIFS...
	addEventFavorites(true);
	addEventDownloadGif();
	// Si NO se tienen mas gifs oculta el boton ver mas...
	totalGifs < totalAllGifs.length ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');

	showSectionSearch(gifFav.length ? true : false);
};

/**
 * @description Agregar Evento de añadir gif a favoritos
 */
const addEventFavorites = () => {
	const btnFavorites = document.querySelectorAll('.btn-favorites');

	btnFavorites.forEach((item) => {
		item.addEventListener('click', () => favorites.addGifFavorites(true));
	});
};

const addEventDownloadGif = () => {
	const btnDownload = document.querySelectorAll('.btn-download');

	btnDownload.forEach((item) => {
		item.addEventListener('click', () => gif.downloadGif());
	});
};

/**
 * @description Mostrar u ocultar las secciones al hacer una busqueda de gif
 */
const showSectionSearch = (validateData) => {
	if (validateData) {
		sectionDataSearch.classList.add('active-data');
		sectionDataSearch.classList.remove('active-no-data');
	} else {
		sectionDataSearch.classList.add('active-no-data');
		sectionDataSearch.classList.remove('active-data');
	}
};

//? EVENTS *******************
btnSeeMore.addEventListener('click', () => handleDataFav(true));

handleDataFav();
