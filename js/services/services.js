import pathsApi from './paths-api.js';

export default {
	/**
	 * @description Promesa para obtener los gifs trending
	 * @param limit - limite de registros que se desea obtener
	 * @param offset - desde donde empieza a traer la data
	 * @returns Promise
	 */
	getApiTrending(limit, offset) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_TRENDING}?api_key=${pathsApi.API_KEY}&limit=${limit}&offset=${offset}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	/**
	 * @description Promesa para obtener data de autocompletado en el buscador de la página
	 * @param search - termino a buscar en los datos de la api
	 * @returns Promise
	 */
	getApiAutocomplete(search) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_AUTOCOMPLETE}?api_key=${pathsApi.API_KEY}&q=${search}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	/**
	 * @description Promesa para obtener data de lo que busco el cliente
	 * @param search - termino a buscar en los datos de la api
	 * @param limit - limite de registros que se desea obtener
	 * @param offset - desde donde empieza a traer la data
	 * @returns Promise
	 */
	getApiSearch(search, limit, offset) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_SEARCH}?api_key=${pathsApi.API_KEY}&q=${search}&limit=${limit}&offset=${offset}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	/**
	 * @description Promesa para obtener un gif en especifico
	 * @param string id
	 * @returns Promise
	 */
	getApiGifByID(id) {
		return new Promise((resolve, reject) => {
			fetch(`${pathsApi.API_GIF_BY_ID}${id}?api_key=${pathsApi.API_KEY}`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	/**
	 * @description Promesa para descargar el gif
	 * @param hash - hash del gif
	 * @returns Promise
	 */
	getApiGifDownlodad(hash) {
		return new Promise((resolve, reject) => {
			fetch(`https://media.giphy.com/media/${hash}/source.gif`)
				.then((res) => res.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	},
	/**
	 * @description Objetener los favoritos del usuario
	 * @returns Array
	 */
	getAllFavoritesLocal() {
		if (!!localStorage.getItem('favorites')) {
			return JSON.parse(localStorage.getItem('favorites'));
		} else {
			return [];
		}
	},
	/**
	 * @description Objetener los favoritos del usuario
	 * @param limit - limite de registros que se desea obtener
	 * @param offset - desde donde empieza a traer la data
	 * @returns Array
	 */
	getPageFavoritesLocal(limit = 12, offset = 0) {
		if (!!localStorage.getItem('favorites')) {
			const favorites = JSON.parse(localStorage.getItem('favorites'));
			return favorites.slice(offset, offset + limit);
		} else {
			return [];
		}
	},
	/**
	 * @description Almacenar los favoritos del usuario
	 * @param Array - array que se agregará en el localStorage de 'favoritos'
	 */
	setFavoritesLocal(array) {
		localStorage.setItem('favorites', JSON.stringify(array));
	},
};
