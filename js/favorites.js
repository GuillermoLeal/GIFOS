import { getApiGifByID, getFavoritesLocal, setFavoritesLocal } from './api/getDataApi.js';
import { removeItemObjFromArr } from './common/funciones.js';

const sectionDataSearch = document.querySelector('#data-search');
const containerGifsSearch = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-see-more');

//? FUNCTIONS ****************
/**
 * @description Agregar Evento de añadir gif a favoritos
 */
export const addEventFavorites = (pageFav = false) => {
	const btnFavorites = document.querySelectorAll('.btn-favorites');

	btnFavorites.forEach((item) => {
		item.addEventListener('click', () => addGifFavorites(pageFav));
	});
};

/**
 * @description Agregar gif a favoritos
 */
export const addGifFavorites = (validatePage) => {
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
			if (validatePage) location.reload();
		})
		.catch((err) => {
			console.log('Error al hacer la petición getApiGifByID en la API: ', err);
		});
};

/**
 * @description mostrar los gifs que estan en favoritos
 */
const handleDataFav = () => {
	// traemos los favoritos
	const favorites = getFavoritesLocal();

	favorites.forEach((item) => {
		containerGifsSearch.innerHTML += `
            <div class="gif-container">
                <img class="gif" src="${item.images.fixed_height.url}"></img>
                <div class="hover-gif">
                    <div class="gif-actions">
                        <i class="material-icons btn-favorites" id="fav-${item.id}">favorite</i>
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
