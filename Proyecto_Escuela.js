const dibujar = require('./modulo.js');
const prompt = require("prompt-sync")();
const fs = require('fs');

const FILE_EMPLEADOS = 'empleados.json';
const FILE_ASISTENCIAS = 'asistencias.json';
const FILE_CREDENCIALES = 'credenciales.json';

let credenciales = { usuario: "admin", clave: "1234" };
if (fs.existsSync(FILE_CREDENCIALES)) {
    credenciales = JSON.parse(fs.readFileSync(FILE_CREDENCIALES, 'utf-8'));
}

let empleados = [];
if (fs.existsSync(FILE_EMPLEADOS)) {
    empleados = JSON.parse(fs.readFileSync(FILE_EMPLEADOS, 'utf-8'));
}

let asistencias = [];
if (fs.existsSync(FILE_ASISTENCIAS)) {
    asistencias = JSON.parse(fs.readFileSync(FILE_ASISTENCIAS, 'utf-8'));
}

function guardarDatos() {
    fs.writeFileSync(FILE_CREDENCIALES, JSON.stringify(credenciales, null, 2));
    fs.writeFileSync(FILE_EMPLEADOS, JSON.stringify(empleados, null, 2));
    fs.writeFileSync(FILE_ASISTENCIAS, JSON.stringify(asistencias, null, 2));
}

// --- 1. SISTEMA DE ENTRADA ---
function iniciarSesion() {
    let accesoConcedido = false;
    while (!accesoConcedido) {
        console.clear();
        console.log("==========================================");
        console.log(" SISTEMA DE SEGURIDAD - C.E.I. SIMON DIAZ");
        console.log("==========================================\n");
        
        let user = prompt("Usuario: ");
        let pass = prompt("Contraseña: ");

        if (user === credenciales.usuario && pass === credenciales.clave) {
            accesoConcedido = true;
            console.log("\n¡Acceso concedido! Bienvenido/a.");
            prompt("Presione Enter para continuar al menú principal...");
        } else {
            console.log("\nError: Usuario o contraseña incorrectos.");
            prompt("Presione Enter para intentar de nuevo...");
        }
    }
}

// --- 2. MENÚ PRINCIPAL ---
function mostrarMenu() {
    console.clear();
    dibujar(0, 3, "SISTEMA ADMINISTRATIVO DEL CEI SIMON DIAZ");
    dibujar(2, 5, "1. Marcar Asistencia (Entrada / Salida)");
    dibujar(2, 6, "2. Ver Registro de Asistencia del Día");
    dibujar(2, 7, "3. Registrar Nuevo Empleado");
    dibujar(2, 8, "4. Modificar Datos del Empleado");
    dibujar(2, 9, "5. Eliminar Empleado");
    dibujar(2, 10, "6. Ver Lista de Empleados");
    dibujar(2, 11, "7. Cambiar Usuario / Contraseña");
    dibujar(2, 12, "8. Salir");
    
    dibujar(0, 14, ""); 
    let opcion = prompt("Ingrese el número de la opción: ");
    return opcion;
}

// --- 3. FUNCIONES ---

// Opción 1: Marcar Asistencia (Entrada / Salida)
function marcarAsistencia() {
    console.clear();
    console.log("--- MARCAR ASISTENCIA ---");
    let cedula = prompt("Ingrese su número de cédula: ");

    let empleadoEncontrado = empleados.find(emp => emp.cedula === cedula);

    if (empleadoEncontrado) {
        let fechaActual = new Date();
        let horaFichaje = fechaActual.toLocaleTimeString();
        let fechaFichaje = fechaActual.toLocaleDateString();

        let registroHoy = asistencias.find(a => a.cedula === cedula && a.fecha === fechaFichaje);

        if (!registroHoy) {
        
            let nuevaAsistencia = {
                cedula: empleadoEncontrado.cedula,
                fecha: fechaFichaje,
                horaEntrada: horaFichaje,
                horaSalida: "Pendiente"
            };
            asistencias.push(nuevaAsistencia);
            console.log(`\n¡ENTRADA registrada con éxito!`);
            console.log(`Bienvenido/a, ${empleadoEncontrado.nombre}. Hora: ${horaFichaje}`);

        } else if (registroHoy.horaSalida === "Pendiente") {
            registroHoy.horaSalida = horaFichaje;
            console.log(`\n¡SALIDA registrada con éxito!`);
            console.log(`Hasta luego, ${empleadoEncontrado.nombre}. Hora: ${horaFichaje}`);
        } else {
            console.log(`\nYa has completado tu jornada de hoy, ${empleadoEncontrado.nombre}.`);
            console.log(`Entrada: ${registroHoy.horaEntrada} | Salida: ${registroHoy.horaSalida}`);
        }
        guardarDatos();
    } else {
        console.log("\nError: Cédula no encontrada. Registre al empleado primero (Opción 3).");
    }
    prompt("\nPresione Enter para volver al menú...");
}

// Opción 2: Ver Asistencia
function verAsistencia() {
    console.clear();
    console.log("--- REPORTE DETALLADO DE ASISTENCIA ---\n");
    
    if (asistencias.length === 0) {
        console.log("No hay asistencias registradas aún.");
    } else {
        console.log("FECHA      | ENTRADA  | SALIDA   | CÉDULA     | NOMBRE               | CARGO");
        console.log("-----------------------------------------------------------------------------------");
        
        for (let i = 0; i < asistencias.length; i++) {
            let reg = asistencias[i];
            let datosEmp = empleados.find(emp => emp.cedula === reg.cedula);
            
            let nombre = datosEmp ? datosEmp.nombre : "Desconocido";
            let cargo = datosEmp ? datosEmp.cargo : "Desconocido";

            console.log(`${reg.fecha} | ${reg.horaEntrada.padEnd(8)} | ${reg.horaSalida.padEnd(8)} | ${reg.cedula.padEnd(10)} | ${nombre.padEnd(20)} | ${cargo}`);
        }
    }
    prompt("\nPresione Enter para volver al menú...");
}

// Opción 3: Registrar Empleado
function registrarEmpleado() {
    console.clear();
    console.log("--- REGISTRAR NUEVO EMPLEADO ---");
    console.log("(Todos los Datos son OBLIGATORIOS)\n");
    console.log("(Escriba '0' en cualquier momento para CANCELAR y volver al menú)\n");

    let cedula = "";
    while (cedula.trim() === "") {
        cedula = prompt("Cédula: ");
        
        if (cedula === "0") {
            console.log("\nOperación cancelada. No se registró ningún empleado.");
            prompt("\nPresione Enter para volver al menú...");
            return;
        }

        if (cedula.trim() === "") console.log("La cédula no puede estar vacía.");
    }
    
    let existe = empleados.find(emp => emp.cedula === cedula);
    if (existe) {
        console.log("\nError: Ya existe un empleado con esa cédula.");
    } else {
        let nombre = "";
        while (nombre.trim() === "") {
            nombre = prompt("Nombre y Apellido: ");
            
            if (nombre === "0") {
                console.log("\nOperación cancelada. No se guardó nada.");
                prompt("\nPresione Enter para volver al menú...");
                return; 
            }

            if (nombre.trim() === "") console.log("El nombre no puede estar vacío.");
        }

        let cargoElegido = "";
        while (cargoElegido === "") {
            console.log("\nSeleccione el cargo del empleado (o '0' para cancelar):");
            console.log("1. Obrero");
            console.log("2. Docente");
            console.log("3. Administrativo");
            let opcCargo = prompt("Opción: ");

            if (opcCargo === "0") {
                console.log("\nOperación cancelada. No se guardó nada.");
                prompt("\nPresione Enter para volver al menú...");
                return;
            } else if (opcCargo === "1") {
                cargoElegido = "Obrero";
            } else if (opcCargo === "2") {
                cargoElegido = "Docente";
            } else if (opcCargo === "3") {
                cargoElegido = "Administrativo";
            } else {
                console.log("Opción inválida. Ingrese 1, 2, 3 o 0 para salir.");
            }
        }

        let nuevoEmpleado = {
            cedula: cedula,
            nombre: nombre,
            cargo: cargoElegido
        };

        empleados.push(nuevoEmpleado);
        guardarDatos();
        console.log(`\n¡${nombre} registrado como ${cargoElegido} exitosamente!`);
    }
    prompt("\nPresione Enter para volver al menú...");
}
// Opción 4: Modificar Empleado
function modificarEmpleado() {
    console.clear();
    console.log("--- MODIFICAR DATOS DEL EMPLEADO ---");
    let cedula = prompt("Ingrese la cédula del empleado que desea modificar: ");

    let empleadoEncontrado = empleados.find(emp => emp.cedula === cedula);

    if (empleadoEncontrado) {
        console.log(`\nModificando a: ${empleadoEncontrado.nombre} (${empleadoEncontrado.cargo})`);
        console.log("(Si no desea cambiar un dato, simplemente presione Enter)\n");

        let nuevoNombre = prompt(`Nuevo Nombre [Actual: ${empleadoEncontrado.nombre}]: `);
        if (nuevoNombre.trim() !== "") {
            empleadoEncontrado.nombre = nuevoNombre;
        }

        let cambiarCargo = prompt(`¿Desea cambiar el cargo actual (${empleadoEncontrado.cargo})? (s/n): `);
        if (cambiarCargo.toLowerCase() === "s") {
            let cargoValido = false;
            while (!cargoValido) {
                console.log("\n1. Obrero | 2. Docente | 3. Administrativo");
                let opcCargo = prompt("Seleccione el nuevo cargo (1-3): ");
                if (opcCargo === "1") { empleadoEncontrado.cargo = "Obrero"; cargoValido = true; }
                else if (opcCargo === "2") { empleadoEncontrado.cargo = "Docente"; cargoValido = true; }
                else if (opcCargo === "3") { empleadoEncontrado.cargo = "Administrativo"; cargoValido = true; }
                else { console.log("Opción inválida."); }
            }
        }

        guardarDatos();
        console.log("\n¡Datos del empleado actualizados correctamente!");
    } else {
        console.log("\nError: Empleado no encontrado en la base de datos.");
    }
    prompt("\nPresione Enter para volver al menú...");
}

// Opción 5: Eliminar Empleado
function eliminarEmpleado() {
    console.clear();
    console.log("--- ELIMINAR EMPLEADO ---");
    let cedula = prompt("Ingrese la cédula del empleado a eliminar (o '0' para cancelar): ");

    if (cedula === "0") {
        console.log("\nOperación cancelada.");
        prompt("\nPresione Enter para volver al menú...");
        return;
    }

    let indice = empleados.findIndex(emp => emp.cedula === cedula);

    if (indice !== -1) {
        let empleadoEncontrado = empleados[indice];
        console.log(`\nEmpleado encontrado: ${empleadoEncontrado.nombre} (${empleadoEncontrado.cargo})`);
        
        let confirmacion = prompt("¿Está SEGURO de que desea eliminar a este empleado? (s/n): ");

        if (confirmacion.toLowerCase() === "s") {
         
            empleados.splice(indice, 1);
            guardarDatos();
            console.log("\n¡Empleado eliminado exitosamente del sistema!");
        } else {
            console.log("\nOperación cancelada. El empleado NO fue eliminado.");
        }
    } else {
        console.log("\nError: No se encontró ningún empleado con esa cédula.");
    }
    prompt("\nPresione Enter para volver al menú...");
}

// Opción 6: Ver Empleados
function verEmpleados() {
    console.clear();
    console.log("--- NÓMINA DE EMPLEADOS ---\n");
    if (empleados.length === 0) {
        console.log("No hay empleados registrados.");
    } else {
        for (let i = 0; i < empleados.length; i++) {
            console.log(`${i + 1}. C.I: ${empleados[i].cedula} | ${empleados[i].nombre} | ${empleados[i].cargo}`);
        }
    }
    prompt("\nPresione Enter para volver al menú...");
}

// Opción 7: Cambiar Credenciales
function cambiarCredenciales() {
    console.clear();
    console.log("--- CONFIGURACIÓN DE SEGURIDAD ---");
    let passActual = prompt("Contraseña actual: ");

    if (passActual === credenciales.clave) {
        let nuevoUsuario = prompt("Nuevo nombre de usuario: ");
        let nuevaClave = prompt("Nueva contraseña: ");
        
        credenciales.usuario = nuevoUsuario;
        credenciales.clave = nuevaClave;
        guardarDatos();

        console.log("\n¡Credenciales actualizadas exitosamente!");
    } else {
        console.log("\nContraseña actual incorrecta. Operación cancelada.");
    }
    prompt("\nPresione Enter para volver al menú...");
}

function iniciarSistema() {
    iniciarSesion();

    let salir = false;
    while (!salir) {
        let opcionElegida = mostrarMenu();

      switch (opcionElegida) {
            case "1":
                marcarAsistencia();
                break;
            case "2":
                verAsistencia();
                break;
            case "3":
                registrarEmpleado();
                break;
            case "4":
                modificarEmpleado();
                break;
            case "5":
                eliminarEmpleado();
                break;
            case "6":
                verEmpleados();
                break;
            case "7":
                cambiarCredenciales();
                break;
            case "8":
                salir = true;
                console.clear();
                console.log("Guardando datos... Cerrando el sistema del C.E.I. Simón Díaz. ¡Hasta pronto!");
                break;
            default:
                console.log("\nOpción no válida. Por favor, intente de nuevo.");
                prompt("Presione Enter para continuar...");
                break;
        }
    }
}

iniciarSistema();