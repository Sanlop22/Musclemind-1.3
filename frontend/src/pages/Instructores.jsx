
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { obtenerInstructores } from "../services/instructorService";

function Instructores() {
    const navigate = useNavigate();
    const location = useLocation();

    const rutinaSeleccionada = location.state?.rutina;

    const [instructores, setInstructores] = useState([]);
    const [instructorSeleccionado, setInstructorSeleccionado] = useState(null);

    const [error, setError] = useState("");

    useEffect(() => {
        cargarInstructores();
    }, []);

    const cargarInstructores = async () => {
        try {
            const data = await obtenerInstructores();

            setInstructores(data);
        } catch (error) {
            console.error(
                "Error al cargar instructores:",
                error
            );

            setError(
                "No fue posible cargar los instructores."
            );
        }
    };

    const seleccionarInstructor = (instructor) => {
        setInstructorSeleccionado(instructor);
    };

    const irAReserva = () => {
        if (!rutinaSeleccionada) {
            alert(
                "Primero debes seleccionar una rutina."
            );

            return;
        }

        if (!instructorSeleccionado) {
            alert(
                "Primero debes elegir un instructor."
            );

            return;
        }

        navigate("/reserva", {
            state: {
                rutina: rutinaSeleccionada,
                instructor: instructorSeleccionado
            }
        });
    };

    return (
        <section id="instructores">

            <div className="section-inner">

                <button
                    type="button"
                    className="routines-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Volver al inicio
                </button>

                <p className="section-tag">
                    Entrenadores
                </p>

                <h2 className="section-title">
                    Encuentra tu <em>instructor ideal</em>
                </h2>

                <p className="section-desc">
                    Selecciona un instructor especializado que te
                    acompañe en tu proceso de entrenamiento.
                </p>

                {error && (
                    <p>
                        {error}
                    </p>
                )}

                <div className="routines-grid">

                    {instructores.map((instructor) => (

                        <div
                            className="routine-card"
                            key={instructor.id_instructor}
                        >

                            <div className="routine-badge">
                                {instructor.especialidad}
                            </div>

                            <h3>
                                {instructor.nombre}{" "}
                                {instructor.apellido}
                            </h3>

                            <p>
                                Especialista en{" "}
                                {instructor.especialidad}.
                            </p>

                            <div className="routine-meta">

                                <span>
                                    ⭐ {instructor.experiencia} años
                                    experiencia
                                </span>

                            </div>

                            <button
                                type="button"
                                className="btn-seguimiento"
                                onClick={() =>
                                    seleccionarInstructor(
                                        instructor
                                    )
                                }
                            >
                                Elegir instructor
                            </button>

                        </div>

                    ))}

                </div>

                {instructorSeleccionado && (

                    <div className="reserva-card">

                        <div className="reserva-header">

                            <span className="reserva-tag">
                                Instructor
                            </span>

                            <h3>
                                Instructor seleccionado
                            </h3>

                            <p>
                                Has seleccionado{" "}
                                <strong>
                                    {instructorSeleccionado.nombre}{" "}
                                    {instructorSeleccionado.apellido}
                                </strong>
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    flexWrap: "wrap",
                                    marginTop: "20px"
                                }}
                            >

                                <button
                                    type="button"
                                    className="btn-enviar-mensaje"
                                    onClick={() =>
                                        navigate(
                                            `/mensajes/${instructorSeleccionado.id_instructor}`
                                        )
                                    }
                                >
                                    Enviar mensaje
                                </button>

                                <button
                                    type="button"
                                    className="btn-reservar"
                                    onClick={irAReserva}
                                >
                                    Reservar entrenamiento
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
}

export default Instructores;