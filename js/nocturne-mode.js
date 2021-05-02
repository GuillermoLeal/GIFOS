const button = document.querySelector('#noc-mode');

button.addEventListener('click', () => {
    const clasesBody = document.body.classList;
    button.innerText = clasesBody.contains( 'theme--dark' ) ? 'Modo Nocturno' : 'Modo Diurno';
    clasesBody.toggle('theme--dark');
});