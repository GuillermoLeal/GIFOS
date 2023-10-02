const ENDPOINT = 'https://api.giphy.com/v1/';

export default {
	// TODO: USER_KEY
	API_KEY: '23421353245235352354235235235',
	// TODO: PATHS ****/
	API_SEARCH: `${ENDPOINT}gifs/search`,
	API_AUTOCOMPLETE: `${ENDPOINT}gifs/search/tags`,
	API_SEARCH_TRENDING: `${ENDPOINT}trending/searches`,
	API_TRENDING: `${ENDPOINT}gifs/trending`,
	API_GIF_BY_ID: `${ENDPOINT}gifs/`,
	API_UPLOAD_GIFO: `https://upload.giphy.com/v1/gifs`,
};
