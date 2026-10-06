import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerReservasPorUsuario } from "../services/reservaService";


function MisReservas() {

    const navigate = useNavigate();

    const [reservas, setReservas] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState("");


    const idUsuario = 29;


    useEffect(() => {

        const cargarReservas = async () => {

            try {

                setCargando(true);

                setError("");

                const datos =
                    await obtenerReservasPorUsuario(idUsuario);

                setReservas(datos);

            } catch (error) {

                console.error(
                    "Error al cargar las reservas:",
                    error
                );

                setError(
                    "No fue posible cargar tus reservas."
                );

            } finally {

                setCargando(false);

            }

        };


        cargarReservas();

    }, []);


    const irACalificar = (reserva) => {

        navigate("/calificaciones", {
            state: {
                reserva: reserva
            }
        });

    };


    const irAPagar = (reserva) => {

        navigate("/pagos", {
            state: {
                reserva: reserva
            }
        });

    };


    return (

        <section id="mis-reservas">

            <div className="section-inner">


                <button
                    type="button"
                    className="routines-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Volver al inicio
                </button>


                <p className="section-tag">
                    Mis entrenamientos
                </p>


                <h2 className="section-title">
                    Mis <em>reservas</em>
                </h2>


                <p className="section-desc">
                    Consulta tus entrenamientos reservados
                    y califica aquellos que ya hayas realizado.
                </p>


                {cargando && (

                    <p>
                        Cargando reservas...
                    </p>

                )}


                {error && (

                    <p>
                        {error}
                    </p>

                )}


                {!cargando &&
                    !error &&
                    reservas.length === 0 && (

                        <div className="reserva-card">

                            <h3>
                                No tienes reservas todavía
                            </h3>

                            <p>
                                Cuando reserves un entrenamiento
                                aparecerá aquí.
                            </p>

                        </div>

                    )}


                {!cargando &&
                    !error &&
                    reservas.length > 0 && (

                        <div className="routines-grid">

                            {reservas.map((reserva) => (

                                <div
                                    className="routine-card"
                                    key={reserva.id_reserva}
                                >

                                    <div className="routine-badge">

                                        {reserva.estado === "completada"
                                            ? "Completada"
                                            : reserva.estado}

                                    </div>


                                    <h3>
                                        Reserva #{reserva.id_reserva}
                                    </h3>


                                    <p>
                                        <strong>
                                            Fecha:
                                        </strong>{" "}

                                        {new Date(
                                            reserva.fecha
                                        ).toLocaleDateString(
                                            "es-CO"
                                        )}
                                    </p>


                                    <p>
                                        <strong>
                                            Horario:
                                        </strong>{" "}

                                        {reserva.hora_inicio.substring(
                                            0,
                                            5
                                        )}{" "}
                                        -
                                        {" "}
                                        {reserva.hora_fin.substring(
                                            0,
                                            5
                                        )}
                                    </p>


                                    <p>
                                        <strong>
                                            Objetivo:
                                        </strong>{" "}

                                        {reserva.objetivo}
                                    </p>


                                    <p>
                                        <strong>
                                            Precio:
                                        </strong>{" "}

                                        $
                                        {Number(
                                            reserva.precio
                                        ).toLocaleString(
                                            "es-CO"
                                        )}
                                    </p>


                                    {reserva.estado === "completada" && (

                                        <button
                                            type="button"
                                            className="btn-reservar"
                                            onClick={() =>
                                                irACalificar(
                                                    reserva
                                                )
                                            }
                                        >
                                            ⭐ Calificar instructor
                                        </button>

                                    )}


                                    {reserva.estado !== "completada" && (

                                        <button
                                            type="button"
                                            className="btn-reservar"
                                            onClick={() =>
                                                irAPagar(
                                                    reserva
                                                )
                                            }
                                        >
                                            💳 Realizar pago
                                        </button>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

            </div>

        </section>

    );

}


export default MisReservas;