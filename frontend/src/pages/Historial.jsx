import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerSeguimientos } from "../services/seguimientoService";

function Historial() {
  const navigate = useNavigate();

  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setCargando(true);
        setError("");

        const datos = await obtenerSeguimientos();
       

        const registrosOrdenados = [...datos].sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );

        setHistorial(registrosOrdenados);
      } catch (error) {
        console.error("Error al cargar historial:", error);
        setError("No fue posible cargar tu historial.");
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const fechaTexto = String(fecha).slice(0, 10);
    const [anio, mes, dia] = fechaTexto.split("-");

    if (!anio || !mes || !dia) return fechaTexto;

    return `${dia}/${mes}/${anio}`;
  };

  return (
    <section id="historial">
      <div className="section-inner">

        <button
          type="button"
          className="routines-back-button"
          onClick={() => navigate("/seguimiento")}
        >
          ← Volver a mi seguimiento
        </button>

        <p className="section-tag">
          Progreso
        </p>

        <h2 className="section-title">
          Mi <em>historial</em>
        </h2>

        <p className="section-desc">
          Consulta las rutinas que has realizado y la evolución
          de tu progreso físico.
        </p>

        {cargando && (
          <p>Cargando historial...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!cargando && !error && historial.length === 0 && (
          <div className="reserva-card">
            <h3>No hay registros todavía</h3>

            <p>
              Cuando registres una rutina en Mi seguimiento,
              aparecerá aquí.
            </p>

            <button
              type="button"
              className="btn-volver"
              onClick={() => navigate("/seguimiento")}
            >
              Registrar mi progreso
            </button>
          </div>
        )}

        {!cargando && !error && historial.length > 0 && (
          <div className="routines-grid">

            {historial.map((registro) => (
              <div
                className="routine-card"
                key={registro.id_seguimiento}
              >
                <div className="routine-badge">
                  Rutina realizada
                </div>

                <h3>
                  {formatearFecha(registro.fecha)}
                </h3>

                <p>
                  <strong>Rutina:</strong>{" "}
                  {registro.nombre_rutina || "Nombre no disponible"}
                </p>

                {registro.peso != null && (
                  <p>
                    ⚖️ Peso registrado:{" "}
                    <strong>{registro.peso} kg</strong>
                  </p>
                )}

                {registro.comentarios ? (
                  <p>
                    {registro.comentarios}
                  </p>
                ) : (
                  <p>
                    Sin comentarios adicionales.
                  </p>
                )}
              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default Historial;
