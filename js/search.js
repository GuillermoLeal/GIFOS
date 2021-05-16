import { getApiAutocomplete, getApiSearch } from './api/getDataApi.js';

//? VARIABLES ****************
// search
const containerSearch = document.querySelector('#search-input');
const searchInput = document.querySelector('#search');
const searchList = document.querySelector('#list-search');
// icons
const searchIconLeft = document.querySelector('#icon-search-left');
const searchIconRight = document.querySelector('#icon-sarch-right');
// sections
const sectionTrending = document.querySelector('#info-search');
const sectionDataSearch = document.querySelector('#data-search');
const sectionGifDataList = document.querySelector('#gifs-data');
const sectionGifNoData = document.querySelector('#gifs-no-data');
// data
const dataSearch = [];

//? FUNCTIONS ****************
/**
 * @description Llenado de la lista de sugerencias del buscador
 */
const getDataAutocomplete = () => {
	const search = searchInput.value;
	toggleIconsSearch();

	getApiAutocomplete(search)
		.then((res) => {
			const { data } = res;
			searchList.innerHTML = ''; // Reseteamos la lista.

			if (data.length) {
				data.forEach((item) => {
					searchList.innerHTML += `<li><i class="material-icons item-list-autocomplete">search</i>${item.name}</li>`;
				});
				containerSearch.classList.add('active');
			} else {
				containerSearch.classList.remove('active');
			}
		})
		.catch((err) => {
			console.warn('Error al hacer la petición getDataAutocomplete en la API: ', err);
		});
};

const getDataSearch = (event) => {
	// Si se preciona Enter en el buscador hace la petición...
	if (event.keyCode === 13) {
		event.preventDefault();

		const search = searchInput.value;
		const offset = dataSearch.length || 0;

		getApiSearch(search, 12, offset)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.warn('Error al hacer la petición getApiSearch en la API: ', err);
			});
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
const resetSearch = () => {
	if (searchInput.value) {
		containerSearch.classList.remove('active');
		searchInput.value = '';
		searchList.innerHTML = '';
		searchIconRight.innerHTML = 'search';
	}
};

//? EVENTS *******************
searchInput.addEventListener('keyup', (event) => getDataSearch(event));
searchInput.addEventListener('input', getDataAutocomplete);
searchIconRight.addEventListener('click', resetSearch);
