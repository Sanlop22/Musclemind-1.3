import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    registrarPago,
    obtenerPagoPorReserva,
    actualizarEstadoPago
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

            if (!reservaSeleccionada) {
                return;
            }

            try {

                setCargando(true);

                setError("");

                const datos = await obtenerPagoPorReserva(
                    reservaSeleccionada.id_reserva
                );

                setPago(datos);

            } catch (error) {

                console.log(
                    "No existe un pago todavía:",
                    error
                );

                setPago(null);

            } finally {

                setCargando(false);

            }

        };


        cargarPago();

    }, [reservaSeleccionada]);


    const realizarPago = async () => {

        setError("");

        setMensaje("");


        if (!reservaSeleccionada) {

            setError(
                "No se encontró una reserva para realizar el pago."
            );

            return;
        }


        try {

            setCargando(true);


            const pagoRegistrado = await registrarPago({

                idReserva:
                    reservaSeleccionada.id_reserva,

                monto:
                    Number(reservaSeleccionada.precio),

                metodoPago: "tarjeta"

            });


            setPago(pagoRegistrado);


            const pagoPagado =
                await actualizarEstadoPago(
                    reservaSeleccionada.id_reserva,
                    {
                        estado: "pagado",
                        referenciaExterna:
                            `MM-${String(
                                reservaSeleccionada.id_reserva
                            ).padStart(5, "0")}`
                    }
                );


            setPago(pagoPagado);


            setMensaje(
                "¡Pago realizado correctamente!"
            );

        } catch (error) {

            console.error(
                "Error al realizar el pago:",
                error
            );

            setError(
                error.message ||
                "No fue posible realizar el pago."
            );

        } finally {

            setCargando(false);

        }

    };


    return (

        <section id="pagos">

            <div className="section-inner">


                <button
                    type="button"
                    className="routines-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Volver al inicio
                </button>


                <p className="section-tag">
                    Pagos
                </p>


                <h2 className="section-title">
                    Pago de <em>entrenamiento</em>
                </h2>


                <p className="section-desc">
                    Consulta y gestiona el pago de tu
                    entrenamiento reservado.
                </p>


                {!reservaSeleccionada && (

                    <div className="reserva-card">

                        <h3>
                            No hay una reserva seleccionada
                        </h3>

                        <p>
                            Debes ingresar a esta página
                            desde una reserva.
                        </p>

                    </div>

                )}


                {reservaSeleccionada && (

                    <div className="reserva-card">

                        <div className="reserva-header">

                            <span className="reserva-tag">
                                Reserva
                            </span>


                            <h3>
                                Reserva #
                                {reservaSeleccionada.id_reserva}
                            </h3>


                            <p>
                                <strong>
                                    Fecha:
                                </strong>{" "}

                                {new Date(
                                    reservaSeleccionada.fecha
                                ).toLocaleDateString(
                                    "es-CO"
                                )}
                            </p>


                            <p>
                                <strong>
                                    Horario:
                                </strong>{" "}

                                {reservaSeleccionada.hora_inicio.substring(
                                    0,
                                    5
                                )}{" "}
                                -
                                {" "}
                                {reservaSeleccionada.hora_fin.substring(
                                    0,
                                    5
                                )}
                            </p>


                            <p>
                                <strong>
                                    Valor:
                                </strong>{" "}

                                $
                                {Number(
                                    reservaSeleccionada.precio
                                ).toLocaleString(
                                    "es-CO"
                                )}
                            </p>


                            {cargando && (

                                <p>
                                    Procesando pago...
                                </p>

                            )}


                            {!cargando && pago && (

                                <div
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >

                                    <p>
                                        <strong>
                                            Estado del pago:
                                        </strong>{" "}

                                        {pago.estado}
                                    </p>


                                    {pago.referencia_externa && (

                                        <p>
                                            <strong>
                                                Referencia:
                                            </strong>{" "}

                                            {
                                                pago.referencia_externa
                                            }
                                        </p>

                                    )}

                                </div>

                            )}


                            {!cargando &&
                                (!pago ||
                                    pago.estado !== "pagado") && (

                                    <button
                                        type="button"
                                        className="btn-reservar"
                                        onClick={realizarPago}
                                    >
                                        💳 Realizar pago
                                    </button>

                                )}


                            {mensaje && (

                                <p
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >
                                    {mensaje}
                                </p>

                            )}


                            {error && (

                                <p
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >
                                    {error}
                                </p>

                            )}

                        </div>

                    </div>

                )}

            </div>

        </section>

    );

}


export default Pagos;