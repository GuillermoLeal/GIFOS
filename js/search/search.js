import api from '../services/services.js';
import gif from '../common/gif.js';
import favorites from '../favorites/addFavorites.js';

//? VARIABLES ****************
// search
const containerSearch = document.querySelector('#search-input');
const searchInput = document.querySelector('#search');
const searchList = document.querySelector('#list-search');
const btnSeeMore = document.querySelector('#btn-see-more');
// icons
const searchIconLeft = document.querySelector('#icon-search-left');
const searchIconRight = document.querySelector('#icon-search-right');
// sections
const sectionInfoSearch = document.querySelector('#info-search');
const sectionDataSearch = document.querySelector('#data-search');
const containerGifsSearch = document.querySelector('#gifs-results');
const titleSearch = document.querySelector('#title-search');
// data
let totalGifs = 0;

//? FUNCTIONS ****************
/**
 * @description Llenado de la lista de sugerencias del buscador
 */
const handleDataAutocomplete = () => {
	const search = searchInput.value;
	toggleIconsSearch();

	api.getApiAutocomplete(search)
		.then((res) => {
			const { data } = res;
			searchList.innerHTML = ''; // Reseteamos la lista.
			let lista = '';

			if (data.length) {
				data.forEach((item) => {
					lista += `<li class="item-list-autocomplete" id="value-${item.name}"><i class="material-icons">search</i>${item.name}</li>`;
				});
				searchList.innerHTML = lista;
				addEventAutocomplete();
				containerSearch.classList.add('active');
			} else {
				containerSearch.classList.remove('active');
			}
		})
		.catch((err) => {
			console.warn('Error al hacer la petición handleDataAutocomplete en la API: ', err);
		});
};

/**
 * @description mostrar los gifs que el usuario busco
 */
const handleDataSearch = (seeMore = false) => {
	if (!seeMore) totalGifs = 0;
	const search = searchInput.value;
	const offset = totalGifs || 0;
	titleSearch.innerText = search.toUpperCase();

	api.getApiSearch(search, 12, offset)
		.then((res) => {
			const { data, pagination } = res;
			if (!seeMore) containerGifsSearch.innerHTML = '';

			if (data.length) {
				// Guardando la data que ya se buscó
				totalGifs += data.length;
				// traemos los favoritos
				const gifsFav = api.getAllFavoritesLocal();
				let templateGifs = containerGifsSearch.innerHTML;

				data.forEach((item) => {
					// Si se encuentra en favoritos cambia el icono del gif
					const iconFav = gifsFav.some((fav) => fav.id === item.id) ? 'favorite' : 'favorite_border';
					// Usamos el metodo para pintar los GIFS
					templateGifs += gif.maskGifs(item, iconFav);
				});

				containerGifsSearch.innerHTML = templateGifs;
				// Agregamos eventos a los botones de accion de los GIFS...
				addEventFavorites();
				addEventDownloadGif();
				// Si NO se tienen mas gifs oculta el boton ver mas...
				totalGifs < pagination.total_count ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');
			}

			containerSearch.classList.remove('active');
			toggleIconsSearch();
			showSectionSearch(data.length ? true : false);
		})
		.catch((err) => {
			console.warn('Error al hacer la petición getApiSearch en la API: ', err);
		});
};

/**
 * @description Agregando evento a las sugerencias en el buscador
 */
const addEventAutocomplete = () => {
	const itemsListAutocomplete = document.querySelectorAll('.item-list-autocomplete');

	itemsListAutocomplete.forEach((item) => {
		item.addEventListener('click', handleSearchByAutocomplete);
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

/**
 * @description Buscar por gif por sugerencia
 */
const handleSearchByAutocomplete = () => {
	searchInput.value = event.target.id.replace('value-', '');
	handleDataSearch();
};

/**
 * @description Mostrar u ocultar las secciones al hacer una busqueda de gif
 */
const showSectionSearch = (validateData) => {
	if (validateData) {
		sectionInfoSearch.classList.remove('active');
		sectionDataSearch.classList.add('active-data');
		sectionDataSearch.classList.remove('active-no-data');
	} else {
		sectionInfoSearch.classList.add('active');
		sectionDataSearch.classList.add('active-no-data');
		sectionDataSearch.classList.remove('active-data');
	}
};

/**
 * @description Cambiar los iconos del buscador entre lupa y X
 */
const toggleIconsSearch = () => {
	if (searchInput.value) {
		searchIconRight.innerHTML = 'close';
	} else {
		searchIconRight.innerHTML = 'search';
	}
};

/**
 * @description Limpiar el buscador de gifs
 */
const handleResetSearch = () => {
	if (searchInput.value) {
		containerSearch.classList.remove('active');
		sectionInfoSearch.classList.add('active');
		sectionDataSearch.classList.remove('active-no-data');
		sectionDataSearch.classList.remove('active-data');
		searchInput.value = '';
		searchList.innerHTML = '';
		searchIconRight.innerHTML = 'search';
	}
};

//? EVENTS *******************
searchInput.addEventListener('keyup', (event) => {
	// Si se preciona Enter en el buscador hace la petición...
	if (event.keyCode === 13) {
		event.preventDefault();
		handleDataSearch();
	}
});
searchIconLeft.addEventListener('click', handleDataSearch);
btnSeeMore.addEventListener('click', () => handleDataSearch(true));
searchInput.addEventListener('input', handleDataAutocomplete);
searchIconRight.addEventListener('click', handleResetSearch);
