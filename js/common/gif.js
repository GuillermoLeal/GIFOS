import api from '../services/services.js';
const sectionGifs = document.querySelector('#gifs-section');
const containerGifs = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-see-more');
let validateEvent = true;

export default {
	/**
	 * @description Total de Gifs visibles en la seccion de favoritos
	 */
	totalGifs: 0,
	/**
	 * @description Actualziar el total de Gifs visibles en la seccion de favoritos
	 */
	setTotalGifs(totalGifs) {
		this.totalGifs = totalGifs;
	},
	/**
	 * @description Se encarga de pintar la lista de gifs
	 */
	maskGifs(gif, iconFav = 'favorite') {
		return `
			<div class="gifId-${gif.id} gif-container" data-target="gif">
				<video class="gif" height="${gif.images.fixed_height.height}" autoplay loop muted playsinline>
					<source src="${gif.images.fixed_height.mp4}" type="video/mp4">
					Gif...
				</video>
				<div class="hover-gif">
					<div class="gif-actions">
						<i class="fav-${gif.id} material-icons">${iconFav}</i>
						<i class="download-${gif.id} material-icons">save_alt</i>
						<i class="show-${gif.id} material-icons">open_in_full</i>
					</div>
					<div class="gif-info">
						<p class="gif-user">${gif.username}</p>
						<p class="gif-title">${gif.title}</p>
					</div>
				</div>
			</div>
		`;
	},
	/**
	 * @description Agregar Evento de añadir gif a favoritos
	 * @param ids - id de los gifs los cuales se le agregara el evento al boton de favoritos - type: Array
	 * @param validatePage - validar si se encuentra en la ruta de favoritos, si es asi elimina el item de la vista - type: Boolean
	 */
	addEventFavorites(ids, validatePage = false) {
		ids.forEach((id) => {
			const btnFavorites = document.querySelectorAll(`.fav-${id}`);
			btnFavorites.forEach((btn) => {
				btn.addEventListener('click', () => this.addGifFavorites(validatePage));
			});
		});
	},
	/**
	 * @description Agregar Evento de descargar el gif
	 * @param ids - id de los gifs los cuales se le agregara el evento al boton de descarga - type: Array
	 */
	addEventDownloadGif(ids) {
		ids.forEach((id) => {
			const btnDownloads = document.querySelectorAll(`.download-${id}`);
			btnDownloads.forEach((btn) => {
				btn.addEventListener('click', () => this.downloadGif());
			});
		});
	},
	/**
	 * @description Obtener ids de los elementos gifs que estan visibles en la pagina
	 * @param gifsNodes - Lista de elementos(GIFS - html) - type: Array
	 */
	getIdsGifsContainer(gifsNodes) {
		const gifsId = [];

		gifsNodes.forEach((item) => {
			gifsId.push(item.classList[0].replace('gifId-', ''));
		});

		return gifsId;
	},
	/**
	 * @description Recargar gifs cuando está en la página de Favoritos
	 * @param favGifs - lista de gifs que el usuario tiene en favoritos - type: Array
	 */
	reloadPageGif(favGifs, gifId) {
		// debugger;
		let gifsContainer = document.querySelectorAll('#gifs-results .gif-container');
		// Si al eliminar un gif existen mas de lo que se muestran.. agrega el siguiente
		let templateGifs = containerGifs.innerHTML;

		const gifRemove = document.querySelector(`#gifs-results .gifId-${gifId}`) || null;
		if (favGifs.length <= gifsContainer.length || !!gifRemove) {
			if (!!gifRemove) gifRemove.remove();
		}

		gifsContainer = document.querySelectorAll('#gifs-results .gif-container');
		if (favGifs.length > gifsContainer.length) {
			templateGifs = containerGifs.innerHTML;
			if (gifsContainer.length % 12 !== 0) templateGifs += this.maskGifs(favGifs[gifsContainer.length]);
			containerGifs.innerHTML = templateGifs;
		}

		const gifs = document.querySelectorAll('#gifs-results .gif-container');
		const gifsId = this.getIdsGifsContainer(gifs);
		this.addEventFavorites(gifsId, true);

		this.setTotalGifs(gifs.length);
		favGifs.length > gifs.length ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');
	},
	/**
	 * @description Agregar gif a favoritos
	 * @param validatePage - validar si se encuentra en la ruta de favoritos, si es asi elimina el item de la vista - type: Boolean
	 */
	addGifFavorites(validatePage = false) {
		if (validateEvent) {
			validateEvent = false;
			const gifId = event.target.classList[0].replace('fav-', '');
			const iconsGif = document.querySelectorAll(`.fav-${gifId}`);

			api.getApiGifByID(gifId)
				.then((res) => {
					const { data } = res;
					const favorites = api.getAllFavoritesLocal();
					let iconFav = '';
					// Se valida si el Gif ya se encuentra en favoritos - si se encuentra lo quita.. si no lo agrega...
					if (favorites.some((fav) => fav.id === gifId)) {
						this.removeItemObjFromArr(favorites, gifId);
						iconFav = 'favorite_border';
					} else {
						favorites.push(data);
						iconFav = 'favorite';
					}
					// cambiar los iconos de los gifs
					iconsGif.forEach((btnFav) => {
						btnFav.innerText = iconFav;
					});

					api.setFavoritesLocal(favorites);

					// if (validatePage) {
					// 	document.querySelector(`.gifId-${gifId}`).remove();
					// }

					// Mostrar secciona de data o sin data en Favoritos
					if (window.location.pathname == '/views/favoritos.html') {
						if (favorites.length) {
							sectionGifs.classList.add('active-data');
							sectionGifs.classList.remove('active-no-data');
						} else {
							sectionGifs.classList.add('active-no-data');
							sectionGifs.classList.remove('active-data');
						}

						this.reloadPageGif(favorites, gifId);
					} else {
						// Si NO se tienen mas gifs oculta el boton ver mas...
						favorites.length > 12 ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');
					}
				})
				.catch((err) => {
					console.log('Error al hacer la petición getApiGifByID en la API: ', err);
				})
				.finally(() => {
					validateEvent = true;
				});
		}
	},

	downloadGif() {
		const gifId = event.target.classList[0].replace('download-', '');

		api.getApiGifByID(gifId)
			.then((res) => {
				const { data } = res;
				// Obtener el gif a descargar
				api.downloadGif(data.images.original.url)
					.then((response) => {
						// Crear el descargable
						response
							.blob()
							.then((file) => {
								const a = document.createElement('a');
								a.download = data.id;
								a.href = window.URL.createObjectURL(file);
								a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
								a.click();
							})
							.catch((err) => {
								console.error('Error al crear descargable: ', err);
							});
					})
					.catch((err) => {
						console.error('Error al descargar el gif: ', err);
					});
			})
			.catch((err) => {
				console.error('Error al hacer la petición getApiGifByID en la API: ', err);
			});
	},
	/**
	 * @description Eliminar objeto de un array
	 * @param array - Array de objetos el cual se le eliminara el item - type: Array
	 * @param id - item a buscar en el array - type: String | Number
	 */
	removeItemObjFromArr(arr, id) {
		const i = arr.map((itemArray) => itemArray.id).indexOf(id);

		if (i !== -1) {
			arr.splice(i, 1);
		}
	},
};
