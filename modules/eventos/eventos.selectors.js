import { db } from "../../data/db.js";

const buscarEvento = (eventoId) => {
  let evento = db.eventos.byId[eventoId];
  return evento;
};

const buscarEventoUsuario = (usuarioId) => {
  let evento = db.eventos.byUsuario[usuarioId];
  return evento;
};

export { buscarEvento, buscarEventoUsuario };
