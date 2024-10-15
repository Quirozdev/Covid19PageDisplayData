const selectorEstado = document.getElementById("selector-estado");

const elementoCargando = document.querySelector(".cargando");
const mensajeError = document.querySelector(".mensaje-error");

const tituloNombreEstado = document.getElementById("nombre-estado");

const seccionDatos = document.getElementById("datos");
const casosConfirmadosParrafo = document.getElementById("casos-confirmados");
const casosProbablesParrafo = document.getElementById("casos-probables");
const hospitalizacionesParrafo = document.getElementById("hospitalizaciones");
const recuperacionesParrafo = document.getElementById("recuperaciones");
const muertesParrafo = document.getElementById("muertes");

// para llenar el select con los estados cargados de la API
obtenerEstados().then((estados) => {
  estados.forEach((estado) => {
    const opcionEstado = document.createElement("option");
    // state representa el codigo del estado y name su nombre
    opcionEstado.value = estado.state;
    opcionEstado.textContent = estado.name;
    // se van agregando los option al select
    selectorEstado.append(opcionEstado);
  });
});

selectorEstado.addEventListener("change", async (e) => {
  // en minusculas porque asi lo pide la API y esta lo regresa en mayusculas
  const codigoEstado = selectorEstado.value.toLowerCase();
  try {
    mensajeError.classList.add("oculto");
    elementoCargando.classList.remove("oculto");
    seccionDatos.classList.add("oculto");
    const datos = await obtenerDatos(codigoEstado);
    tituloNombreEstado.textContent =
      selectorEstado.options[selectorEstado.selectedIndex].text;
    casosConfirmadosParrafo.textContent = formatearNumero(datos.positive);
    casosProbablesParrafo.textContent = formatearNumero(datos.probableCases);
    hospitalizacionesParrafo.textContent = formatearNumero(
      datos.hospitalizedCurrently
    );
    recuperacionesParrafo.textContent = formatearNumero(datos.recovered);
    muertesParrafo.textContent = formatearNumero(datos.death);
    // para mostrar la seccion de datos cuando se cargan los datos
    seccionDatos.classList.remove("oculto");
  } catch (error) {
    mensajeError.textContent = "Algo salió mal: " + error.message;
    mensajeError.classList.remove("oculto");
  } finally {
    elementoCargando.classList.add("oculto");
  }
});

async function obtenerEstados() {
  const response = await fetch(
    `https://api.covidtracking.com/v1/states/info.json`
  );
  if (!response.ok) {
    throw new Error(
      "Algo salió mal al realizar la petición, vuelve a intentarlo"
    );
  }
  const estados = await response.json();
  return estados;
}

async function obtenerDatos(codigoEstado) {
  const response = await fetch(
    `https://api.covidtracking.com/v1/states/${codigoEstado}/current.json`
  );
  if (!response.ok) {
    throw new Error("Algo salió mal al realizar la petición");
  }
  const datos = await response.json();
  return datos;
}

function formatearNumero(numero) {
  return new Intl.NumberFormat("en-US").format(numero);
}
