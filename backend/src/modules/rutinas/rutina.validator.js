const NIVELES_VALIDOS = ['Principiante', 'Intermedio', 'Avanzado'];
const ESTADOS_VALIDOS = ['activa', 'inactiva'];

const validateRutina = (rutina, { requireInstructor = true } = {}) => {

    // Validar el instructor que crea la rutina
    if (requireInstructor) {
        if (!rutina.id_instructor) {
            throw new Error('El id_instructor es obligatorio');
        }

        if (isNaN(rutina.id_instructor)) {
            throw new Error('El id_instructor debe ser un número válido');
        }
    }

    // Validar nombre
    if (!rutina.nombre_rutina) {
        throw new Error('El nombre de la rutina es obligatorio');
    }

    if (rutina.nombre_rutina.length < 3) {
        throw new Error('El nombre de la rutina debe tener mínimo 3 caracteres');
    }

    // Validar nivel
    if (!rutina.nivel) {
        throw new Error('El nivel es obligatorio');
    }

    if (!NIVELES_VALIDOS.includes(rutina.nivel)) {
        throw new Error(
            `El nivel debe ser uno de: ${NIVELES_VALIDOS.join(', ')}`
        );
    }

    // Validar días por semana
    if (rutina.dias_por_semana !== undefined && rutina.dias_por_semana !== null) {
        if (
            isNaN(rutina.dias_por_semana) ||
            rutina.dias_por_semana < 1 ||
            rutina.dias_por_semana > 7
        ) {
            throw new Error('Los días por semana deben ser un número entre 1 y 7');
        }
    }

    // Validar duración
    if (rutina.duracion_minutos !== undefined && rutina.duracion_minutos !== null) {
        if (
            isNaN(rutina.duracion_minutos) ||
            rutina.duracion_minutos <= 0 ||
            rutina.duracion_minutos > 300
        ) {
            throw new Error('La duración debe ser un número válido en minutos (1-300)');
        }
    }

    // Validar estado
    if (rutina.estado && !ESTADOS_VALIDOS.includes(rutina.estado)) {
        throw new Error(
            `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`
        );
    }
};

module.exports = {
    validateRutina
};