import { getFavoritesLocal } from '../services/services.js';
import { addEventFavorites } from './addFavorites.js';
import gif from '../common/gif.js';

const sectionDataSearch = document.querySelector('#data-search');
const containerGifsSearch = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-see-more');

//? FUNCTIONS ****************
/**
 * @description mostrar los gifs que estan en favoritos
 */
const handleDataFav = () => {
	// traemos los favoritos
	const favorites = getFavoritesLocal();

	let templateGifs = containerGifsSearch.innerHTML;

	favorites.forEach((item) => {
		templateGifs += gif.maskGifs(item);
	});

	containerGifsSearch.innerHTML = templateGifs;
	// Agregamos eventos a los botones de accion de los GIFS...
	addEventFavorites(true);

	showSectionSearch(favorites.length ? true : false);
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
