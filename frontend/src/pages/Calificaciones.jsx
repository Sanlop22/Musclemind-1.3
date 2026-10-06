import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


function Calificaciones() {

    const navigate = useNavigate();
    const location = useLocation();


    const reservaSeleccionada = location.state?.reserva;


    const [puntuacion, setPuntuacion] = useState(0);

    const [comentario, setComentario] = useState("");

    const [mensaje, setMensaje] = useState("");

    const [error, setError] = useState("");


    const calificar = async () => {

        setMensaje("");
        setError("");


        if (!reservaSeleccionada) {

            setError(
                "No se encontró una reserva para calificar."
            );

            return;
        }


        if (puntuacion === 0) {

            setError(
                "Debes seleccionar una puntuación."
            );

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:3000/api/calificacion/usuario",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        idReserva:
                            reservaSeleccionada.id_reserva,

                        puntuacion: puntuacion,

                        comentario:
                            comentario.trim() || null,
                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    data.errores?.join(", ") ||
                    "No fue posible guardar la calificación."
                );
            }


            setMensaje(
                "¡Calificación guardada correctamente!"
            );


            setComentario("");

        } catch (error) {

            console.error(
                "Error al guardar calificación:",
                error
            );


            setError(
                error.message ||
                "No fue posible guardar la calificación."
            );
        }
    };


    return (

        <section id="calificaciones">

            <div className="section-inner">


                <button
                    type="button"
                    className="routines-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Volver al inicio
                </button>


                <p className="section-tag">
                    Experiencia
                </p>


                <h2 className="section-title">
                    Califica tu <em>entrenamiento</em>
                </h2>


                <p className="section-desc">
                    Cuéntanos cómo fue tu experiencia con
                    el instructor.
                </p>


                {reservaSeleccionada && (

                    <div className="reserva-card">

                        <h3>
                            Reserva #{reservaSeleccionada.id_reserva}
                        </h3>

                        <p>
                            Instructor:{" "}
                            <strong>
                                {reservaSeleccionada.nombre_instructor ||
                                    "Instructor"}
                            </strong>
                        </p>

                    </div>

                )}


                {!reservaSeleccionada && (

                    <div className="reserva-card">

                        <p>
                            No hay una reserva seleccionada
                            para calificar.
                        </p>

                    </div>

                )}


                <div className="reserva-card">

                    <h3>
                        ¿Cómo calificas tu experiencia?
                    </h3>


                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "20px",
                            marginBottom: "20px"
                        }}
                    >

                        {[1, 2, 3, 4, 5].map((numero) => (

                            <button
                                key={numero}
                                type="button"
                                onClick={() =>
                                    setPuntuacion(numero)
                                }
                                style={{
                                    fontSize: "30px",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    opacity:
                                        numero <= puntuacion
                                            ? 1
                                            : 0.35
                                }}
                            >
                                ⭐
                            </button>

                        ))}

                    </div>


                    <p>
                        Puntuación seleccionada:{" "}
                        <strong>
                            {puntuacion} / 5
                        </strong>
                    </p>


                    <textarea
                        value={comentario}
                        onChange={(e) =>
                            setComentario(e.target.value)
                        }
                        placeholder="Escribe un comentario sobre tu experiencia..."
                        maxLength={255}
                        rows={5}
                        style={{
                            width: "100%",
                            marginTop: "15px",
                            padding: "15px",
                            borderRadius: "10px",
                            resize: "vertical"
                        }}
                    />


                    <button
                        type="button"
                        className="btn-reservar"
                        onClick={calificar}
                        style={{
                            marginTop: "20px"
                        }}
                    >
                        Enviar calificación
                    </button>


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

        </section>

    );
}


export default Calificaciones;