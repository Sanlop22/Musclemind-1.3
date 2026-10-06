import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    obtenerConversacion,
    crearMensaje
} from "../services/mensajeService";

function Mensajes() {

    const navigate = useNavigate();

    const { idInstructor } = useParams();

    const [mensajes, setMensajes] = useState([]);
    const [contenido, setContenido] = useState("");
    const [error, setError] = useState("");

    const idUsuario = 29;
    const instructorId = Number(idInstructor);

    useEffect(() => {
        cargarConversacion();
    }, [idInstructor]);

    const cargarConversacion = async () => {

        try {

            const data = await obtenerConversacion(
                idUsuario,
                instructorId
            );

            setMensajes(data);

        } catch (error) {

            console.error(
                "Error al cargar la conversación:",
                error
            );

            setError(
                "No fue posible cargar la conversación."
            );
        }
    };

    const enviarMensaje = async () => {

        if (!contenido.trim()) {
            return;
        }

        try {

            const nuevoMensaje = await crearMensaje({
                idUsuario: idUsuario,
                idInstructor: instructorId,
                remitente: "usuario",
                contenido: contenido
            });

            setMensajes([
                ...mensajes,
                nuevoMensaje
            ]);

            setContenido("");

        } catch (error) {

            console.error(
                "Error al enviar mensaje:",
                error
            );

            setError(
                "No fue posible enviar el mensaje."
            );
        }
    };

    return (
        <section id="mensajes">

            <div className="section-inner">

                <button
                    type="button"
                    className="routines-back-button"
                    onClick={() => navigate("/instructores")}
                >
                    ← Volver a instructores
                </button>

                <p className="section-tag">
                    Comunicación
                </p>

                <h2 className="section-title">
                    Chat con tu <em>instructor</em>
                </h2>

                <p className="section-desc">
                    Comunícate directamente con tu instructor.
                </p>

                {error && (
                    <p className="mensaje-error">
                        {error}
                    </p>
                )}

                <div className="chat-container">

                    <div className="mensajes-lista">

                        {mensajes.length === 0 ? (

                            <p className="chat-vacio">
                                No hay mensajes todavía.
                            </p>

                        ) : (

                            mensajes.map((mensaje) => (

                                <div
                                    className={`mensaje ${
                                        mensaje.remitente === "usuario"
                                            ? "mensaje-usuario"
                                            : "mensaje-instructor"
                                    }`}
                                    key={mensaje.id_mensaje}
                                >

                                    <span className="mensaje-remitente">
                                        {mensaje.remitente}
                                    </span>

                                    <p>
                                        {mensaje.contenido}
                                    </p>

                                </div>

                            ))

                        )}

                    </div>

                    <div className="chat-form">

                        <textarea
                            value={contenido}
                            onChange={(e) =>
                                setContenido(e.target.value)
                            }
                            placeholder="Escribe tu mensaje..."
                        />

                        <button
                            type="button"
                            className="btn-enviar-mensaje"
                            onClick={enviarMensaje}
                        >
                            Enviar mensaje
                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Mensajes;