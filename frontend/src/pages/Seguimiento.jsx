import "./Seguimiento.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerSeguimientos,
  crearSeguimiento
} from "../services/seguimientoService";

import { obtenerRutinas } from "../services/rutinaService";

function Seguimiento() {
  const navigate = useNavigate();

  const [seguimientos, setSeguimientos] = useState([]);
  const [rutinas, setRutinas] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [cargandoRutinas, setCargandoRutinas] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    fecha: new Date().toLocaleDateString("en-CA"),
    id_rutina: "",
    peso: "",
    comentarios: ""
  });

  // Cargar los registros del usuario
  const cargarSeguimientos = async () => {
    try {
      setCargando(true);

      const datos = await obtenerSeguimientos();

      setSeguimientos(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error al obtener seguimientos:", error);
      alert("No fue posible cargar tus registros.");
    } finally {
      setCargando(false);
    }
  };

  // Cargar las rutinas disponibles
  const cargarRutinas = async () => {
    try {
      setCargandoRutinas(true);

      const datos = await obtenerRutinas();

      setRutinas(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error al obtener rutinas:", error);
      alert("No fue posible cargar las rutinas disponibles.");
    } finally {
      setCargandoRutinas(false);
    }
  };

  useEffect(() => {
    cargarSeguimientos();
    cargarRutinas();
  }, []);

  // Ordenar registros por fecha
  const registrosOrdenados = [...seguimientos].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

  const ultimoRegistro =
    registrosOrdenados.length > 0
      ? registrosOrdenados[registrosOrdenados.length - 1]
      : null;

  // Guardar nuevo seguimiento
  const guardarSeguimiento = async () => {
    if (!formulario.fecha || !formulario.id_rutina) {
      alert("Por favor, selecciona la fecha y la rutina realizada.");
      return;
    }

    if (formulario.peso) {
      const peso = Number(formulario.peso);

      if (!Number.isFinite(peso) || peso <= 0 || peso > 500) {
        alert("Ingresa un peso válido.");
        return;
      }
    }

    try {
      setGuardando(true);

      const datos = {
  fecha: formulario.fecha,
  id_rutina: Number(formulario.id_rutina),
  peso: formulario.peso ? Number(formulario.peso) : null,
  comentarios: formulario.comentarios.trim() || null
};


await crearSeguimiento(datos);

      await cargarSeguimientos();

      setFormulario({
        fecha: new Date().toLocaleDateString("en-CA"),
        id_rutina: "",
        peso: "",
        comentarios: ""
      });

      alert("¡Tu seguimiento se guardó correctamente!");
    } catch (error) {
      console.error("Error al guardar seguimiento:", error);
      alert("No se pudo guardar el seguimiento.");
    } finally {
      setGuardando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const fechaTexto = String(fecha).slice(0, 10);
    const [anio, mes, dia] = fechaTexto.split("-");

    if (!anio || !mes || !dia) return fechaTexto;

    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className="seguimiento-page">

      {/* ENCABEZADO */}
      <header className="seguimiento-header">
        <div>
          <h1>
            MUSCLE<span>MIND</span>
          </h1>

          <p>Mi seguimiento</p>
        </div>

        <button
          className="btn-volver"
          onClick={() => navigate("/")}
        >
          Volver
        </button>

        <button
          className="btn-volver"
          onClick={() => navigate("/historial")}
        >
          Ver historial
        </button>
      </header>

      {/* RESUMEN */}
      <section className="resumen">
        <h2>Resumen de progreso</h2>

        <div className="estadisticas">
          <div className="tarjeta">
            <span className="icono">⚖️</span>

            <p>Último peso registrado</p>

            <h3>
              {ultimoRegistro?.peso != null
                ? `${ultimoRegistro.peso} kg`
                : "--"}
            </h3>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="formulario-seguimiento">
        <h2>Registrar mi progreso</h2>

        <div className="form-grid">

          <div className="campo">
            <label>Fecha</label>

            <input
              type="date"
              value={formulario.fecha}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  fecha: e.target.value
                })
              }
            />
          </div>

          <div className="campo">
            <label>Rutina realizada</label>

            <select
              value={formulario.id_rutina}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  id_rutina: e.target.value
                })
              }
              disabled={cargandoRutinas}
            >
              <option value="">
                {cargandoRutinas
                  ? "Cargando rutinas..."
                  : "Selecciona una rutina"}
              </option>

              {rutinas.map((rutina) => (
                <option
                  key={rutina.id_rutina}
                  value={rutina.id_rutina}
                >
                  {rutina.nombre_rutina}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label>Peso (kg) - Opcional</label>

            <input
              type="number"
              min="1"
              max="500"
              step="0.1"
              placeholder="Ej. 71.5"
              value={formulario.peso}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  peso: e.target.value
                })
              }
            />
          </div>

        </div>

        <div className="campo comentarios">
          <label>Comentarios (opcional)</label>

          <textarea
            placeholder="¿Cómo te has sentido? ¿Has notado algún avance?"
            value={formulario.comentarios}
            onChange={(e) =>
              setFormulario({
                ...formulario,
                comentarios: e.target.value
              })
            }
          />
        </div>

        <button
          className="btn-guardar"
          onClick={guardarSeguimiento}
          disabled={guardando || cargandoRutinas || rutinas.length === 0}
        >
          {guardando ? "Guardando..." : "Guardar seguimiento"}
        </button>
      </section>

      {/* GRÁFICA DE EVOLUCIÓN */}
      <section className="ultimo-seguimiento">
        <h2>Evolución de mi peso</h2>

        {cargando ? (
          <p>Cargando registros...</p>
        ) : registrosOrdenados.filter(
            (registro) => registro.peso != null
          ).length >= 2 ? (
          <div className="grafica-peso">
            <svg
              viewBox="0 0 600 260"
              role="img"
              aria-label="Gráfica de evolución del peso"
            >
              {(() => {
                const registrosConPeso = registrosOrdenados.filter(
                  (registro) => registro.peso != null
                );

                const pesos = registrosConPeso.map(
                  (registro) => Number(registro.peso)
                );

                const minimo = Math.min(...pesos);
                const maximo = Math.max(...pesos);
                const rango = maximo - minimo || 1;

                const puntos = pesos.map((peso, indice) => {
                  const x =
                    45 +
                    (indice * 510) /
                      Math.max(pesos.length - 1, 1);

                  const y =
                    210 -
                    ((peso - minimo) / rango) * 150;

                  return `${x},${y}`;
                });

                return (
                  <>
                    <line
                      x1="45"
                      y1="25"
                      x2="45"
                      y2="215"
                      stroke="#888"
                    />

                    <line
                      x1="45"
                      y1="215"
                      x2="555"
                      y2="215"
                      stroke="#888"
                    />

                    <polyline
                      points={puntos.join(" ")}
                      fill="none"
                      stroke="#E63946"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />

                    {puntos.map((punto, indice) => {
                      const [x, y] = punto.split(",");

                      return (
                        <g key={registrosConPeso[indice].id_seguimiento}>
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            fill="#E63946"
                          />

                          <text
                            x={x}
                            y={Number(y) - 14}
                            fill="currentColor"
                            textAnchor="middle"
                            fontSize="12"
                          >
                            {pesos[indice]} kg
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            <p>
              Cada punto representa un peso que has registrado.
            </p>
          </div>
        ) : (
          <p>
            Registra al menos dos pesos para visualizar tu evolución.
          </p>
        )}
      </section>

      {/* ÚLTIMO REGISTRO */}
      <section className="ultimo-seguimiento">
        <h2>Último registro</h2>

        {ultimoRegistro ? (
          <div className="registro">
            <div>
              <strong>
                {formatearFecha(ultimoRegistro.fecha)}
              </strong>

              <p>{ultimoRegistro.nombre_rutina || "Rutina realizada"}</p>
            </div>

            <div className="registro-datos">
              {ultimoRegistro.peso != null && (
                <span>
                  ⚖️ {ultimoRegistro.peso} kg
                </span>
              )}

              {ultimoRegistro.comentarios && (
                <p>{ultimoRegistro.comentarios}</p>
              )}
            </div>
          </div>
        ) : (
          <p>
            Todavía no tienes seguimientos registrados.
          </p>
        )}
      </section>

    </div>
  );
}

export default Seguimiento;
