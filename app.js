import { db } from "./data/db.js";
import { cargarDB } from "./storage/storage.js";
import {
  crearUsuario,
  modificarUsuario,
  eliminarUsuario,
} from "./modules/usuarios/usuario.services.js";
import {
  crearFuncion,
  eliminarFuncion,
} from "./modules/funcionalidades/funcionalidades.services.js";

import {
  crearEvento,
  agregarParticipante,
} from "./modules/eventos/eventos.services.js";
import { identificarUsuario } from "./modules/usuarios/usuario.selectors.js";

import { buscarEvento } from "./modules/eventos/eventos.selectors.js";

const dbGuardada = cargarDB();
if (dbGuardada) {
  Object.assign(db, dbGuardada);
}

console.log("_________La base antes  _________");
console.log(db);
console.log("___________________________________________");

console.log("___________________________________________");
console.log("");
console.log("_________Esta es tu nueva base de datos_________");
console.log(db);
