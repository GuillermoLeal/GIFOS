import { btn_noc_mode, getNocMode, setNocMode } from './modules.js';

//**** FUNCTIONS ****/
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

//**** EVENTS ****/
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
