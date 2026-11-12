
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerUsuario } from "../utils/session";
import {
    obtenerReservasPorInstructor,
    actualizarEstadoReserva
} from "../services/reservaService";

function ReservasInstructor() {
    const navigate = useNavigate();
    const usuario = obtenerUsuario();

    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(null);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const idInstructor = usuario?.id_instructor;

    const cargarReservas = async () => {
        if (!idInstructor) {
            setError("No se encontró tu perfil de instructor.");
            setCargando(false);
            return;
        }

        try {
            setError("");

            const datos = await obtenerReservasPorInstructor(idInstructor);

            setReservas(Array.isArray(datos) ? datos : []);
        } catch (err) {
            setError(err.message || "No fue posible cargar las reservas.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarReservas();
    }, []);

    const completarReserva = async (idReserva) => {
        const confirmar = window.confirm(
            "¿Confirmas que el entrenamiento ya se realizó?"
        );

        if (!confirmar) return;

        try {
            setActualizando(idReserva);
            setError("");
            setMensaje("");

            await actualizarEstadoReserva(idReserva, "completada");

            setMensaje("La reserva se marcó como completada.");

            await cargarReservas();
        } catch (err) {
            setError(err.message || "No fue posible completar la reserva.");
        } finally {
            setActualizando(null);
        }
    };

    return (
        <main className="disponibilidad-container">

            <header className="disponibilidad-header">
                <button
                    type="button"
                    className="btn-volver"
                    onClick={() => navigate("/")}
                >
                    ← Volver
                </button>

                <h1>Mis reservas</h1>

                <p>
                    Consulta los entrenamientos reservados por tus deportistas
                    y actualiza su estado cuando hayan finalizado.
                </p>
            </header>

            <section className="disponibilidad-listado">

                {error && (
                    <p className="disponibilidad-error">{error}</p>
                )}

                {mensaje && (
                    <p className="disponibilidad-exito">{mensaje}</p>
                )}

                {cargando ? (
                    <p>Cargando reservas...</p>
                ) : reservas.length === 0 ? (
                    <p className="disponibilidad-vacio">
                        Todavía no tienes reservas.
                    </p>
                ) : (
                    <div className="disponibilidad-lista">

                        {reservas.map((reserva) => (
                            <article
                                className="disponibilidad-tarjeta"
                                key={reserva.id_reserva}
                            >
                                <div>
                                    <h3>
                                        Reserva #{reserva.id_reserva}
                                    </h3>

                                    <p>
                                        <strong>Deportista:</strong>{" "}
                                        {reserva.nombre_deportista}{" "}
                                        {reserva.apellido_deportista}
                                    </p>

                                    <p>
                                        <strong>Fecha:</strong>{" "}
                                        {new Date(
                                            `${String(reserva.fecha).slice(0, 10)}T00:00:00`
                                        ).toLocaleDateString("es-CO")}
                                    </p>

                                    <p>
                                        <strong>Horario:</strong>{" "}
                                        {String(reserva.hora_inicio).slice(0, 5)}
                                        {" - "}
                                        {String(reserva.hora_fin).slice(0, 5)}
                                    </p>

                                    <p>
                                        <strong>Objetivo:</strong>{" "}
                                        {reserva.objetivo}
                                    </p>

                                    <p>
                                        <strong>Estado del entrenamiento:</strong>{" "}
                                        {reserva.estado}
                                    </p>

                                    <p>
                                        <strong>Precio:</strong>{" "}
                                        ${Number(reserva.precio).toLocaleString("es-CO")}
                                    </p>

                                    <hr />

                                    <p>
                                        <strong>Estado del pago:</strong>{" "}
                                        {reserva.estado_pago || "Sin registrar"}
                                    </p>

                                    <p>
                                        <strong>Pagado por:</strong>{" "}
                                        {reserva.pagador || "No registrado"}
                                    </p>
                                </div>

                                {reserva.estado === "pendiente" && (
                                    <button
                                        type="button"
                                        className="disponibilidad-boton"
                                        disabled={actualizando !== null}
                                        onClick={() =>
                                            completarReserva(reserva.id_reserva)
                                        }
                                    >
                                        {actualizando === reserva.id_reserva
                                            ? "Actualizando..."
                                            : "Marcar como completada"}
                                    </button>
                                )}

                                {reserva.estado === "completada" && (
                                    <span className="disponibilidad-estado">
                                        Entrenamiento completado
                                    </span>
                                )}
                            </article>
                        ))}

                    </div>
                )}

            </section>
        </main>
    );
}

export default ReservasInstructor;

