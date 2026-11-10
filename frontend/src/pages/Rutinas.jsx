import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerRutinas } from "../services/rutinaService";
import { obtenerUsuario } from "../utils/session";

function Rutinas() {
    const navigate = useNavigate();
    const usuario = obtenerUsuario();

    const esDeportista = usuario?.rol === "usuario";

    const [rutinas, setRutinas] = useState([]);
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarRutinas = async () => {
            try {
                const datos = await obtenerRutinas();
                setRutinas(datos);
            } catch (error) {
                console.error("Error al cargar las rutinas:", error);
                setError("No fue posible cargar las rutinas.");
            } finally {
                setCargando(false);
            }
        };

        cargarRutinas();
    }, []);

    const seleccionarRutina = (rutina) => {
        if (!esDeportista) return;

        setRutinaSeleccionada(rutina);
    };

    return (
        <section id="rutinas">
            <div className="section-inner">

                <button
                    type="button"
                    className="routines-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Volver al inicio
                </button>

                <p className="section-tag">
                    Entrenamiento
                </p>

                <h2 className="section-title">
                    Rutinas para <em>cada objetivo</em>
                </h2>

                <p className="section-desc">
                    Selecciona la rutina que se adapta a tu nivel y metas.
                    Cada plan fue diseñado por entrenadores certificados.
                </p>

                {cargando && <p>Cargando rutinas...</p>}

                {error && <p>{error}</p>}

                {!cargando && !error && (
                    <div className="routines-grid">

                        {rutinas.map((rutina) => (
                            <div
                                className="routine-card"
                                key={rutina.id_rutina}
                            >
                                <div className="routine-badge">
                                    {rutina.nivel}
                                </div>

                                <h3>
                                    {rutina.nombre_rutina}
                                </h3>

                                <p>
                                    {rutina.descripcion ||
                                        "Rutina diseñada para ayudarte a alcanzar tus objetivos."}
                                </p>

                                <div className="routine-meta">
                                    <span>
                                        ⏱️ {rutina.duracion_minutos} min
                                    </span>

                                    <span>
                                        📅 {rutina.dias_por_semana} días/semana
                                    </span>
                                </div>

                                {esDeportista && (
                                    <button
                                        type="button"
                                        onClick={() => seleccionarRutina(rutina)}
                                    >
                                        Elegir rutina
                                    </button>
                                )}
                            </div>
                        ))}

                    </div>
                )}

                {rutinaSeleccionada && esDeportista && (
                    <div className="rutina-seleccionada">

                        <h3>Rutina seleccionada</h3>

                        <p>
                            Has seleccionado{" "}
                            <strong>
                                {rutinaSeleccionada.nombre_rutina}
                            </strong>
                        </p>

                        <div className="rutina-botones">

                            <button
                                type="button"
                                className="btn-ver-instructores"
                                onClick={() => {
                                    navigate("/instructores", {
                                        state: {
                                            rutina: rutinaSeleccionada
                                        }
                                    });
                                }}
                            >
                                Ver instructores →
                            </button>

                            <button
                                type="button"
                                className="btn-cancelar-rutina"
                                onClick={() => setRutinaSeleccionada(null)}
                            >
                                Cancelar selección
                            </button>

                        </div>
                    </div>
                )}

                                {usuario?.rol === "instructor" && (
                    <div className="rutina-seleccionada">
                        <h3>Panel del instructor</h3>

                        <p>
                            Puedes consultar las rutinas disponibles y administrar
                            tus horarios de entrenamiento.
                        </p>

                        <button
                            type="button"
                            className="btn-ver-instructores"
                            onClick={() => navigate("/disponibilidad")}
                        >
                            Administrar mis horarios →
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
}

export default Rutinas;