const API_URL = 'http://localhost:3000/api/usuarios-rutinas';

export async function asignarRutina(id_usuario, id_rutina) {
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id_usuario,
            id_rutina,
        }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error || 'No se pudo asignar la rutina'
        );
    }

    return datos;
}

export async function obtenerRutinasUsuario(id_usuario) {
    const respuesta = await fetch(
        `${API_URL}/${id_usuario}`
    );

    if (!respuesta.ok) {
        throw new Error(
            'No se pudieron obtener las rutinas del usuario'
        );
    }

    return await respuesta.json();
}