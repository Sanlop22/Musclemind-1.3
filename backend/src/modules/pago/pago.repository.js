
const pool = require('../../database/connection');

/**
 * Busca el pago asociado a una reserva.
 */
async function buscarPorReserva(idReserva, conexion = pool) {
  const [filas] = await conexion.query(
    'SELECT * FROM pago WHERE id_reserva = ?',
    [idReserva]
  );

  return filas[0];
}

/**
 * Crea el primer registro de pago.
 */
async function crear(
  { idReserva, idUsuarioPagador, monto, metodoPago },
  conexion = pool
) {
  const [resultado] = await conexion.query(
    `INSERT INTO pago (
      id_reserva,
      id_usuario_pagador,
      monto,
      metodo_pago,
      estado
    )
    VALUES (?, ?, ?, ?, 'pendiente')`,
    [idReserva, idUsuarioPagador, monto, metodoPago]
  );

  return resultado.insertId;
}

/**
 * Actualiza un intento de pago fallido.
 */
async function actualizarIntento(
  idReserva,
  { idUsuarioPagador, monto, metodoPago },
  conexion = pool
) {
  await conexion.query(
    `UPDATE pago
     SET id_usuario_pagador = ?,
         monto = ?,
         metodo_pago = ?,
         estado = 'pendiente',
         referencia_externa = NULL,
         fecha_pago = NULL
     WHERE id_reserva = ?`,
    [idUsuarioPagador, monto, metodoPago, idReserva]
  );
}

/**
 * Aprueba el pago simulado únicamente si todavía no está pagado.
 */
async function aprobarPago(
  idReserva,
  { referenciaExterna, fechaPago },
  conexion = pool
) {
  const [resultado] = await conexion.query(
    `UPDATE pago
     SET estado = 'pagado',
         referencia_externa = ?,
         fecha_pago = ?
     WHERE id_reserva = ?
       AND estado = 'pendiente'`,
    [referenciaExterna, fechaPago, idReserva]
  );

  return resultado.affectedRows;
}

async function buscarPorId(idPago, conexion = pool) {
  const [filas] = await conexion.query(
    'SELECT * FROM pago WHERE id_pago = ?',
    [idPago]
  );

  return filas[0];
}

async function actualizarEstado(
  idReserva,
  { estado, referenciaExterna, fechaPago },
  conexion = pool
) {
  await conexion.query(
    `UPDATE pago
     SET estado = ?,
         referencia_externa = ?,
         fecha_pago = ?
     WHERE id_reserva = ?`,
    [estado, referenciaExterna, fechaPago, idReserva]
  );
}

module.exports = {
  crear,
  buscarPorId,
  buscarPorReserva,
  actualizarIntento,
  aprobarPago,
  actualizarEstado
};

