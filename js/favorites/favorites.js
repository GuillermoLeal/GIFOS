import api from '../services/services.js';
import gif from '../common/gif.js';
import favorites from './addFavorites.js';

const sectionDataSearch = document.querySelector('#gifs-section');
const containerGifsSearch = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-see-more');
// data
let totalGifs = 0;

//? FUNCTIONS ****************
/**
 * @description mostrar los gifs que estan en favoritos
 * @param seeMore - Si el evento viene del boton "ver mas" - type: Boolean
 */
const handleDataFav = (seeMore = false) => {
	if (!seeMore) totalGifs = 0;
	const offset = totalGifs || 0;
	// traemos los favoritos
	const gifFav = api.getPageFavoritesLocal(12, offset);
	const totalAllGifs = api.getAllFavoritesLocal();

	let templateGifs = containerGifsSearch.innerHTML;

	if (gifFav.length) totalGifs += gifFav.length;
	const gifsIds = [];

	gifFav.forEach((item) => {
		gifsIds.push(item.id);
		templateGifs += gif.maskGifs(item);
	});

	containerGifsSearch.innerHTML = templateGifs;
	// Agregamos eventos a los botones de accion de los GIFS...
	favorites.addEventFavorites(gifsIds, true);
	addEventDownloadGif();
	// Si NO se tienen mas gifs oculta el boton ver mas...
	totalGifs < totalAllGifs.length ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');

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
