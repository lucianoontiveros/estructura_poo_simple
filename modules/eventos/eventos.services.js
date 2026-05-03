import { db } from "../../data/db.js";
import { Eventos } from "../../models/eventos.js";
import { guardarDB } from "../../storage/storage.js";
import { buscarEvento, buscarEventoUsuario } from "./eventos.selectors.js";

const fechaActual = () => {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();

  return `${dia}-${mes}-${anio}`;
};

// CREAR EVENTOS
const crearEvento = (usuarioId, titulo, descripcion, fecha) => {
  let nuevoEvento = new Eventos(usuarioId, titulo, descripcion, fecha);
  nuevoEvento.participantes = [usuarioId];
  //agregado byId el evento en texto plano
  db.eventos.byId[nuevoEvento.getId()] = nuevoEvento.getEvento();
  // agregando byUsuario el usuario con el evento.
  db.eventos.allIds.push(nuevoEvento.getId());
  //Aquí nos aseguramos si el usuario no esta agregado con su ID y lo agregamos con un array vacio.
  if (!db.eventos.byUsuario[nuevoEvento.getUsuarioId()]) {
    db.eventos.byUsuario[nuevoEvento.getUsuarioId()] = [];
  }
  //Aquí agregamos el el evento Id en texto plando.
  db.eventos.byUsuario[nuevoEvento.getUsuarioId()].push(nuevoEvento.getId());

  console.log("------------------------------------------");
  console.log(
    "Nuevo evento a nombre de usaurio: " + nuevoEvento.getUsuarioId()
  );
  guardarDB(db);
  return nuevoEvento;
};

// AGREGAR PARTICIPANTES
const agregarParticipante = (eventoId, usuarioId) => {
  //Buscamos en primera instancia el evento para ver si existe.
  let evento = buscarEvento(eventoId);
  if (!evento) {
    console.log(
      "El evento indicado no existe, por favor corroborar id: " + eventoId
    );
    return;
  }
  // Comprobar si está incluido el usuario dentro del evento para agregarlos
  if (!evento.participantes.includes(usuarioId)) {
    evento.participantes.push(usuarioId);
  }
  // Comprobar si no existe el usuario dentro ByUsuario por evento y agregarlo en caso que no.
  if (!db.eventos.byUsuario[usuarioId]) {
    db.eventos.byUsuario[usuarioId] = [];
  }
  // comporobar si el usuario no tiene ya el evento mencionado dentro de su array
  if (!db.eventos.byUsuario[usuarioId].includes(eventoId)) {
    db.eventos.byUsuario[usuarioId].push(eventoId);
  } else {
    console.log("El usuario ya está relacionado al evento");
  }
};

const notificarCancelacion = (evento, usuarioId) => {
  // Notificación para avisar que el evento se cancelo.
  if (!evento.participantes?.length) {
    console.log("El evento no tenía participantes");
  } else {
    // creamos los datos del nuevo evento.
    let titulo = "El evento se ha cancelado " + evento.titulo;
    let descripcion = "Se suspende el evento indicado como: " + evento.titulo;
    let usuarioNotificacion =
      evento.participantes.find((id) => id !== usuarioId) || "NT000000";

    if (usuarioNotificacion) {
      let eventoNotificacion = crearEvento(
        usuarioNotificacion,
        titulo,
        descripcion,
        fechaActual()
      );
      //Aquí extraigo los usuarios del evento anterior
      let usuariosNuevoEvento = evento.participantes.filter(
        (id) => id !== usuarioId
      );
      //Aquí agrego a todos los usuarios que forman parte del nuevo evento notifiacion
      usuariosNuevoEvento.forEach((notificar) => {
        agregarParticipante(eventoNotificacion.getId(), notificar);
      });
      console.log("El evento suspendido a notificar: " + evento.id);
      console.log("Evento notificación creado: " + eventoNotificacion.id);
    }
  }
};

// ELIMINAR EVENTO POR USUARIO viene de usaurio.service.js LA ENTRADA
const eliminarEventoUsuarioId = (usuarioId) => {
  // Verificamos si el usuario tiene eventos relacionados: byUsuario.
  let usuarioEventos = buscarEventoUsuario(usuarioId);
  if (!usuarioEventos) {
    console.log("El usuario no tenía eventos a participar");
    return;
  }
  console.log("El usuario tiene eventos relacionados, procedemos a eliminar");
  // Buscamos todos los eventos relacionados con el usuario en byUsuario.
  usuarioEventos.forEach((id) => {
    let evento = buscarEvento(id);
    console.log("el evento a notificar anulado :" + evento.titulo);
    // notificamos la anulacion
    notificarCancelacion(evento, usuarioId);
    eliminarEvento(evento.id);
  });
  //Eliminamos evento de byUsuario.
  delete db.eventos.byUsuario[usuarioId];
  guardarDB(db);
};

// ELIMINAR EVENTO POR ID
const eliminarEvento = (eventoId) => {
  delete db.eventos.byId[eventoId];
  db.eventos.allIds = db.eventos.allIds.filter((id) => id !== eventoId);

  let usuarios = Object.keys(db.eventos.byUsuario);
  usuarios.forEach((usuario) => {
    let eventosVigentes = db.eventos.byUsuario[usuario].filter(
      (evento) => evento !== eventoId
    );
    db.eventos.byUsuario[usuario] = eventosVigentes;
  });
  console.log("El usuario ya no tiene eventos relacionados");
  guardarDB(db);
};

export { crearEvento, agregarParticipante, eliminarEventoUsuarioId };
