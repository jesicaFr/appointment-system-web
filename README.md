# Appointment System - Frontend

Frontend desarrollado en React para la gestión de turnos.

## Características

* Visualización de turnos disponibles.
* Creación de nuevos turnos.
* Edición y cancelación de turnos.
* Integración con API .NET 
* Interfaz responsive desarrollada con React.

## Tecnologías

* React
* TypeScript
* React Router
* CSS

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/jesicaFr/appointment-system-web.git
```

Instalar dependencias:

```bash
npm install
```

Ejecutar la aplicación:

```bash
npm start
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

## Backend

La aplicación consume la API del proyecto Appointment System Backend.

## Funcionalidades

* Gestión de turnos.
* Consulta de disponibilidad a traves del calendario
* Programación de citas y cancelacion de turnos.
* Validacion de turnos duplicados en base a fecha, hora y minutos
* la cancelacion de turno se realiza haciendo doble click en el turno del calendario, el cual redirige al formulario para cambiar el estado a cancelado

## Próximas mejoras
* Login
* Validaciones avanzadas.
* Relacion medicos y paciente
* Menu de crear recetas y emitirla
* Una vez obtenido los turnos poder ingresar unos minutos antes para la videollamada

## Autor

Jesica Fraile
