export class Usuario {
  #id;
  #nombre;
  #apellido;
  #area;
  #cargo;
  #sueldo;
  #sede;

  constructor(nombre, apellido, area, cargo, sueldo, sede) {
    this.#id =
      apellido
        .normalize("NFD".replace(/[\u0300-\u036f]/g, ""))
        .substr(0, 2)
        .toUpperCase() +
      Date.now().toString(36).slice(0, 4).toUpperCase() +
      Math.floor(Math.random() * 1000);
    this.#nombre = nombre;
    this.#apellido = apellido;
    this.#area = area;
    this.#cargo = cargo;
    this.#sueldo = sueldo;
    this.#sede = sede;
  }

  getNombres() {
    return `${this.#nombre} ${this.#apellido}`;
  }

  getId() {
    return this.#id;
  }

  getUsuario() {
    return {
      id: this.#id,
      nombre: this.#nombre,
      apellido: this.#apellido,
      area: this.#area,
      cargo: this.#cargo,
      sueldo: this.#sueldo,
      sede: this.#sede,
    };
  }
}
