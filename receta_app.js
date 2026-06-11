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
];

// Comprobamos si ya hay recetas guardadas en el localStorage para no sobrescribirlas
if (!localStorage.getItem('recetas')) {
    localStorage.setItem('recetas', JSON.stringify(recetasIniciales));
}

//-----VARIABLES GLOBALES-----
let listaRecetas = JSON.parse(localStorage.getItem('recetas')) || [];
let filtroCategoria = 'all';
let recetaSeleccionada = null;

const contenedorRecetas = document.getElementById('recipes-container');

//----MOSTRAR RECETAS-----
function mostrarRecetas(lista) {
    contenedorRecetas.innerHTML = '';

    if (lista.length === 0) {
        contenedorRecetas.innerHTML = '<p style="text-align:center; padding:40px;">No se encontraron recetas.</p>';
        return;
    }

    
    for (let i = 0; i < lista.length; i++) {
        const receta = lista[i];

        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-receta');

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
document.getElementById('search-input').addEventListener('input', function() {
    const textoBuscado = this.value.toLowerCase();
    const resultado = [];

    
    for (let i = 0; i < listaRecetas.length; i++) {
        const receta = listaRecetas[i];
        const coincideTitulo = receta.titulo.toLowerCase().includes(textoBuscado);
        let coincideIngrediente = false;

        for (let j = 0; j < receta.ingredientes.length; j++) {
            if (receta.ingredientes[j].toLowerCase().includes(textoBuscado)) {
                coincideIngrediente = true;
            }
        }

        if (coincideTitulo || coincideIngrediente) {
            resultado.push(receta);
        }
    }

    mostrarRecetas(filtrarPorCategoria(resultado));
});

//----FILTRO DE CATEGORÍA-----
const botonesCat = document.querySelectorAll('.btn-cat');


for (let i = 0; i < botonesCat.length; i++) {
    botonesCat[i].addEventListener('click', function() {

        for (let j = 0; j < botonesCat.length; j++) {
            botonesCat[j].classList.remove('activo');
        }

        this.classList.add('activo');
        filtroCategoria = this.getAttribute('data-category');

        const textoBuscado = document.getElementById('search-input').value.toLowerCase();
        const resultado = [];

        for (let k = 0; k < listaRecetas.length; k++) {
            const receta = listaRecetas[k];
            const coincideTitulo = receta.titulo.toLowerCase().includes(textoBuscado);
            let coincideIngrediente = false;

            for (let m = 0; m < receta.ingredientes.length; m++) {
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

function filtrarPorCategoria(lista) {
    if (filtroCategoria === 'all') {
        return lista;
    }

    const resultado = [];
  
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].categoria === filtroCategoria) {
            resultado.push(lista[i]);
        }
    }
    return resultado;
}

//----MODAL DE DETALLES DE RECETA-----
const modalReceta = document.getElementById('recipe-modal');

function abrirModal(idReceta) {
    recetaSeleccionada = null;
    
   
    for (let i = 0; i < listaRecetas.length; i++) {
        if (listaRecetas[i].id === idReceta) {
            recetaSeleccionada = listaRecetas[i];
        }
    }
    
    if (!recetaSeleccionada) {
        alert('Receta no encontrada');
        return;
    }

    document.getElementById('modal-recipe-img').src = recetaSeleccionada.imagen;
    document.getElementById('modal-recipe-title').textContent = recetaSeleccionada.titulo;
    document.getElementById('nut-cal').textContent = recetaSeleccionada.calorias + ' kcal'; 
    document.getElementById('nut-carbs').textContent = recetaSeleccionada.carbohidratos + 'g';
    document.getElementById('nut-protein').textContent = recetaSeleccionada.proteinas + 'g';
    document.getElementById('nut-fat').textContent = recetaSeleccionada.grasas + 'g';

    const ingredientesList = document.getElementById('modal-ingredients-list');
    ingredientesList.innerHTML = '';
   
    for (let j = 0; j < recetaSeleccionada.ingredientes.length; j++) {
        const li = document.createElement('li');
        li.textContent = recetaSeleccionada.ingredientes[j];
        ingredientesList.appendChild(li);
    }

    const listaInstrucciones = document.getElementById('modal-instructions-list');
    listaInstrucciones.innerHTML = '';
    
    for (let i = 0; i < recetaSeleccionada.instrucciones.length; i++) {
        const li = document.createElement('li');
        li.textContent = recetaSeleccionada.instrucciones[i];
        listaInstrucciones.appendChild(li);
    }

    modalReceta.classList.add('abierto');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    modalReceta.classList.remove('abierto');
    document.body.style.overflow = '';
    recetaSeleccionada = null;
}

document.getElementById('close-recipe-modal').addEventListener('click', cerrarModal);

modalReceta.addEventListener('click', function(evento) {
    if (evento.target === modalReceta) {
        cerrarModal();
    }
});

//---FORMULARIO PARA AÑADIR NUEVAS RECETAS-----
const modalFormulario = document.getElementById('form-modal');
const btnAbrirFormulario = document.getElementById('btn-nueva-receta');
const btnCerrarFormulario = document.getElementById('close-form-modal');
const formularioNuevo = document.getElementById('new-recipe-form');

btnAbrirFormulario.addEventListener('click', function() {
    modalFormulario.classList.add('abierto');
    document.body.style.overflow = 'hidden';
});

btnCerrarFormulario.addEventListener('click', function() {
    modalFormulario.classList.remove('abierto');
    document.body.style.overflow = ''; 
});

modalFormulario.addEventListener('click', function(evento) {
    if (evento.target === modalFormulario) {
        modalFormulario.classList.remove('abierto');
        document.body.style.overflow = '';
    }
});

formularioNuevo.addEventListener('submit', function(evento) {
    evento.preventDefault();

    
    const titulo = document.getElementById('form-title').value;
    const categorySel = document.getElementById('form-category').value;
    const imagen = document.getElementById('form-img').value;
    const calorias = parseInt(document.getElementById('form-cal').value) || 0;
    const proteinas = parseInt(document.getElementById('form-protein').value) || 0;
    const carbohidratos = parseInt(document.getElementById('form-carbs').value) || 0;
    const grasas = parseInt(document.getElementById('form-fat').value) || 0;

    const ingredientes = document.getElementById('form-ingredients').value.split(',');
    const instrucciones = document.getElementById('form-instructions').value.split('\n');

    if (titulo.trim() === '' || categorySel.trim() === '') {
        alert('Por favor, completa el título y la categoría de la receta.');
        return;
    }

    const nuevaReceta = {
        id: Date.now(),
        titulo: titulo,
        categoria: categorySel,
        imagen: imagen || 'https://placehold.co/500x300?text=Sin+Imagen',
        calorias: calorias,
        proteinas: proteinas,
        carbohidratos: carbohidratos,
        grasas: grasas,
        ingredientes: ingredientes,
        instrucciones: instrucciones,
    };

    listaRecetas.push(nuevaReceta);
    localStorage.setItem('recetas', JSON.stringify(listaRecetas));

    mostrarRecetas(filtrarPorCategoria(listaRecetas));
    modalFormulario.classList.remove('abierto');
    document.body.style.overflow = '';
    formularioNuevo.reset();

    alert('¡Receta añadida con éxito!');
});

//----MODO OSCURO-----
const botonModo = document.getElementById('theme-toggle');

botonModo.addEventListener("click", function() {
    const esOscuro = document.body.classList.toggle("dark-mode");
    
    if (esOscuro) {
         botonModo.textContent = '☀️ Modo Claro';
        localStorage.setItem('modo', 'oscuro');
    } else {
        botonModo.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('modo', 'claro');
    }
});

function cargarModoPantalla() {
    if (localStorage.getItem("modo") === "oscuro") {
        document.body.classList.add("dark-mode");
        botonModo.textContent="☀️ Modo Claro";
    } else {
        document.body.classList.remove("dark-mode");
        botonModo.textContent="🌙 Modo Oscuro";
    }
}

//------ARRANQUE PRINCIPAL DE LA APLICACIÓN-----
cargarModoPantalla();
mostrarRecetas(listaRecetas);



