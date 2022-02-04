const radioButtons = document.querySelectorAll('.radio');
const btnBuscar = document.querySelector('.btn');
const selectDeGeneracion = document.querySelector('.selec-generacion');
const listaPokemons = document.querySelector('.lista-pokemons');
const btnCerrar = document.querySelector('.btn-cerrar');
const modal = document.querySelector('.modal');

//asignando eventos
btnBuscar.addEventListener('click', buscarBoton);
radioButtons.forEach(radio => radio.addEventListener('click', buscarPor));
selectDeGeneracion.addEventListener('change', selectGeneracion);
listaPokemons.addEventListener('change', buscarSelect);
btnCerrar.addEventListener('click', cerrarInfoAtaque);


function buscarPor(e) {
    const respuesta = e.target.value;
    const buscarNombre = document.querySelector('.buscarnombre');
    const buscarGeneracion = document.querySelector('.generacion');

    if (respuesta === 'nombre') {
        buscarGeneracion.style.display = 'none';
        buscarNombre.style.display = 'flex';
    } else {
        buscarNombre.style.display = 'none';
        buscarGeneracion.style.display = 'block';
    }

}

function buscarBoton(e) {

    e.preventDefault();
    const input = document.querySelector('#nombre');

    //obteniendo el nombre del pokemon del input tipo text
    const poke = input.value.toLowerCase().trim();

    //si no hay nombre de pokemon no continua la ejecución
    if (!poke) return;

    input.value = '';
    buscarPokemon(poke);
}
function buscarSelect(e) {
    //obteniendo el nombre del pokemon del select
    const poke = e.target.value.toLowerCase().trim();
    buscarPokemon(poke);
}
function selectGeneracion(e) {

    let opcion = e.target.value
    let criterio = '';

    if (opcion === 'primera') {
        criterio = 'limit=151&offset=0'
    }
    else if (opcion === 'segunda') {
        criterio = 'limit=100&offset=151';
    }
    else if (opcion === 'tercera') {
        criterio = 'limit=135&offset=251'
    }

    document.querySelector('.contenedor-lista-poke').style.display = "flex";
    traerGeneracion(criterio);
}

async function traerGeneracion(criterio) {

    const listaPokemons = document.querySelector('.lista-pokemons');

    //remover elementos hijos del select antes de buscar
    while (listaPokemons.firstChild) {
        listaPokemons.removeChild(listaPokemons.firstChild);
    }

    //consultadon la api llenando nuestro select con las opciones
    try {

        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?${criterio}`);
        const resultado = await respuesta.json();
        const { results } = resultado;


        results.forEach(pokemon => {
            let opcion = document.createElement('option');
            opcion.value = pokemon.name;
            opcion.textContent = pokemon.name.toUpperCase();
            opcion.classList.add('opcion-pokemon');
            listaPokemons.appendChild(opcion);
        });
    } catch (error) {
        console.log(error);
    }

}
async function buscarPokemon(poke) {

    const spinner = document.querySelector('.sk-cube-grid');
    const pokenonInfo = document.querySelector('.pokemon');
    const movimientosPokemon = document.querySelector('.pokemon-moves')
    const listaMovimientos = document.querySelector('.lista-monvientos');

    //buscando pokemon
    try {

        pokenonInfo.style.display = "none";
        movimientosPokemon.style.display = "none";
        listaMovimientos.innerHTML = ""; //borrar movientos anteriores

        //mostrardo spinner
        spinner.style.display = "block";

        let respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`);
        let datos = await respuesta.json();

        const { name, types, id, sprites, moves } = datos;

        //seleccionado dom para manipular
        const nombre = document.querySelector('.pokemon-name');
        const imagenF = document.querySelector('.img-pokemon');
        const tipo = document.querySelector('.tipo-pokemon');

        
        //cargando en la lista los primeros 10 movimientos
        for (let i = 0; i <= 10; i++) {
    
            let movimiento = document.createElement('li');
            movimiento.addEventListener('click', mostrarInfoAtaque);
            movimiento.setAttribute("id", `${moves[i].move.url}`);
            movimiento.textContent = moves[i].move.name.toUpperCase();
            listaMovimientos.appendChild(movimiento);
            
        }

        //modificando dom
        nombre.textContent = `Nº${id} - ${name.toUpperCase()}`
        imagenF.src = sprites.front_default;
        tipo.textContent = `Type: ${types[0].type.name} ${types[1] ? ' - ' + types[1].type.name : ''}`;


        //mostrarndo info de pokemon y ocultando spinner
        setTimeout(() => {
            spinner.style.display = "none";
            pokenonInfo.style.display = "block";
            movimientosPokemon.style.display = "block"
        }, 2000);


    } catch (error) {
        spinner.style.display = "none";
        pokenonInfo.style.display = "none";
        listaMovimientos.style.display = "none";
    }
}

//mostar modal de ataque
async function mostrarInfoAtaque(e) {
    //revisando id del <li> para consultar la api
    link = e.target.id;
    let respuesta = await fetch(link);
    let resultado = await respuesta.json();
    const { name, pp, accuracy, power, effect_entries } = resultado;

    let nombreAtaque = document.querySelector('.nombre-ataque');
    let poderAtaque = document.querySelector('.poder-ataque');
    let accuracyAtaque = document.querySelector('.accuracy-ataque');
    let ppAtaque = document.querySelector('.pp-ataque');
    let efecto = document.querySelector('.efecto');

    nombreAtaque.textContent = name.toUpperCase();
    poderAtaque.textContent = `Power: ${power}`;
    accuracyAtaque.textContent = `Accuracy: ${accuracy}`;
    ppAtaque.textContent = `PP: ${pp}`;
    efecto.textContent = effect_entries[0].effect;

    modal.style.display = 'block';
}
function cerrarInfoAtaque() {
    modal.style.display = 'none';
}