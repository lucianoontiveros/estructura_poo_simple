# 🏢 Sistema de Gestión Empresarial con POO

Un proyecto completo de gestión empresarial desarrollado en JavaScript utilizando Programación Orientada a Objetos (POO) para administrar usuarios, eventos y funcionalidades dentro de una organización.

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Conceptos de POO Implementados](#conceptos-de-poo-implementados)
- [Arquitectura y Patrones de Diseño](#arquitectura-y-patrones-de-diseño)
- [Sistema de Base de Datos](#sistema-de-base-de-datos)
- [Gestión de Usuarios](#gestión-de-usuarios)
- [Gestión de Eventos](#gestión-de-eventos)
- [Gestión de Funcionalidades](#gestión-de-funcionalidades)
- [Persistencia de Datos](#persistencia-de-datos)
- [Guía de Aprendizaje POO](#guía-de-aprendizaje-poo)

## 🏗️ Estructura del Proyecto

```
JAVA POO/
├── app.js                    # Punto de entrada principal
├── db.json                   # Base de datos persistente
├── data/
│   └── db.js                # Estructura de la base de datos en memoria
├── models/                   # Clases y modelos POO
│   ├── usuario.js           # Clase Usuario
│   ├── eventos.js           # Clase Eventos
│   └── funciones.js         # Clase Funciones
├── modules/                  # Módulos de negocio
│   ├── usuarios/            # Gestión de usuarios
│   │   ├── usuario.services.js
│   │   └── usuario.selectors.js
│   ├── eventos/             # Gestión de eventos
│   │   ├── eventos.services.js
│   │   └── eventos.selectors.js
│   └── funcionalidades/     # Gestión de funcionalidades
│       ├── funcionalidades.services.js
└── storage/                  # Persistencia de datos
    └── storage.js           # Funciones de guardado/carga
```

## 🎯 Conceptos de POO Implementados

### 1. **Clases y Objetos**
El proyecto define tres clases principales que representan entidades del mundo real:

- **Clase `Usuario`**: Representa a los empleados de la empresa
- **Clase `Eventos`**: Representa reuniones y actividades organizacionales
- **Clase `funciones`**: Representa tareas y responsabilidades asignadas

### 2. **Encapsulamiento**
Uso de campos privados con `#` para proteger los datos internos:

```javascript
export class Usuario {
  #id;           // ID único del usuario
  #nombre;       // Nombre privado
  #apellido;     // Apellido privado
  #area;         // Área de trabajo
  #cargo;        // Cargo desempeñado
  #sueldo;       // Salario
  #sede;         // Sede asignada
}
```

### 3. **Constructores**
Cada clase tiene un constructor que inicializa los objetos con valores por defecto y genera IDs únicos:

```javascript
constructor(nombre, apellido, area, cargo, sueldo, sede) {
  this.#id = this.generarIdUnico(); // Generación automática de ID
  this.#nombre = nombre;
  // ... inicialización de otros campos
}
```

### 4. **Métodos Getters**
Métodos públicos para acceder a los datos encapsulados:

```javascript
getNombres() {
  return `${this.#nombre} ${this.#apellido}`;
}

getUsuario() {
  return {
    id: this.#id,
    nombre: this.#nombre,
    // ... resto de datos en formato plano
  };
}
```

## 🏛️ Arquitectura y Patrones de Diseño

### Patrón **Repository**
La base de datos utiliza un patrón similar a Repository con tres estructuras principales:

```javascript
export const db = {
  usuarios: {
    byId: {},      // Acceso directo por ID
    allIds: [],    // Lista de todos los IDs
  },
  eventos: {
    byId: {},      // Acceso directo por ID
    allIds: [],    // Lista de todos los IDs
    byUsuario: {}, // Índice por usuario
  },
  funciones: {
    byId: {},      // Acceso directo por ID
    allIds: [],    // Lista de todos los IDs
    byUsuario: {}, // Índice por usuario
  }
};
```

### Patrón **Service Layer**
Separación clara entre:
- **Services**: Lógica de negocio (CRUD operaciones)
- **Selectors**: Consultas y búsquedas
- **Models**: Estructura de datos

### Patrón **Data Mapper**
Conversión entre objetos POO y datos planos para persistencia:

```javascript
getUsuario() {
  return {
    id: this.#id,
    nombre: this.#nombre,
    // ... convierte objeto a formato JSON
  };
}
```

## 💾 Sistema de Base de Datos

### Estructura Normalizada
La base de datos utiliza una estructura normalizada con índices múltiples:

1. **byId**: Acceso O(1) por ID único
2. **allIds**: Lista ordenada de todos los registros
3. **byUsuario**: Índice relacional para consultas rápidas

### Generación de IDs Únicos
Cada entidad genera IDs usando un algoritmo compuesto:

```javascript
// Para usuarios: Apellido + Timestamp + Random
this.#id = apellido.substr(0,2).toUpperCase() + 
          Date.now().toString(36).slice(0,4).toUpperCase() + 
          Math.floor(Math.random() * 1000);

// Para eventos: Timestamp + Random + UsuarioID
this.id = Date.now().toString(36).slice(0,4).toUpperCase() + 
          Math.floor(Math.random() * 1000) + 
          usuarioId.substr(0,2).toUpperCase();
```

## 👥 Gestión de Usuarios

### Operaciones CRUD

#### **Crear Usuario**
```javascript
const crearUsuario = (nombre, apellido, area, cargo, sueldo, sede) => {
  // 1. Crear instancia de la clase Usuario
  let nuevoUsuario = new Usuario(nombre, apellido, area, cargo, sueldo, sede);
  
  // 2. Guardar en byId (acceso directo)
  db.usuarios.byId[nuevoUsuario.getId()] = nuevoUsuario.getUsuario();
  
  // 3. Agregar ID a allIds (listado completo)
  db.usuarios.allIds.push(nuevoUsuario.getId());
  
  // 4. Persistir cambios
  guardarDB(db);
  
  return nuevoUsuario;
};
```

#### **Modificar Usuario**
```javascript
const modificarUsuario = (usuarioId, dato, nuevosDatos) => {
  // 1. Buscar usuario usando selector
  let usuario = identificarUsuario(usuarioId);
  
  // 2. Validar existencia
  if (!usuario) return null;
  
  // 3. Modificar campo específico
  usuario[dato] = nuevosDatos;
  
  // 4. Guardar cambios
  guardarDB(db);
  
  return usuario;
};
```

#### **Eliminar Usuario**
```javascript
const eliminarUsuario = (usuarioId) => {
  // 1. Identificar usuario
  let usuario = identificarUsuario(usuarioId);
  
  // 2. Eliminar de byId
  delete db.usuarios.byId[usuarioId];
  
  // 3. Eliminar de allIds
  db.usuarios.allIds = db.usuarios.allIds.filter(id => id !== usuarioId);
  
  // 4. Eliminar eventos relacionados (cascada)
  eliminarEventoUsuarioId(usuarioId);
  
  // 5. Persistir cambios
  guardarDB(db);
};
```

### Selectors (Consultas)
```javascript
const identificarUsuario = (usuarioId) => {
  return db.usuarios.byId[usuarioId]; // Búsqueda O(1)
};
```

## 📅 Gestión de Eventos

### Sistema de Notificaciones Automáticas
El sistema implementa notificaciones automáticas cuando se cancelan eventos:

```javascript
const notificarCancelacion = (evento, usuarioId) => {
  // 1. Crear evento de notificación
  let titulo = "El evento se ha cancelado " + evento.titulo;
  let descripcion = "Se suspende el evento indicado como: " + evento.titulo;
  
  // 2. Identificar usuarios a notificar
  let usuariosNotificar = evento.participantes.filter(id => id !== usuarioId);
  
  // 3. Crear evento de notificación para cada usuario
  usuariosNotificar.forEach(usuario => {
    let eventoNotificacion = crearEvento(
      usuario, titulo, descripcion, fechaActual()
    );
  });
};
```

### Gestión de Participantes
```javascript
const agregarParticipante = (eventoId, usuarioId) => {
  // 1. Validar existencia del evento
  let evento = buscarEvento(eventoId);
  if (!evento) return null;
  
  // 2. Agregar participante al evento
  if (!evento.participantes.includes(usuarioId)) {
    evento.participantes.push(usuarioId);
  }
  
  // 3. Mantener índice byUsuario actualizado
  if (!db.eventos.byUsuario[usuarioId]) {
    db.eventos.byUsuario[usuarioId] = [];
  }
  
  if (!db.eventos.byUsuario[usuarioId].includes(eventoId)) {
    db.eventos.byUsuario[usuarioId].push(eventoId);
  }
};
```

### Eliminación en Cascada
Cuando se elimina un usuario, el sistema:
1. Busca todos los eventos relacionados
2. Crea notificaciones de cancelación
3. Elimina los eventos originales
4. Actualiza todos los índices

## 🔧 Gestión de Funcionalidades

### Asignación de Tareas
```javascript
const crearFuncion = (usuarioId, tarea, descripcion, area, tipo, supervisor) => {
  // 1. Crear instancia de Funcion
  const nuevaFuncion = new funciones(usuarioId, tarea, descripcion, area, tipo, supervisor);
  
  // 2. Guardar en byId
  db.funciones.byId[nuevaFuncion.getId()] = nuevaFuncion.getFuncion();
  
  // 3. Agregar a allIds
  db.funciones.allIds.push(nuevaFuncion.getId());
  
  // 4. Mantener índice por usuario
  if (!db.funciones.byUsuario[nuevaFuncion.getIdUser()]) {
    db.funciones.byUsuario[nuevaFuncion.getIdUser()] = [];
  }
  
  db.funciones.byUsuario[nuevaFuncion.getIdUser()].push(nuevaFuncion);
  
  return nuevaFuncion;
};
```

## 💾 Persistencia de Datos

### Sistema de Almacenamiento
```javascript
// Guardado automático en JSON
const guardarDB = (db) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

// Carga desde JSON
const cargarDB = () => {
  if (!fs.existsSync(DB_PATH)) return null;
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
};
```

### Inicialización de la Aplicación
```javascript
// app.js - Punto de entrada
const dbGuardada = cargarDB();
if (dbGuardada) {
  Object.assign(db, dbGuardada); // Restaurar datos guardados
}
```

## 🎓 Guía de Aprendizaje POO

### 1. **Clases como Plantillas**
Las clases (`Usuario`, `Eventos`, `funciones`) son plantillas que definen:
- **Atributos**: Características de los objetos
- **Métodos**: Comportamientos y acciones
- **Constructores**: Inicialización de objetos

### 2. **Encapsulamiento y Protección de Datos**
- Campos privados con `#` protegen los datos internos
- Métodos getters controlan el acceso a la información
- Los objetos exponen solo lo necesario

### 3. **Abstracción**
- Las clases ocultan complejidad interna
- Los usuarios interactúan con interfaces simples
- La implementación puede cambiar sin afectar el uso

### 4. **Herencia (Potencial Extensión)**
El diseño permite fácil extensión:
```javascript
// Ejemplo futuro: clase Admin que hereda de Usuario
class Admin extends Usuario {
  #nivelAcceso;
  
  constructor(nombre, apellido, area, cargo, sueldo, sede, nivelAcceso) {
    super(nombre, apellido, area, cargo, sueldo, sede);
    this.#nivelAcceso = nivelAcceso;
  }
}
```

### 5. **Polimorfismo (Potencial Extensión)**
Los objetos pueden compartir interfaces pero comportarse diferente:
```javascript
// Todos los objetos tienen getId() pero implementan lógica diferente
usuario.getId()    // Retorna ID de usuario
evento.getId()     // Retorna ID de evento
funcion.getId()    // Retorna ID de función
```

### 6. **Principios SOLID Aplicados**

#### **S - Single Responsibility**
- Cada clase tiene una única responsabilidad
- `Usuario` gestiona datos de usuarios
- `Eventos` gestiona datos de eventos
- `funciones` gestiona tareas

#### **O - Open/Closed**
- Las clases están abiertas para extensión
- Cerradas para modificación (campos privados)

#### **L - Liskov Substitution**
- Los objetos pueden ser reemplazables por sus subtipos

#### **I - Interface Segregation**
- Interfaces específicas para cada necesidad
- Selectors vs Services separados

#### **D - Dependency Inversion**
- Los servicios dependen de abstracciones
- No dependen de implementaciones concretas

## 🚀 Cómo Ejecutar el Proyecto

1. **Instalar Node.js** (versión 14 o superior)
2. **Clonar el repositorio**
3. **Ejecutar la aplicación**:
   ```bash
   node app.js
   ```

## 📊 Datos de Ejemplo

El proyecto incluye datos de muestra con:
- **9 usuarios** con diferentes roles y áreas
- **2 eventos** con participantes asignados
- **Estructura completa** para pruebas y aprendizaje

## 🎯 Objetivos Educativos

Este proyecto está diseñado para enseñar:
- ✅ Conceptos fundamentales de POO
- ✅ Patrones de diseño arquitectónicos
- ✅ Gestión de estado y persistencia
- ✅ Separación de responsabilidades
- ✅ Principios SOLID en práctica
- ✅ Desarrollo modular y escalable

---

**📝 Nota**: Este proyecto es un recurso educativo completo para aprender Programación Orientada a Objetos con JavaScript, aplicando conceptos teóricos en un sistema real y funcional.
# estructura_poo_simple
