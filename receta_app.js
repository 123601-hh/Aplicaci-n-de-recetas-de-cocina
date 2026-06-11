//PRIMERO VAMOS A AÑADIR UNOS DATOS INICIALES PARA PROBAR NUESTRA APLICACIÓN
//ESTOS DATOS LOS VAMOS A GUARDAR EN UN ARRAY DE OBJETOS
const recetasIniciales = [
    {
        id: 1,
        titulo: "Espaguetis Carbonara",
        categoria: "pasta",
        imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
        calorias: 400,
        proteinas: 25,
        carbohidratos: 50,
        grasas: 15,
        ingredientes: [
            "200g de espaguetis",
            "100g de panceta",
            "2 huevos",
            "50g de queso parmesano",
            "Sal y pimienta al gusto"
        ],
        instrucciones: [
            "Cocina los espaguetis según las instrucciones del paquete.",
            "En una sartén, cocina la panceta hasta que esté crujiente.",
            "En un bol, bate los huevos y mezcla con el queso parmesano.",
            "Escurre los espaguetis y mézclalos con la panceta y la mezcla de huevo y queso.",
            "Sazona con sal y pimienta al gusto. Sirve inmediatamente."
        ]
    },

    {
        id: 2,
        titulo: "Tacos de Carnitas",
        categoria: "otras",
        imagen: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=500",
        calorias: 300,
        proteinas: 20,
        carbohidratos: 30,
        grasas: 10,
        ingredientes: [
            "200g de carne de cerdo deshebrada",
            "8 tortillas de maíz",
            "1 cebolla picada",
            "Cilantro al gusto",
            "Salsa al gusto"
        ],
        instrucciones: [
            "Calienta las tortillas de maíz.",
            "En cada tortilla, coloca una porción de carne de cerdo deshebrada.",
            "Añade cebolla picada, cilantro y salsa al gusto.",
            "Sirve los tacos inmediatamente."
        ]
    },
    {
        id: 3,
        titulo: "Ensalada César",
        categoria: "ensaladas",
        imagen: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/b876d8ea-fc9b-4b04-9958-9c70fe1c74e0/Derivates/fb3399fa-df15-4d0d-9beb-83a79a37a16e.jpg",
        calorias: 250,
        proteinas: 10,
        carbohidratos: 20,
        grasas: 10,
        ingredientes: [
            "1 lechuga romana",
            "100g de pollo a la parrilla",
            "50g de queso parmesano",
            "Croutons al gusto",
            "Aderezo César al gusto"
        ],
        instrucciones: [
            "Lava y corta la lechuga romana.",
            "Corta el pollo a la parrilla en tiras.",
            "En un bol grande, mezcla la lechuga, el pollo, el queso parmesano y los croutons.",
            "Añade el aderezo César al gusto y mezcla bien. Sirve inmediatamente."
        ]
    }
]

//Al inicio, es verdad que no habrá ninguna receta guardada al navegador, pero para cuando si hay y se ejecuta otra vez, hay que comprobar si ya hay o no recetas guardadas, para no sobreescribirlas cada vez que se ejecute el código. Por eso, vamos a comprobar si ya hay recetas guardadas en el localStorage, y si no las hay, entonces guardamos las recetas iniciales.
if (!localStorage.getItem('recetas')) {
    localStorage.setItem('recetas', JSON.stringify(recetasIniciales));
}

//-----VARIABLAS GLOBALES-----
//Cargamos las recetas del LocalStorage, si no hay ninguna receta guardada, se inicializa como un array vacío. Esto permite que la aplicación funcione correctamente incluso si el usuario no ha agregado ninguna receta todavía.
let listaRecetas = JSON.parse(localStorage.getItem('recetas'));
//El filtro de búsqueda se inicializa con el valor 'all', lo que significa que al inicio se mostrarán todas las recetas sin aplicar ningún filtro. Cuando el usuario seleccione una categoría específica para filtrar las recetas, esta variable se actualizará con el valor de esa categoría, y la aplicación mostrará solo las recetas que pertenezcan a esa categoría.
let filtroCategoria = 'all';
//No hay ninguna receta seleccionada al inicio, por lo que esta variable se inicializa como null. Cuando el usuario seleccione una receta para ver sus detalles, esta variable se actualizará con la información de esa receta.
let recetaSeleccionada = null;

//Es el contenedor donde se mostrarán las recetas en la página. 
const contenedorRecetas = document.getElementById('recipes-container');


//----MOSTRAR RECETAS-----

function mostrarRecetas(lista) {
    //Limpiamos el contenedor de recetas antes de mostrar las nuevas recetas filtradas. Esto asegura que solo se muestren las recetas que cumplen con el filtro seleccionado
    contenedorRecetas.innerHTML = '';

    //Si la lista es vacía, mostramos un mensaje indicando que no se encontraron recetas.
    if (lista.length === 0) {
        contenedorRecetas.innerHTML = '<p style="text-align:center; padding:40px;">No se encontraron recetas.</p>';
        return;
    }

    //Recorremos cada receta
    for (var i = 0; i < lista.length; i++) {
        var receta = lista[i];

        // Creamos el elemento article para la tarjeta (usamos article igual que en el HTML original)
        var tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-receta');

        // Dentro de cada tarjeta, añadimos la imagen, etiqueta, título, nutrición y botón ver receta
        // Igual que la estructura que había en el HTML original
        tarjeta.innerHTML =
            '<div class="imagen-receta">' +
                '<img src="' + receta.imagen + '" alt="' + receta.titulo + '" onerror="this.src=\'https://placehold.co/400x300?text=Sin+Imagen\'">' +
                '<span class="etiqueta">' + receta.categoria + '</span>' +
            '</div>' +
            '<div class="info-receta">' +
                '<h3>' + receta.titulo + '</h3>' +
                '<div class="info-nutricion">' +
                    '<span>🔥 ' + receta.calorias + ' kcal</span>' +
                    '<span>💪 ' + receta.proteinas + 'g Prot</span>' +
                '</div>' +
                '<div class="pie-tarjeta">' +
                    '<button class="btn-ver" onclick="abrirModal(' + receta.id + ')">Ver Receta</button>' +
                '</div>' +
            '</div>';

        contenedorRecetas.appendChild(tarjeta);
    }
}


//----BUSCADOR DE RECETAS-----
//ada vez que el usuario escribe, filtramos las recetas
document.getElementById('search-input').addEventListener('input', function() {
 
    var textoBuscado = this.value.toLowerCase();

    // Creamos un array vacío donde iremos metiendo las recetas que coincidan
    var resultado = [];

    for (var i = 0; i < listaRecetas.length; i++) {
        var receta = listaRecetas[i];

        // Comprobamos si el título contiene el texto buscado
        var coincideTitulo = receta.titulo.toLowerCase().includes(textoBuscado);

        // Comprobamos si algún ingrediente contiene el texto buscado
        var coincideIngrediente = false;
        for (var j = 0; j < receta.ingredientes.length; j++) {
            if (receta.ingredientes[j].toLowerCase().includes(textoBuscado)) {
                coincideIngrediente = true;
            }
        }

        // Si coincide en título O en ingredientes, la añadimos al resultado
        if (coincideTitulo || coincideIngrediente) {
            resultado.push(receta);
        }
    }

    // Aplicamos también el filtro de categoría activo
    mostrarRecetas(filtrarPorCategoria(resultado));
});

//----FILTRO DE CATEGORÍA-----
var botonesCat = document.querySelectorAll('.btn-cat');

for (var i = 0; i < botonesCat.length; i++) {
    botonesCat[i].addEventListener('click', function() {

        // Quitamos 'activo' de todos los botones
        for (var j = 0; j < botonesCat.length; j++) {
            botonesCat[j].classList.remove('activo');
        }

        // Se lo añadimos al botón pulsado
        this.classList.add('activo');

        // Guardamos qué categoría se ha seleccionado
        filtroCategoria = this.getAttribute('data-category');

        // Volvemos a filtrar teniendo en cuenta también el buscador
        var textoBuscado = document.getElementById('search-input').value.toLowerCase();
        var resultado = [];

        for (var k = 0; k < listaRecetas.length; k++) {
            var receta = listaRecetas[k];
            var coincideTitulo = receta.titulo.toLowerCase().includes(textoBuscado);
            var coincideIngrediente = false;

            for (var m = 0; m < receta.ingredientes.length; m++) {
                if (receta.ingredientes[m].toLowerCase().includes(textoBuscado)) {
                    coincideIngrediente = true;
                }
            }

            if (coincideTitulo || coincideIngrediente) {
                resultado.push(receta);
            }
        }

        mostrarRecetas(filtrarPorCategoria(resultado));
    });
}

// Función que devuelve solo las recetas de la categoría activa
function filtrarPorCategoria(lista) {
    if (filtroCategoria === 'all') {
        return lista;
    }

    var resultado = [];
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].categoria === filtroCategoria) {
            resultado.push(lista[i]);
        }
    }
    return resultado;
}

//----MODAL DE DETALLES DE RECETA-----
//El HTML de las tarjetas llama a abrirModal(id) al hacer click en "ver recta" para mirar los en detalle
var modalReceta = document.getElementById('recipe-modal');

function abrirModal(idReceta) {
    // Buscamos la receta que coincide con el id que se ha pasado
    recetaSeleccionado = null;
    for (var i = 0; i < listaRecetas.length; i++) {
        if (listaRecetas[i].id === idReceta) {
            recetaSeleccionada = listaRecetas[i];
        }
    }
    
    // Si no se encuentra la receta, salimos de la función
    if (!recetaSeleccionada) {
        alert('Receta no encontrada');
        return;
    }

    //Rellenamos el contenido del modal con la información de la receta seleccionada
    document.getElementById('modal-recipe-img').src = recetaSeleccionada.imagen;
    document.getElementById('modal-recipe-title').textContent = recetaSeleccionada.titulo;
    document.getElementById('nut-cal').textContent = recetaSeleccionada.calorias + ' kcal'; 
    document.getElementById('nut-carbs').textContent = recetaSeleccionada.carbohidratos + 'g';
    document.getElementById('nut-protein').textContent = recetaSeleccionada.proteinas + 'g';
    document.getElementById('nut-fat').textContent = recetaSeleccionada.grasas + 'g';
   // Rellenamos los ingredientes  creando elementos li por cada uno
    var ingredientesList = document.getElementById('modal-ingredients-list');
    ingredientesList.innerHTML = '';
    for (var j = 0; j < recetaSeleccionada.ingredientes.length; j++) {
        var li = document.createElement('li');
        li.textContent = recetaSeleccionada.ingredientes[j]; // Creamos un elemento de lista para cada ingrediente y le asignamos el texto del ingrediente correspondiente
        ingredientesList.appendChild(li); // Añadimos cada ingrediente a la lista del modal
    }
    // Rellenamos las instrucciones creando elementos li por cada uno
    var listaInstrucciones = document.getElementById('modal-instructions-list');
    listaInstrucciones.innerHTML = '';
    for (var i = 0; i < recetaSeleccionada.instrucciones.length; i++) {
        var li = document.createElement('li');
        li.textContent = recetaSeleccionada.instrucciones[i];
        listaInstrucciones.appendChild(li);
    }

    // Abrimos el modal (el CSS lo hace visible al añadir la clase 'abierto')
    modalReceta.classList.add('abierto');
    document.body.style.overflow = 'hidden'; // Bloqueamos el scroll del fondo
}
// Función para cerrar el modal, que se llama tanto al hacer click en el botón de cerrar como al hacer click en el fondo oscuro del modal

function cerrarModal() {
    modalReceta.classList.remove('abierto');
    document.body.style.overflow = '';
    recetaSeleccionada = null;
}

// Botón X para cerrar el modal
document.getElementById('close-recipe-modal').addEventListener('click', cerrarModal);

// Si el usuario hace click en el fondo oscuro, también cerramos
modalReceta.addEventListener('click', function(evento) {
    if (evento.target === modalReceta) {
        cerrarModal();
    }
});


//---FORMULARIO PARA AÑADIR NUEVAS RECETAS-----
var modalFormulario = document.getElementById('form-modal');
var btnAbrirFormulario = document.getElementById('btn-nueva-receta');
var btnCerrarFormulario = document.getElementById('close-form-modal');
var formularioNuevo = document.getElementById('new-recipe-form');

// Al hacer click en el botón de "Nueva Receta", se muestra el formulario modal para añadir una nueva receta.
btnAbrirFormulario.addEventListener('click', function() {
    modalFormulario.classList.add('abierto');
    document.body.style.overflow = 'hidden'; // Evita que el fondo se desplace cuando el modal está abierto
});

// Al hacer click en el botón de cerrar del formulario modal, se oculta el formulario
btnCerrarFormulario.addEventListener('click', function() {
    modalFormulario.classList.remove('abierto');
    document.body.style.overflow = ''; 
});

// Al enviar el formulario para añadir una nueva receta, se procesa la información ingresada por el usuario, se crea un nuevo objeto de receta con esa información, se añade a la lista de recetas, se guarda en el localStorage y se actualiza la visualización de las recetas en la página.
modalFormulario.addEventListener('click', function(evento) {
    if (evento.target === modalFormulario) {
        modalFormulario.classList.remove('abierto');
        document.body.style.overflow = ''; // Evita que el fondo se desplace cuando el modal está cerrado
    }
});

formularioNuevo.addEventListener('submit', function(evento) {
    // Evitamos que la pagina se recargue al enviar el formulario
    evento.preventDefault();

    // Recogemos los valores de cada campo
    var titulo = document.getElementById('form-title').value;
    var categoria = document.getElementById('form-category').value;
    var imagen = document.getElementById('form-img').value;
    var calorias = parseInt(document.getElementById('form-cal').value) || 0;
    var proteinas = parseInt(document.getElementById('form-protein').value) || 0;
    var carbohidratos = parseInt(document.getElementById('form-carbs').value) || 0;
    var grasas = parseInt(document.getElementById('form-fat').value) || 0;

    // Los ingredientes los separaremos por coma
    var ingredientes = document.getElementById('form-ingredients').value.split(',');

    //Las insstrucciones los separaremos por salto de linea
    var instrucciones = document.getElementById('form-instructions').value.split('\n');

    //Comprobamos que el título y la categoría no estén vacíos, ya que son campos obligatorios para crear una receta. Si alguno de estos campos está vacío, se muestra una alerta al usuario indicando que debe completar esos campos antes de poder añadir la receta.
    if (titulo.trim() === '' || categoria.trim() === '') { // trim() elimina los espacios en blanco al inicio y al final del texto, para asegurarnos de que el usuario no ingrese solo espacios en blanco como título o categoría.
        alert('Por favor, completa el título y la categoría de la receta.');
        return;
    }

    //Creamos un objeto con la información de la nueva receta, asignándole un ID único basado en date.now() porque genera un numero unico cada vez
    var nuevaReceta = {
        id: Date.now(),
        titulo: titulo,
        categoria: categoria,
        imagen: imagen || 'https://via.placeholder.com/500x300?text=Sin+Imagen', // Si no se proporciona una URL de imagen, se asigna una imagen por defecto.
        calorias: calorias,
        proteinas: proteinas,
        carbohidratos: carbohidratos,
        grasas: grasas,
        ingredientes: ingredientes,
        instrucciones: instrucciones,
    };

    //Añadimos la recera en el array y lo guardamos en el LocalStorage
    listaRecetas.push(nuevaReceta);
    localStorage.setItem('recetas', JSON.stringify(listaRecetas));

    //Actualizamos la pantalla para que se vea la nueva receta y cerramos el modal
    mostrarRecetas(filtrarPorCategoria(listaRecetas));
    modalFormulario.classList.remove('abierto');
    document.body.style.overflow = 'hidden';
    formularioNuevo.reset(); // Limpiamos el formulario para la próxima vez que se abra

    alert('¡Receta añadida con éxito!'); // Mostramos una alerta para confirmar que la receta se ha añadido correctamente
});


//----MODO OSCURO-----
var botonModo = document.getElementById('theme-toggle');
//Al hacer click en el botón de modo, se cambia el tema de la página y se guarda la preferencia en localStorage
botonModo.addEventListener("click", function() {
    const esOscuro = document.body.classList.toggle("dark-mode");//toggle añade la clase si no está, y la quita si ya está
    
    if (esOscuro) {
         botonModo.textContent = '☀️ Modo Claro';
        localStorage.setItem('modo', 'oscuro');
    } else {
       botonModo.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('modo', 'claro');
    }
});

//Al cargar la página, se comprueba si hay una preferencia de modo guardada en localStorage y se aplica el tema correspondiente
function cargarModoPantalla() {
    if (localStorage.getItem("modo") === "oscuro") {
        document.body.classList.add("dark-mode");
        botonModo.textContent="☀️ Modo Claro"
    } else {
        document.body.classList.remove("dark-mode");
        botonModo.textContent="🌙 Modo Oscuro"
    }
}

//------ARRANQUE PRINCIPAL DE LA APLICACIÓN-----
cargarModoPantalla();
mostrarRecetas(listaRecetas);


