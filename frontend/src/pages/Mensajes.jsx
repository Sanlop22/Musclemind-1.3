
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerUsuario } from "../utils/session";
import {
    obtenerConversacion,
    crearMensaje
} from "../services/mensajeService";

function Mensajes() {

    const navigate = useNavigate();

    const { idInstructor, idUsuario: idUsuarioRuta } = useParams();

    const usuario = obtenerUsuario();

    const [mensajes, setMensajes] = useState([]);
    const [contenido, setContenido] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);

    const esInstructor = usuario?.rol === "instructor";

    // Identificar a los participantes de la conversación.
    const usuarioId = esInstructor
        ? Number(idUsuarioRuta)
        : Number(usuario?.id_usuario);

    const instructorId = esInstructor
        ? Number(usuario?.id_instructor)
        : Number(idInstructor);

    useEffect(() => {

        const cargarConversacion = async () => {

            if (
                !usuario ||
                !usuarioId ||
                !instructorId ||
                usuarioId <= 0 ||
                instructorId <= 0
            ) {
                setError("No se pudieron identificar los participantes de la conversación.");
                setCargando(false);
                return;
            }

            try {

                setCargando(true);
                setError("");

                const data = await obtenerConversacion(
                    usuarioId,
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

            } finally {

                setCargando(false);

            }
        };

        cargarConversacion();

    }, [usuarioId, instructorId]);

    const enviarMensaje = async () => {

        if (!contenido.trim() || enviando) {
            return;
        }

        try {

            setEnviando(true);
            setError("");

            // El backend identifica al remitente mediante el JWT.
            // Solo enviamos el identificador del otro participante.
            const datosMensaje = esInstructor
                ? {
                    idUsuario: usuarioId,
                    contenido: contenido.trim()
                }
                : {
                    idInstructor: instructorId,
                    contenido: contenido.trim()
                };

            const nuevoMensaje = await crearMensaje(datosMensaje);

            setMensajes((mensajesAnteriores) => [
                ...mensajesAnteriores,
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

        } finally {

            setEnviando(false);

        }
    };

    return (
        <section id="mensajes">

            <div className="section-inner">

                <button
                    type="button"
                    className="routines-back-button"
                    onClick={() => navigate(
                        esInstructor ? "/" : "/instructores"
                    )}
                >
                    ← Volver
                </button>

                <p className="section-tag">
                    Comunicación
                </p>

                <h2 className="section-title">
                    Chat con tu{" "}
                    <em>
                        {esInstructor ? "usuario" : "instructor"}
                    </em>
                </h2>

                <p className="section-desc">
                    Comunícate directamente con el otro participante.
                </p>

                {error && (
                    <p className="mensaje-error">
                        {error}
                    </p>
                )}

                <div className="chat-container">

                    <div className="mensajes-lista">

                        {cargando ? (

                            <p className="chat-vacio">
                                Cargando conversación...
                            </p>

                        ) : mensajes.length === 0 ? (

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
                            maxLength={500}
                            disabled={cargando || enviando}
                        />

                        <button
                            type="button"
                            className="btn-enviar-mensaje"
                            onClick={enviarMensaje}
                            disabled={
                                cargando ||
                                enviando ||
                                !contenido.trim()
                            }
                        >
                            {enviando ? "Enviando..." : "Enviar mensaje"}
                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Mensajes;
