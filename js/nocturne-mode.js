//TODO: VARIABLES ****/
const btn_noc_mode = document.querySelector('#noc-mode');

//TODO: FUNCTIONS ****/
const getNocMode = () => {
	return localStorage.getItem('nocMode');
};
const setNocMode = (value) => {
	localStorage.setItem('nocMode', value.toString());
};

const validateNocMode = () => {
	const bodyClassList = document.body.classList;
	if (getNocMode() == 'true') {
		bodyClassList.add('theme--dark');
		btn_noc_mode.innerText = 'Modo Diurno';
	} else {
		bodyClassList.remove('theme--dark');
		btn_noc_mode.innerText = 'Modo Nocturno';
	}
};

//TODO: EVENTS ****/
btn_noc_mode.addEventListener('click', () => {
	const bodyClassList = document.body.classList;

	if (bodyClassList.contains('theme--dark')) {
		btn_noc_mode.innerText = 'Modo Nocturno';
		setNocMode(false);
	} else {
		btn_noc_mode.innerText = 'Modo Diurno';
		setNocMode(true);
	}

	bodyClassList.toggle('theme--dark');
});

validateNocMode();
