export class Eventos {
  constructor(usuarioId, titulo, descripcion, fecha) {
    this.id =
      Date.now().toString(36).slice(0, 4).toUpperCase() +
      Math.floor(Math.random() * 1000) +
      usuarioId
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .substr(0, 2)
        .toUpperCase();
    this.usuarioId = usuarioId;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.participantes;
  }

  getId() {
    return this.id;
  }

  getUsuarioId() {
    return this.usuarioId;
  }

  getEvento() {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      titulo: this.titulo,
      descripcion: this.descripcion,
      fecha: this.fecha,
      participantes: this.participantes,
    };
  }
}
