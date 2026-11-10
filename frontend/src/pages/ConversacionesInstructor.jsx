
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerConversacionesInstructor } from "../services/mensajeService";

function ConversacionesInstructor() {
    const navigate = useNavigate();

    const [conversaciones, setConversaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarConversaciones() {
            try {
                setCargando(true);
                setError("");

                const data = await obtenerConversacionesInstructor();
                setConversaciones(data);
            } catch (error) {
                console.error("Error al cargar las conversaciones:", error);
                setError("No fue posible cargar las conversaciones.");
            } finally {
                setCargando(false);
            }
        }

        cargarConversaciones();
    }, []);

    return (
        <section id="mensajes">
            <div className="section-inner">

                <button
                    type="button"
                    className="routines-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Volver
                </button>

                <p className="section-tag">Comunicación</p>

                <h2 className="section-title">
                    Mis <em>conversaciones</em>
                </h2>

                <p className="section-desc">
                    Consulta los mensajes intercambiados con tus usuarios.
                </p>

                {cargando && (
                    <p>Cargando conversaciones...</p>
                )}

                {error && (
                    <p className="mensaje-error">{error}</p>
                )}

                {!cargando && !error && conversaciones.length === 0 && (
                    <p className="chat-vacio">
                        Todavía no tienes conversaciones.
                    </p>
                )}

                {!cargando && conversaciones.length > 0 && (
                    <div className="chat-container">
                        {conversaciones.map((conversacion) => (
                            <div
                                className="conversacion-item"
                                key={conversacion.id_usuario}
                            >
                                <div>
                                    <h3>
                                        {conversacion.nombre} {conversacion.apellido}
                                    </h3>

                                    <p>
                                        <strong>
                                            {conversacion.ultimo_remitente === "instructor"
                                                ? "Tú: "
                                                : "Usuario: "}
                                        </strong>
                                        {conversacion.ultimo_mensaje}
                                    </p>

                                    <small>
                                        {new Date(
                                            conversacion.fecha_ultimo_mensaje
                                        ).toLocaleString("es-CO")}
                                    </small>
                                </div>

                                <button
                                    type="button"
                                    className="btn-enviar-mensaje"
                                    onClick={() =>
                                        navigate(
                                            `/mensajes/usuario/${conversacion.id_usuario}`
                                        )
                                    }
                                >
                                    Abrir chat
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}

export default ConversacionesInstructor;
