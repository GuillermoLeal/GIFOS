import { getApiAutocomplete, getApiSearch } from './api/getDataApi.js';

//? VARIABLES ****************
// search
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
				searchList.setAttribute('style', '');
			} else {
				searchList.setAttribute('style', 'display: none;');
			}
		})
		.catch((err) => {
			console.warn('Error al hacer la petición getDataAutocomplete en la API: ', err);
		});
};

const getDataSearch = () => {
	const search = searchInput.value;
	const offset = dataSearch.length || 0;

	getApiSearch(search, 12, offset)
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.warn('Error al hacer la petición getApiSearch en la API: ', err);
		});
};

/**
 * @description Cambiar los iconos del buscador
 */
const toggleIconsSearch = () => {
	if (searchInput.value) {
		searchIconLeft.setAttribute('style', '');
		searchIconRight.innerHTML = 'close';
	} else {
		searchIconLeft.setAttribute('style', 'display: none;');
		searchIconRight.innerHTML = 'search';
	}
};

/**
 * @description Limpiar el buscador de gifs
 */
const resetSearch = () => {
	if (searchInput.value) {
		searchInput.value = '';
		searchIconLeft.setAttribute('style', 'display: none;');
		searchList.setAttribute('style', 'display: none;');
		searchIconRight.innerHTML = 'search';
		searchList.innerHTML = '';
	}
};

//? EVENTS *******************
searchInput.addEventListener('input', getDataAutocomplete);
searchIconRight.addEventListener('click', resetSearch);
