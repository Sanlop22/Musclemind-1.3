const API_URL = 'http://localhost:3000/api/seguimiento';

export async function crearSeguimiento(datos) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo guardar el seguimiento');
  }

  return await respuesta.json();
}

export async function obtenerSeguimientos() {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los seguimientos');
  }

  return await respuesta.json();
}