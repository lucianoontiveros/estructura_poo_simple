import { db } from "../../data/db.js";
import { funciones } from "../../models/funciones.js";
import { guardarDB } from "../../storage/storage.js";

const crearFuncion = (
  usuarioId,
  tarea,
  descripcion,
  area,
  tipo,
  supervisor
) => {
  const nuevaFuncion = new funciones(
    usuarioId,
    tarea,
    descripcion,
    area,
    tipo,
    supervisor
  );
  db.funciones.byId[nuevaFuncion.getId()] = nuevaFuncion.getFuncion();
  db.funciones.allIds.push(nuevaFuncion.getId());
  if (!db.funciones.byUsuario[nuevaFuncion.getIdUser()]) {
    db.funciones.byUsuario[nuevaFuncion.getIdUser()] = [];
  }

  db.funciones.byUsuario[nuevaFuncion.getIdUser()].push(nuevaFuncion);
  guardarDB(db);
  return nuevaFuncion;
};

const eliminarFuncion = (funcionId) => {};

export { crearFuncion, eliminarFuncion };
