// * VARIABLES
const btn_noc_mode = document.querySelector('#noc-mode');
const btn_fav = document.querySelector('#favs-link');

// * FUNCTIONS
const getNocMode = () => {
	return localStorage.getItem('nocMode');
};
const setNocMode = (value) => {
	localStorage.setItem('nocMode', value.toString());
};

export { btn_noc_mode, btn_fav, getNocMode, setNocMode };
