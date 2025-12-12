// ===== CLASE PADRE =====
class Dato {
  constructor(descripcion, valor) {
    this._descripcion = descripcion;
    this._valor = valor;
  }

  get descripcion() {
    return this._descripcion;
  }
  set descripcion(descripcion) {
    this._descripcion = descripcion;
  }

  get valor() {
    return this._valor;
  }
  set valor(valor) {
    this._valor = valor;
  }
}

// ===== CLASES HIJAS =====
class Ingreso extends Dato {
  static contadorIngresos = 0;

  constructor(descripcion, valor) {
    super(descripcion, valor);
    this._id = ++Ingreso.contadorIngresos;
  }

  get id() {
    return this._id;
  }
}

class Egreso extends Dato {
  static contadorEgresos = 0;

  constructor(descripcion, valor) {
    super(descripcion, valor);
    this._id = ++Egreso.contadorEgresos;
  }

  get id() {
    return this._id;
  }
}

// ===== ARREGLOS GLOBALES =====
let ingresos = [
  new Ingreso("Salario", 2200),
  new Ingreso("Venta coche", 1500)
];

let egresos = [
  new Egreso("Renta departamento", 900),
  new Egreso("Ropa", 400)
];

// ===== FUNCIONES DE CÁLCULO =====
const totalIngresos = () => {
  let totalIngreso = 0;
  for (let ingreso of ingresos) {
    totalIngreso += ingreso.valor;
  }
  return totalIngreso;
};

const totalEgresos = () => {
  let totalEgreso = 0;
  for (let egreso of egresos) {
    totalEgreso += egreso.valor;
  }
  return totalEgreso;
};

const formatoMoneda = (valor) =>
  valor.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2
  });

const formatoPorcentaje = (valor) =>
  valor.toLocaleString("es-MX", {
    style: "percent",
    minimumFractionDigits: 2
  });

// ===== CABECERO =====
const cargarCabecero = () => {
  const presupuesto = totalIngresos() - totalEgresos();
  const porcentajeEgreso =
    totalIngresos() > 0 ? totalEgresos() / totalIngresos() : 0;

  document.getElementById("presupuesto").innerHTML =
    (presupuesto >= 0 ? "+ " : "- ") + formatoMoneda(Math.abs(presupuesto));

  document.getElementById("ingresos").innerHTML =
    "+ " + formatoMoneda(totalIngresos());

  document.getElementById("egresos").innerHTML =
    "- " + formatoMoneda(totalEgresos());

  document.getElementById("porcentaje").innerHTML =
    formatoPorcentaje(porcentajeEgreso);
};

// ===== LISTA DE INGRESOS =====
const cargarIngresos = () => {
  let ingresosHTML = "";
  for (let ingreso of ingresos) {
    ingresosHTML += crearIngresoHTML(ingreso);
  }
  document.getElementById("lista-ingresos").innerHTML = ingresosHTML;
};

const crearIngresoHTML = (ingreso) => {
  return `
    <div class="elemento limpiarEstilos">
      <div class="elemento_descripcion">${ingreso.descripcion}</div>
      <div class="derecha limpiarEstilos">
        <div class="elemento_valor">+ ${formatoMoneda(ingreso.valor)}</div>
        <div class="elemento_eliminar">
          <button class="elemento_eliminar_btn"
                  onclick="eliminarIngreso(${ingreso.id})">
            <ion-icon name="close-circle-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  `;
};

const eliminarIngreso = (id) => {
  const indiceEliminar = ingresos.findIndex(ingreso => ingreso.id === id);
  if (indiceEliminar >= 0) {
    ingresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
  }
};

// ===== LISTA DE EGRESOS =====
const cargarEgresos = () => {
  let egresosHTML = "";
  for (let egreso of egresos) {
    egresosHTML += crearEgresoHTML(egreso);
  }
  document.getElementById("lista-egresos").innerHTML = egresosHTML;
};

const crearEgresoHTML = (egreso) => {
  const porcentaje =
    totalIngresos() > 0 ? egreso.valor / totalIngresos() : 0;

  return `
    <div class="elemento limpiarEstilos">
      <div class="elemento_descripcion">${egreso.descripcion}</div>
      <div class="derecha limpiarEstilos">
        <div class="elemento_valor">- ${formatoMoneda(egreso.valor)}</div>
        <div class="elemento_porcentaje">
          ${formatoPorcentaje(porcentaje)}
        </div>
        <div class="elemento_eliminar">
          <button class="elemento_eliminar_btn"
                  onclick="eliminarEgreso(${egreso.id})">
            <ion-icon name="close-circle-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  `;
};

const eliminarEgreso = (id) => {
  const indiceEliminar = egresos.findIndex(egreso => egreso.id === id);
  if (indiceEliminar >= 0) {
    egresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarEgresos();
    cargarIngresos();
  }
};

// ===== FORMULARIO =====
const agregarDato = () => {
  const forma = document.getElementById("forma");
  const tipo = forma["tipo"].value;
  const descripcion = forma["descripcion"].value.trim();
  const valor = parseFloat(forma["valor"].value);

  if (descripcion !== "" && !isNaN(valor) && valor > 0) {
    if (tipo === "ingreso") {
      ingresos.push(new Ingreso(descripcion, valor));
      cargarIngresos();
    } else {
      egresos.push(new Egreso(descripcion, valor));
      cargarEgresos();
    }
    cargarCabecero();

    // limpiar campos
    forma["descripcion"].value = "";
    forma["valor"].value = "";
    forma["descripcion"].focus();
  } else {
    alert("Escribe una descripción y un valor mayor a 0");
  }
};

// ===== INICIALIZAR APP =====
const cargarApp = () => {
  cargarCabecero();
  cargarIngresos();
  cargarEgresos();
};
