export class funciones {
  #funcionId;
  #usuarioId;
  #tarea;
  #descripcion;
  #area;
  #tipo;
  #supervisor;

  constructor(usuarioId, tarea, descripcion, area, tipo, supervisor) {
    this.#funcionId =
      Date.now().toString(36).slice(0, 4).toUpperCase() +
      Math.floor(Math.random() * 1000);
    this.#usuarioId = usuarioId;
    this.#tarea = tarea;
    this.#descripcion = descripcion;
    this.#area = area;
    this.#tipo = tipo;
    this.#supervisor = supervisor;
  }
  // Getters
  getId() {
    return this.#funcionId;
  }

  getIdUser() {
    return this.#usuarioId;
  }

  getFuncion() {
    return {
      id: this.#funcionId,
      usuarioId: this.getId(),
      tarea: this.#tarea,
      descripcion: this.#descripcion,
      area: this.#area,
      tipo: this.#tipo,
      supervisor: this.#supervisor,
    };
  }
}
