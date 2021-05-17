const titleSearch = document.querySelector('#title-search');
const sectionDataSearch = document.querySelector('#data-search');
const containerGifsSearch = document.querySelector('#gifs-results');
const btnSeeMore = document.querySelector('#btn-see-more');

//? FUNCTIONS ****************
/**
 * @description mostrar los gifs que estan en favoritos
 */
const handleDataFav = (seeMore = false) => {
	if (!seeMore) totalGifs = 0;
	const search = searchInput.value;
	const offset = totalGifs || 0;
	titleSearch.innerText = search.toUpperCase();

	// getApiSearch(search, 12, offset)
	// 	.then((res) => {
	const { data, pagination } = res;
	if (!seeMore) containerGifsSearch.innerHTML = '';

	if (data.length) {
		// Guardando la data que ya se buscó
		totalGifs += data.length;

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

		// Si NO se tienen mas gifs oculta el boton ver mas...
		totalGifs < pagination.total_count ? btnSeeMore.classList.remove('d-none') : btnSeeMore.classList.add('d-none');
	}

	containerSearch.classList.remove('active');
	toggleIconsSearch();
	showSectionSearch(data.length ? true : false);
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
