import api from '../services/services.js';
import gif from '../common/gif.js';

const sectionGifs = document.querySelector('#gifs-section');
const containerGifs = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-see-more');
// data
let totalGifs = 0;

//? FUNCTIONS ****************
/**
 * @description mostrar los gifs que estan en favoritos
 * @param seeMore - Si el evento viene del boton "ver mas" - type: Boolean
 */
const handleDataFav = (seeMore = false) => {
	// debugger;
	if (!seeMore) gif.setTotalGifs(0);
	const offset = gif.totalGifs || 0;
	// traemos los favoritos
	const gifFav = api.getPageFavoritesLocal(12, offset);
	const totalAllGifs = api.getAllFavoritesLocal();

	let templateGifs = containerGifs.innerHTML;

	const gifsIds = [];

	gifFav.forEach((item) => {
		gifsIds.push(item.id);
		templateGifs += gif.maskGifs(item);
	});

	containerGifs.innerHTML = templateGifs;

	// gif.totalGifs += document.querySelectorAll('#gifs-results .gif-container').length;
	gif.setTotalGifs(document.querySelectorAll('#gifs-results .gif-container').length);

	// Agregamos eventos a los botones de accion de los GIFS...
	gif.addEventFavorites(gifsIds, true);
	addEventDownloadGif();
	// Si NO se tienen mas gifs oculta el boton ver mas...
	gif.totalGifs < totalAllGifs.length ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');

	showSectionSearch(gifFav.length ? true : false);
};

const addEventDownloadGif = () => {
	const btnDownload = document.querySelectorAll('.btn-download');

	btnDownload.forEach((item) => {
		item.addEventListener('click', () => gif.downloadGif());
	});
};

/**
 * @description Mostrar u ocultar las secciones al hacer una busqueda de gif
 * @param validateData - Si la consulta tiene datos muestra la seccion correspondiente - type: Boolean
 */
const showSectionSearch = (validateData) => {
	if (validateData) {
		sectionGifs.classList.add('active-data');
		sectionGifs.classList.remove('active-no-data');
	} else {
		sectionGifs.classList.add('active-no-data');
		sectionGifs.classList.remove('active-data');
	}
};

//? EVENTS *******************
btnSeeMore.addEventListener('click', () => handleDataFav(true));

handleDataFav();
