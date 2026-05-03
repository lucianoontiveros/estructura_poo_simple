import { db } from "../../data/db.js";
import { Usuario } from "../../models/usuario.js";
import { identificarUsuario } from "./usuario.selectors.js";
import { eliminarEventoUsuarioId } from "../eventos/eventos.services.js";
import { guardarDB } from "../../storage/storage.js";

const crearUsuario = (nombre, apellido, area, cargo, sueldo, sede) => {
  let nuevoUsuario = new Usuario(nombre, apellido, area, cargo, sueldo, sede);
  db.usuarios.byId[nuevoUsuario.getId()] = nuevoUsuario.getUsuario();
  db.usuarios.allIds.push(nuevoUsuario.getId());
  console.log("Usuario creado:", db.usuarios.byId[nuevoUsuario.getId()]);

  console.log("ID:", nuevoUsuario.getId());
  guardarDB(db);
  return nuevoUsuario;
};

const modificarUsuario = (usuarioId, dato, nuevosDatos) => {
  let usuario = identificarUsuario(usuarioId);

  if (!usuario) {
    console.log("El usuario con el ID: " + usuarioId);
    return;
  }

  usuario[dato] = nuevosDatos;
  console.log("El dato " + dato + " fue cambio por " + usuario[dato]);

  guardarDB(db);
  return usuario;
};

const eliminarUsuario = (usuarioId) => {
  let usuario = identificarUsuario(usuarioId);

  if (!usuario) {
    console.log("El usuario indicado no existe: " + usuarioId);
    return;
  }

  console.log(
    `Se eliminó el usuario: ${usuario.nombre} ${usuario.apellido} ${usuario.id}`
  );

  delete db.usuarios.byId[usuarioId];
  db.usuarios.allIds = db.usuarios.allIds.filter((id) => id !== usuarioId);
  eliminarEventoUsuarioId(usuarioId);
  return;
};

export { crearUsuario, modificarUsuario, eliminarUsuario };
