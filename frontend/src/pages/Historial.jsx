import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerHistorial } from "../services/historialService";


function Historial() {

    const navigate = useNavigate();

    const [historial, setHistorial] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState("");


    const idUsuario = 29;


    useEffect(() => {

        const cargarHistorial = async () => {

            try {

                setCargando(true);

                setError("");

                const datos =
                    await obtenerHistorial(idUsuario);

                setHistorial(datos);

            } catch (error) {

                console.error(
                    "Error al cargar historial:",
                    error
                );

                setError(
                    "No fue posible cargar el historial."
                );

            } finally {

                setCargando(false);

            }

        };


        cargarHistorial();

    }, []);


    return (

        <section id="historial">

            <div className="section-inner">

                <button
                    type="button"
                    className="routines-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Volver al inicio
                </button>


                <p className="section-tag">
                    Progreso
                </p>


                <h2 className="section-title">
                    Mi <em>historial</em>
                </h2>


                <p className="section-desc">
                    Consulta los registros de progreso
                    que has guardado en MuscleMind.
                </p>


                {cargando && (

                    <p>
                        Cargando historial...
                    </p>

                )}


                {error && (

                    <p>
                        {error}
                    </p>

                )}


                {!cargando &&
                    !error &&
                    historial.length === 0 && (

                        <div className="reserva-card">

                            <h3>
                                No hay registros todavía
                            </h3>

                            <p>
                                Cuando guardes un registro
                                de progreso aparecerá aquí.
                            </p>

                        </div>

                    )}


                {!cargando &&
                    !error &&
                    historial.length > 0 && (

                        <div className="routines-grid">

                            {historial.map((registro) => (

                                <div
                                    className="routine-card"
                                    key={
                                        registro.id_historial
                                    }
                                >

                                    <div className="routine-badge">
                                        Progreso
                                    </div>


                                    <h3>
                                        {registro.fecha
                                            ? new Date(
                                                registro.fecha
                                            ).toLocaleDateString(
                                                "es-CO"
                                            )
                                            : "Sin fecha"}
                                    </h3>


                                    <p>
                                        {
                                            registro.registro_progreso
                                        }
                                    </p>

                                </div>

                            ))}

                        </div>

                    )}

            </div>

        </section>

    );
}


export default Historial;