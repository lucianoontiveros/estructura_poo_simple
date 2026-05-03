import { db } from "../../data/db.js";
import { Usuario } from "../../models/usuario.js";

const identificarUsuario = (usuarioId) => {
  return db.usuarios.byId[usuarioId];
};

export { identificarUsuario };
