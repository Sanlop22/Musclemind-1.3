
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    registrarPago,
    obtenerPagoPorReserva
} from "../services/pagoService";

function Pagos() {
    const navigate = useNavigate();
    const location = useLocation();

    const reservaSeleccionada = location.state?.reserva;

    const [pago, setPago] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const cargarPago = async () => {
            if (!reservaSeleccionada) return;

            try {
                setCargando(true);
                setError("");

                const datos = await obtenerPagoPorReserva(
                    reservaSeleccionada.id_reserva
                );

                setPago(datos);
            } catch (error) {
                setPago(null);
            } finally {
                setCargando(false);
            }
        };

        cargarPago();
    }, [reservaSeleccionada]);

    const realizarPago = async () => {
        if (cargando) return;

        setError("");
        setMensaje("");

        if (!reservaSeleccionada) {
            setError("No se encontró una reserva para realizar el pago.");
            return;
        }

        if (pago?.estado === "pagado") {
            setError("Esta reserva ya fue pagada.");
            return;
        }

        try {
            setCargando(true);

            const pagoProcesado = await registrarPago({
                idReserva: reservaSeleccionada.id_reserva,
                metodoPago: "tarjeta"
            });

            setPago(pagoProcesado);
            setMensaje("¡Pago simulado realizado correctamente!");
        } catch (error) {
            console.error("Error al realizar el pago:", error);

            setError(
                error.message || "No fue posible procesar el pago."
            );
        } finally {
            setCargando(false);
        }
    };

    if (!reservaSeleccionada) {
        return (
            <section>
                <h2>No se encontró la reserva.</h2>

                <button onClick={() => navigate(-1)}>
                    Volver
                </button>
            </section>
        );
    }

    return (
        <section className="pagos-container">
            <button onClick={() => navigate(-1)}>
                ← Volver
            </button>

            <h1>Realizar pago</h1>

            <div className="pago-resumen">
                <h2>Reserva #{reservaSeleccionada.id_reserva}</h2>

                <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(
                        reservaSeleccionada.fecha
                    ).toLocaleDateString()}
                </p>

                <p>
                    <strong>Horario:</strong>{" "}
                    {reservaSeleccionada.hora_inicio}
                    {" - "}
                    {reservaSeleccionada.hora_fin}
                </p>

                <p>
                    <strong>Precio:</strong>{" "}
                    ${Number(reservaSeleccionada.precio).toLocaleString("es-CO")}
                </p>
            </div>

            {cargando && <p>Procesando...</p>}

            {pago && (
                <p>
                    <strong>Estado del pago:</strong>{" "}
                    {pago.estado}
                </p>
            )}

            {pago?.referencia_externa && (
                <p>
                    <strong>Referencia:</strong>{" "}
                    {pago.referencia_externa}
                </p>
            )}

            {mensaje && <p>{mensaje}</p>}

            {error && <p>{error}</p>}

            {pago?.estado !== "pagado" && (
                <button
                    onClick={realizarPago}
                    disabled={cargando}
                >
                    {cargando ? "Procesando..." : "💳 Realizar pago"}
                </button>
            )}

            {pago?.estado === "pagado" && (
                <p>Esta reserva ya se encuentra pagada.</p>
            )}
        </section>
    );
}

export default Pagos;
