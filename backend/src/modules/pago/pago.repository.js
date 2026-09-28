const pool = require('../../database/connection');

/**
 * Inserta el primer intento de pago para una reserva.
 * Solo debe llamarse cuando esa reserva todavía no tiene fila en pago
 * (id_reserva es UNIQUE), si no, MySQL rechazará el INSERT.
 */
async function crear({ idReserva, monto, metodoPago }) {
  const [resultado] = await pool.query(
    `INSERT INTO pago (id_reserva, monto, metodo_pago, estado)
     VALUES (?, ?, ?, 'pendiente')`,
    [idReserva, monto, metodoPago]
  );
  return resultado.insertId;
}

/**
 * Busca un pago por su id.
 */
async function buscarPorId(idPago) {
  const [filas] = await pool.query('SELECT * FROM pago WHERE id_pago = ?', [idPago]);
  return filas[0];
}

/**
 * Busca el registro de pago asociado a una reserva (a lo sumo hay uno,
 * porque id_reserva es UNIQUE en la tabla).
 */
async function buscarPorReserva(idReserva) {
  const [filas] = await pool.query('SELECT * FROM pago WHERE id_reserva = ?', [idReserva]);
  return filas[0];
}

/**
 * Actualiza los datos de un nuevo intento de pago sobre la fila
 * existente de una reserva (monto, método y vuelve a dejarlo en
 * "pendiente"), sin crear una fila nueva.
 */
async function actualizarIntento(idReserva, { monto, metodoPago }) {
  await pool.query(
    `UPDATE pago
     SET monto = ?, metodo_pago = ?, estado = 'pendiente', referencia_externa = NULL, fecha_pago = NULL
     WHERE id_reserva = ?`,
    [monto, metodoPago, idReserva]
  );
}

/**
 * Actualiza el estado del pago de una reserva (por ejemplo, a "pagado",
 * "fallido" o "reembolsado"), junto con la referencia externa y la
 * fecha de pago cuando corresponda.
 */
async function actualizarEstado(idReserva, { estado, referenciaExterna, fechaPago }) {
  await pool.query(
    'UPDATE pago SET estado = ?, referencia_externa = ?, fecha_pago = ? WHERE id_reserva = ?',
    [estado, referenciaExterna, fechaPago, idReserva]
  );
}

module.exports = {
  crear,
  buscarPorId,
  buscarPorReserva,
  actualizarIntento,
  actualizarEstado,
};
