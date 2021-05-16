import { getApiAutocomplete, getApiSearch } from './api/getDataApi.js';

//? VARIABLES ****************
// search
const containerSearch = document.querySelector('#search-input');
const searchInput = document.querySelector('#search');
const searchList = document.querySelector('#list-search');
// icons
const searchIconLeft = document.querySelector('#icon-search-left');
const searchIconRight = document.querySelector('#icon-search-right');
// sections
const sectionInfoSearch = document.querySelector('#info-search');
const sectionDataSearch = document.querySelector('#data-search');
const sectionGifDataList = document.querySelector('#gifs-data');
const sectionGifNoData = document.querySelector('#gifs-no-data');
const containerGifsSearch = document.querySelector('#gifs-results');
const titleSearch = document.querySelector('#title-search');
// data
const dataSearch = [];
const itemsAutocomplete = [];

//? FUNCTIONS ****************
/**
 * @description Llenado de la lista de sugerencias del buscador
 */
const handleDataAutocomplete = () => {
	const search = searchInput.value;
	toggleIconsSearch();

	getApiAutocomplete(search)
		.then((res) => {
			const { data } = res;
			searchList.innerHTML = ''; // Reseteamos la lista.

			if (data.length) {
				data.forEach((item) => {
					searchList.innerHTML += `<li class="item-list-autocomplete" id="value-${item.name}"><i class="material-icons">search</i>${item.name}</li>`;
				});
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
 * @description mostrar los gifs que el cliente busco
 */
const handleDataSearch = () => {
	const search = searchInput.value;
	const offset = dataSearch.length || 0;
	titleSearch.innerText = search.toUpperCase();

	getApiSearch(search, 12, offset)
		.then((res) => {
			const { data } = res;
			containerGifsSearch.innerHTML = '';

			if (data.length) {
				data.forEach((item) => {
					containerGifsSearch.innerHTML += `
						<div class="gif-container">
							<img class="gif" src="${item.images.fixed_height.url}"></img>
							<div class="hover-gif">
								<div class="gif-actions">
									<button class="favorites"><i class="material-icons">favorite_border</i></button>
									<button class="download"><i class="fas fa-download"></i></button>
									<button class="show"><i class="fas fa-expand-alt"></i></button>
								</div>
								<div class="gif-info">
									<p class="gif-user">${item.username}</p>
									<p class="gif-title">${item.title}</p>
								</div>
							</div>
						</div>
						`;
				});
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
searchInput.addEventListener('input', handleDataAutocomplete);
searchIconRight.addEventListener('click', handleResetSearch);
