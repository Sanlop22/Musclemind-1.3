
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerConversacionesUsuario } from "../services/mensajeService";

function MisMensajes() {
    const navigate = useNavigate();

    const [conversaciones, setConversaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarConversaciones() {
            try {
                setCargando(true);
                setError("");

                const data = await obtenerConversacionesUsuario();
                setConversaciones(data);
            } catch (error) {
                console.error("Error al cargar los mensajes:", error);
                setError("No fue posible cargar tus conversaciones.");
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
                    Mis <em>mensajes</em>
                </h2>

                <p className="section-desc">
                    Consulta y continúa tus conversaciones con los instructores.
                </p>

                {cargando && <p>Cargando mensajes...</p>}

                {error && <p className="mensaje-error">{error}</p>}

                {!cargando && !error && conversaciones.length === 0 && (
                    <p className="chat-vacio">
                        Todavía no tienes conversaciones.
                    </p>
                )}

                {!cargando && !error && conversaciones.length > 0 && (
                    <div className="chat-container">
                        {conversaciones.map((conversacion) => (
                            <div
                                className="conversacion-item"
                                key={conversacion.id_instructor}
                            >
                                <div>
                                    <h3>
                                        {conversacion.nombre} {conversacion.apellido}
                                    </h3>

                                    <p>
                                        <strong>
                                            {conversacion.ultimo_remitente === "usuario"
                                                ? "Tú: "
                                                : "Instructor: "}
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
                                        navigate(`/mensajes/${conversacion.id_instructor}`)
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

export default MisMensajes;
