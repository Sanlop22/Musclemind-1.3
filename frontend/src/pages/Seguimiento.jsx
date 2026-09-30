import "./Seguimiento.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  obtenerSeguimientos,
  crearSeguimiento
} from "../services/seguimientoService";

function Seguimiento() {

  const navigate = useNavigate();

  const [seguimientos, setSeguimientos] = useState([]);
  const [formulario, setFormulario] = useState({
    fecha: "",
    peso: "",
    porcentaje_grasa: "",
    masa_muscular: "",
    nivel_esfuerzo: "1",
    series_completadas: "",
    repeticiones_completadas: "",
    comentarios: ""
  });

  useEffect(() => {

    obtenerSeguimientos()
      .then((datos) => {

        setSeguimientos(datos);

      })
      .catch((error) => {

        console.error(
          "Error al obtener seguimientos:",
          error
        );

      });

  }, []);

  return (

    <div className="seguimiento-page">

      {/* ENCABEZADO */}

      <header className="seguimiento-header">

        <div>

          <h1>
            MUSCLE<span>MIND</span>
          </h1>

          <p>
            Mi seguimiento
          </p>

        </div>

        <button
  className="btn-volver"
  onClick={() => navigate("/")}
>
  Volver
</button>

      </header>


      {/* RESUMEN */}

      <section className="resumen">

        <h2>
          Resumen de progreso
        </h2>

        <div className="estadisticas">

          <div className="tarjeta">

            <span className="icono">
              ⚖️
            </span>

            <p>
              Peso actual
            </p>

            <h3>
              71.0 kg
            </h3>

          </div>


          <div className="tarjeta">

            <span className="icono">
              💪
            </span>

            <p>
              Masa muscular
            </p>

            <h3>
              55.5 kg
            </h3>

          </div>


          <div className="tarjeta">

            <span className="icono">
              📊
            </span>

            <p>
              Grasa corporal
            </p>

            <h3>
              18.5 %
            </h3>

          </div>


          <div className="tarjeta">

            <span className="icono">
              🔥
            </span>

            <p>
              Nivel de esfuerzo
            </p>

            <h3>
              7 / 10
            </h3>

          </div>

        </div>

      </section>


      {/* FORMULARIO */}

      <section className="formulario-seguimiento">

        <h2>
          Registrar seguimiento
        </h2>


        <div className="form-grid">


          <div className="campo">

            <label>
              Fecha
            </label>

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

            <label>
              Rutina
            </label>

            <select>

              <option>
                Rutina de fuerza actualizada
              </option>

              <option>
                Rutina de cardio
              </option>

              <option>
                Rutina de hipertrofia
              </option>

            </select>

          </div>


          <div className="campo">

            <label>
              Peso (kg)
            </label>

            <input
              type="number"
              placeholder="Ej. 71"
              value={formulario.peso}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  peso: e.target.value
                })
              }
            />

          </div>


          <div className="campo">

            <label>
              Grasa corporal (%)
            </label>

            <input
              type="number"
              placeholder="Ej. 18.5"
              value={formulario.porcentaje_grasa}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  porcentaje_grasa: e.target.value
                })
              }
            />

          </div>


          <div className="campo">

            <label>
              Masa muscular (kg)
            </label>

            <input
              type="number"
              placeholder="Ej. 55.5"
              value={formulario.masa_muscular}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  masa_muscular: e.target.value
                })
              }
            />

          </div>


          <div className="campo">

            <label>
              Nivel de esfuerzo
            </label>

            <select
              value={formulario.nivel_esfuerzo}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  nivel_esfuerzo: e.target.value
                })
              }
            >

              <option value="1">
                1 - Muy bajo
              </option>

              <option value="2">
                2
              </option>

              <option value="3">
                3
              </option>

              <option value="4">
                4
              </option>

              <option value="5">
                5 - Medio
              </option>

              <option value="6">
                6
              </option>

              <option value="7">
                7
              </option>

              <option value="8">
                8
              </option>

              <option value="9">
                9
              </option>

              <option value="10">
                10 - Máximo
              </option>

            </select>

          </div>


          <div className="campo">

            <label>
              Series completadas
            </label>

            <input
              type="number"
              placeholder="Ej. 12"
              value={formulario.series_completadas}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  series_completadas: e.target.value
                })
              }
            />

          </div>


          <div className="campo">

            <label>
              Repeticiones completadas
            </label>

            <input
              type="number"
              placeholder="Ej. 120"
              value={formulario.repeticiones_completadas}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  repeticiones_completadas: e.target.value
                })
              }
            />

          </div>

        </div>


        <div className="campo comentarios">

          <label>
            Comentarios
          </label>

          <textarea
            placeholder="Escribe cómo fue tu entrenamiento..."
            value={formulario.comentarios}
            onChange={(e) =>
              setFormulario({
                ...formulario,
                comentarios: e.target.value
              })
            }
          ></textarea>

        </div>


        <button
          className="btn-guardar"
          onClick={async () => {

            try {

              const datos = {

                id_usuario: 29,

                id_rutina: 1,

                fecha: formulario.fecha,

                peso: Number(formulario.peso),

                porcentaje_grasa:
                  Number(formulario.porcentaje_grasa),

                masa_muscular:
                  Number(formulario.masa_muscular),

                series_completadas:
                  Number(formulario.series_completadas),

                repeticiones_completadas:
                  Number(
                    formulario.repeticiones_completadas
                  ),

                nivel_esfuerzo:
                  Number(formulario.nivel_esfuerzo),

                comentarios:
                  formulario.comentarios

              };


              const nuevoSeguimiento =
                await crearSeguimiento(datos);


              setSeguimientos([
                ...seguimientos,
                nuevoSeguimiento
              ]);


              alert(
                "Seguimiento guardado correctamente"
              );


            } catch (error) {

              console.error(
                "Error al guardar:",
                error
              );

              alert(
                "No se pudo guardar el seguimiento"
              );

            }

          }}
        >
          Guardar seguimiento
        </button>

      </section>


      {/* ÚLTIMO SEGUIMIENTO */}

      <section className="ultimo-seguimiento">

        <h2>
          Último seguimiento
        </h2>


        {seguimientos.length > 0 ? (

          <div className="registro">

            <div>

              <strong>
                {
                  seguimientos[
                    seguimientos.length - 1
                  ].fecha
                }
              </strong>

              <p>
                Seguimiento registrado
              </p>

            </div>


            <div className="registro-datos">

              <span>
                ⚖️{" "}
                {
                  seguimientos[
                    seguimientos.length - 1
                  ].peso
                }{" "}
                kg
              </span>


              <span>
                💪{" "}
                {
                  seguimientos[
                    seguimientos.length - 1
                  ].masa_muscular
                }{" "}
                kg
              </span>


              <span>
                📊{" "}
                {
                  seguimientos[
                    seguimientos.length - 1
                  ].porcentaje_grasa
                }{" "}
                % grasa
              </span>


              <span>
                🔥 Esfuerzo{" "}
                {
                  seguimientos[
                    seguimientos.length - 1
                  ].nivel_esfuerzo
                }
                /10
              </span>

            </div>

          </div>

        ) : (

          <p>
            No hay seguimientos registrados.
          </p>

        )}

      </section>

    </div>
  );
}

export default Seguimiento;