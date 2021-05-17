import { getApiAutocomplete, getApiSearch, getApiGifByID, getFavoritesLocal, setFavoritesLocal } from './api/getDataApi.js';
import { removeItemObjFromArr } from './common/funciones.js';

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
const handleDataSearch = (seeMore = false) => {
	if (!seeMore) totalGifs = 0;
	const search = searchInput.value;
	const offset = totalGifs || 0;
	titleSearch.innerText = search.toUpperCase();

	getApiSearch(search, 12, offset)
		.then((res) => {
			const { data, pagination } = res;
			if (!seeMore) containerGifsSearch.innerHTML = '';

			if (data.length) {
				// Guardando la data que ya se buscó
				totalGifs += data.length;
				// traemos los favoritos
				const favorites = getFavoritesLocal();

				data.forEach((item) => {
					// Si se encuentra en favoritos cambia el icono del gif
					const iconFav = favorites.some((fav) => fav.id === item.id) ? 'favorite' : 'favorite_border';

					containerGifsSearch.innerHTML += `
						<div class="gif-container">
							<img class="gif" src="${item.images.fixed_height.url}"></img>
							<div class="hover-gif">
								<div class="gif-actions">
									<i class="material-icons btn-favorites" id="fav-${item.id}">${iconFav}</i>
									<i class="material-icons btn-download">save_alt</i>
									<i class="material-icons btn-show">open_in_full</i>
								</div>
								<div class="gif-info">
									<p class="gif-user">${item.username}</p>
									<p class="gif-title">${item.title}</p>
								</div>
							</div>
						</div>
						`;
				});
				// Agregamos eventos a los botones de accion de los GIFS...
				addEventFavorites();
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

const addEventFavorites = () => {
	const btnFavorites = document.querySelectorAll('.btn-favorites');

	btnFavorites.forEach((item) => {
		item.addEventListener('click', addGifFavorites);
	});
};

/**
 * @description Agregar gif a favoritos
 */
const addGifFavorites = () => {
	const gifId = event.target.id.replace('fav-', '');
	const iconGif = document.querySelector(`#fav-${gifId}`);

	getApiGifByID(gifId)
		.then((res) => {
			const { data } = res;
			const favorites = getFavoritesLocal();

			// Se valida si el Gif ya se encuentra en favoritos - si se encuentra lo quita.. si no lo agrega...
			if (favorites.some((fav) => fav.id === gifId)) {
				removeItemObjFromArr(favorites, gifId);
				iconGif.innerText = 'favorite_border';
			} else {
				favorites.push(data);
				iconGif.innerText = 'favorite';
			}

			setFavoritesLocal(favorites);
		})
		.catch((err) => {
			console.log('Error al hacer la petición getApiGifByID en la API: ', err);
		});
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
