import api from '../services/services.js';
import gif from '../common/gif.js';
import favorites from './addFavorites.js';

const sectionDataSearch = document.querySelector('#data-search');
const containerGifsSearch = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-see-more');

//? FUNCTIONS ****************
/**
 * @description mostrar los gifs que estan en favoritos
 */
const handleDataFav = () => {
	// traemos los favoritos
	const favorites = api.getFavoritesLocal();

	let templateGifs = containerGifsSearch.innerHTML;

	favorites.forEach((item) => {
		templateGifs += gif.maskGifs(item);
	});

	containerGifsSearch.innerHTML = templateGifs;
	// Agregamos eventos a los botones de accion de los GIFS...
	addEventFavorites(true);

	showSectionSearch(favorites.length ? true : false);
};

const addEventFavorites = () => {
	const btnFavorites = document.querySelectorAll('.btn-favorites');

	btnFavorites.forEach((item) => {
		item.addEventListener('click', () => favorites.addGifFavorites(true));
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
