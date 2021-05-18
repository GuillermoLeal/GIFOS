import api from './paths-api.js';

/**
 * @description Promesa para obtener data de autocompletado en el buscador de la página
 * @param string search
 * @returns Promise
 */
export const getApiAutocomplete = (search) => {
	return new Promise((resolve, reject) => {
		fetch(`${api.API_AUTOCOMPLETE}?api_key=${api.API_KEY}&q=${search}`)
			.then((res) => res.json())
			.then((data) => resolve(data))
			.catch((err) => reject(err));
	});
};

/**
 * @description Promesa para obtener data de lo que busco el cliente
 * @param string search
 * @returns Promise
 */
export const getApiSearch = (search, limit, offset) => {
	return new Promise((resolve, reject) => {
		fetch(`${api.API_SEARCH}?api_key=${api.API_KEY}&q=${search}&limit=${limit}&offset=${offset}`)
			.then((res) => res.json())
			.then((data) => resolve(data))
			.catch((err) => reject(err));
	});
};

/**
 * @description Promesa para obtener un gif en especifico
 * @param string id
 * @returns Promise
 */
export const getApiGifByID = (id) => {
	return new Promise((resolve, reject) => {
		fetch(`${api.API_GIF_BY_ID}/${id}?api_key=${api.API_KEY}`)
			.then((res) => res.json())
			.then((data) => resolve(data))
			.catch((err) => reject(err));
	});
};

export const getFavoritesLocal = () => {
	if (!!localStorage.getItem('favorites')) {
		return JSON.parse(localStorage.getItem('favorites'));
	} else {
		return [];
	}
};

export const setFavoritesLocal = (array) => {
	localStorage.setItem('favorites', JSON.stringify(array));
};
