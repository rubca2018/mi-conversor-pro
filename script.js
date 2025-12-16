// 1. Base de datos de factores de conversión
// Todos los factores son relativos a una unidad base por categoría (ej. metros, kilogramos, watts)
const datosConversion = {
    longitud: {
        unidades: {
            metro: { nombre: 'Metros (m)', factor: 1 },
            kilometro: { nombre: 'Kilómetros (km)', factor: 1000 },
            centimetro: { nombre: 'Centímetros (cm)', factor: 0.01 },
            milimetro: { nombre: 'Milímetros (mm)', factor: 0.001 },
            pie: { nombre: 'Pies (ft)', factor: 0.3048 },
            pulgada: { nombre: 'Pulgadas (in)', factor: 0.0254 },
            yarda: { nombre: 'Yardas (yd)', factor: 0.9144 },
            milla: { nombre: 'Millas (mi)', factor: 1609.34 }
        }
    },
    peso: {
        unidades: {
            kilogramo: { nombre: 'Kilogramos (kg)', factor: 1 },
            gramo: { nombre: 'Gramos (g)', factor: 0.001 },
            miligramo: { nombre: 'Miligramos (mg)', factor: 0.000001 },
            libra: { nombre: 'Libras (lb)', factor: 0.453592 },
            onza: { nombre: 'Onzas (oz)', factor: 0.0283495 },
            tonelada: { nombre: 'Toneladas (t)', factor: 1000 }
        }
    },
    area: {
        unidades: {
            metro_cuadrado: { nombre: 'Metros Cuadrados (m²)', factor: 1 },
            hectarea: { nombre: 'Hectáreas (ha)', factor: 10000 },
            kilometro_cuadrado: { nombre: 'Kilómetros Cuadrados (km²)', factor: 1000000 },
            pie_cuadrado: { nombre: 'Pies Cuadrados (ft²)', factor: 0.092903 },
            acre: { nombre: 'Acres', factor: 4046.86 }
        }
    },
    volumen: {
        unidades: {
            metro_cubico: { nombre: 'Metros Cúbicos (m³)', factor: 1 },
            litro: { nombre: 'Litros (L)', factor: 0.001 },
            mililitro: { nombre: 'Mililitros (ml)', factor: 0.000001 },
            galon: { nombre: 'Galones US (gal)', factor: 0.00378541 }
        }
    },
    potencia: {
        unidades: {
            watt: { nombre: 'Watts (W)', factor: 1 },
            kilowatt: { nombre: 'Kilowatts (kW)', factor: 1000 },
            megawatt: { nombre: 'Megawatts (MW)', factor: 1000000 },
            hp: { nombre: 'Caballos de Fuerza (HP)', factor: 745.7 }
        }
    },
    caudal: {
        unidades: {
            m3_s: { nombre: 'm³/segundo', factor: 1 },
            l_s: { nombre: 'Litros/segundo', factor: 0.001 },
            l_min: { nombre: 'Litros/minuto', factor: 0.0000166667 },
            m3_h: { nombre: 'm³/hora', factor: 0.000277778 },
            gpm: { nombre: 'Galones/min (GPM)', factor: 0.00006309 }
        }
    }
};

// Referencias al HTML
const selectCategoria = document.getElementById('categoria');
const selectOrigen = document.getElementById('unidadOrigen');
const selectDestino = document.getElementById('unidadDestino');
const inputCantidad = document.getElementById('cantidad');
const divResultado = document.getElementById('resultado');

// 2. Función para llenar los selectores (De/A) según la categoría
function actualizarUnidades() {
    const categoriaSeleccionada = selectCategoria.value;
    const unidades = datosConversion[categoriaSeleccionada].unidades;

    // Limpiar opciones anteriores
    selectOrigen.innerHTML = '';
    selectDestino.innerHTML = '';

    // Crear nuevas opciones
    for (const clave in unidades) {
        // Opción para "Origen"
        const opcionOrigen = document.createElement('option');
        opcionOrigen.value = clave;
        opcionOrigen.innerText = unidades[clave].nombre;
        selectOrigen.appendChild(opcionOrigen);

        // Opción para "Destino"
        const opcionDestino = document.createElement('option');
        opcionDestino.value = clave;
        opcionDestino.innerText = unidades[clave].nombre;
        selectDestino.appendChild(opcionDestino);
    }
    
    // Seleccionar por defecto la segunda opción en el destino para que sea diferente al origen
    selectDestino.selectedIndex = 1;
    
    convertir(); // Calcular inmediatamente
}

// 3. Función principal de conversión
function convertir() {
    const cantidad = parseFloat(inputCantidad.value);
    const categoria = selectCategoria.value;
    const origen = selectOrigen.value;
    const destino = selectDestino.value;

    if (isNaN(cantidad)) {
        divResultado.innerText = "---";
        return;
    }

    // Obtener factores
    const datos = datosConversion[categoria].unidades;
    const factorOrigen = datos[origen].factor;
    const factorDestino = datos[destino].factor;

    // Fórmula: (Cantidad * FactorOrigen) / FactorDestino
    // Ejemplo: 1 km a m -> (1 * 1000) / 1 = 1000
    const resultado = (cantidad * factorOrigen) / factorDestino;

    // Mostrar resultado (máximo 6 decimales si es necesario, o notación científica si es muy grande)
    let textoResultado;
    if (resultado > 1000000 || (resultado < 0.0001 && resultado > 0)) {
         textoResultado = resultado.toExponential(4);
    } else {
         // Quitar ceros innecesarios al final (ej: 5.500 -> 5.5)
         textoResultado = parseFloat(resultado.toFixed(6)); 
    }

    divResultado.innerText = `${textoResultado} ${datos[destino].nombre.split('(')[0].trim()}`;
}

// 4. Event Listeners (Automatización)
// Escuchar cambios en la categoría para recargar las unidades
selectCategoria.addEventListener('change', actualizarUnidades);

// Escuchar cambios en los valores para recalcular
inputCantidad.addEventListener('input', convertir);
selectOrigen.addEventListener('change', convertir);
selectDestino.addEventListener('change', convertir);

// Inicializar la app al cargar
actualizarUnidades();