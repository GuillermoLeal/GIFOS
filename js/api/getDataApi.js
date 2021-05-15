import { API_KEY, API_AUTOCOMPLETE, API_SEARCH } from './paths-api.js';

/**
 * @description Promesa para obtener data de autocompletado en el buscador de la página
 * @param string search
 * @returns Promise
 */
export const getApiAutocomplete = (search) => {
	return new Promise((resolve, reject) => {
		fetch(`${API_AUTOCOMPLETE}?api_key=${API_KEY}&q=${search}`)
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
		fetch(`${API_SEARCH}?api_key=${API_KEY}&q=${search}&limit=${limit}&offset=${offset}`)
			.then((res) => res.json())
			.then((data) => resolve(data))
			.catch((err) => reject(err));
	});
};
