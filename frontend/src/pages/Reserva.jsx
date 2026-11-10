
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { obtenerDisponibilidadPorInstructor } from "../services/disponibilidadService";
import {
    crearReserva,
    obtenerHorariosOcupados
} from "../services/reservaService";

function Reserva() {
    const location = useLocation();
    const navigate = useNavigate();

    const rutinaSeleccionada = location.state?.rutina;
    const instructorSeleccionado = location.state?.instructor;

    const [fechaReserva, setFechaReserva] = useState("");
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [horariosOcupados, setHorariosOcupados] = useState([]);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

    const [paso, setPaso] = useState(1);

    const [cargando, setCargando] = useState(false);
    const [cargandoHorarios, setCargandoHorarios] = useState(false);
    const [reservando, setReservando] = useState(false);

    const [error, setError] = useState("");
    const [errorHorarios, setErrorHorarios] = useState("");
    const [mensaje, setMensaje] = useState("");

    // CARGAR DISPONIBILIDAD DEL INSTRUCTOR

    useEffect(() => {
        let vigente = true;

        const cargarDisponibilidad = async () => {
            if (!instructorSeleccionado) return;

            try {
                setCargando(true);
                setError("");

                const datos = await obtenerDisponibilidadPorInstructor(
                    instructorSeleccionado.id_instructor
                );

                if (vigente) {
                    setDisponibilidad(Array.isArray(datos) ? datos : []);
                }
            } catch (error) {
                console.error("Error al cargar disponibilidad:", error);

                if (vigente) {
                    setError("No fue posible cargar los horarios disponibles.");
                }
            } finally {
                if (vigente) setCargando(false);
            }
        };

        cargarDisponibilidad();

        return () => {
            vigente = false;
        };
    }, [instructorSeleccionado]);

    // CONSULTAR RESERVAS EXISTENTES PARA LA FECHA ELEGIDA

    useEffect(() => {
        let vigente = true;

        const consultarHorariosOcupados = async () => {
            const idInstructor = instructorSeleccionado?.id_instructor;

            if (!idInstructor || !fechaReserva) {
                setHorariosOcupados([]);
                setErrorHorarios("");
                setCargandoHorarios(false);
                return;
            }

            try {
                setCargandoHorarios(true);
                setErrorHorarios("");
                setHorariosOcupados([]);

                const datos = await obtenerHorariosOcupados(
                    idInstructor,
                    fechaReserva
                );

                if (vigente) {
                    setHorariosOcupados(
                        Array.isArray(datos) ? datos : []
                    );
                }
            } catch (error) {
                console.error("Error al consultar horarios ocupados:", error);

                if (vigente) {
                    setErrorHorarios(
                        "No fue posible consultar los horarios. Intenta nuevamente."
                    );
                }
            } finally {
                if (vigente) setCargandoHorarios(false);
            }
        };

        consultarHorariosOcupados();

        return () => {
            vigente = false;
        };
    }, [fechaReserva, instructorSeleccionado?.id_instructor]);

    // VOLVER A INSTRUCTORES CONSERVANDO LA RUTINA

    const volverAInstructores = () => {
        navigate("/instructores", {
            state: { rutina: rutinaSeleccionada }
        });
    };

    // CANCELAR EL PROCESO

    const cancelarProceso = () => {
        navigate("/rutinas");
    };

    // OBTENER FECHA LOCAL

    const obtenerFechaLocal = () => {
        const hoy = new Date();

        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");

        return `${año}-${mes}-${dia}`;
    };

    // OBTENER DÍA DE LA SEMANA

    const obtenerDiaSemana = (fecha) => {
        const fechaSeleccionada = new Date(`${fecha}T00:00:00`);

        const dias = [
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ];

        return dias[fechaSeleccionada.getDay()];
    };

    // CONVERTIR HORA A MINUTOS

    const horaAMinutos = (hora) => {
        const partes = hora.split(":");

        return Number(partes[0]) * 60 + Number(partes[1]);
    };

    // CONVERTIR MINUTOS A HORA

    const minutosAHora = (minutos) => {
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;

        return (
            `${String(horas).padStart(2, "0")}:` +
            `${String(minutosRestantes).padStart(2, "0")}:00`
        );
    };

    // GENERAR HORARIOS DE UNA HORA

    const generarHorariosDeUnaHora = (disponibilidades) => {
        const horariosGenerados = [];

        disponibilidades.forEach((item) => {
            const inicio = horaAMinutos(item.hora_inicio);
            const fin = horaAMinutos(item.hora_fin);

            for (let minutos = inicio; minutos + 60 <= fin; minutos += 60) {
                const horaInicio = minutosAHora(minutos);
                const horaFin = minutosAHora(minutos + 60);

                const horarioYaExiste = horariosGenerados.some(
                    (horario) =>
                        horario.hora_inicio === horaInicio &&
                        horario.hora_fin === horaFin
                );

                if (!horarioYaExiste) {
                    horariosGenerados.push({
                        id_disponibilidad: item.id_disponibilidad,
                        id_instructor: item.id_instructor,
                        dia_semana: item.dia_semana,
                        hora_inicio: horaInicio,
                        hora_fin: horaFin,
                        estado: item.estado
                    });
                }
            }
        });

        horariosGenerados.sort(
            (a, b) =>
                horaAMinutos(a.hora_inicio) -
                horaAMinutos(b.hora_inicio)
        );

        return horariosGenerados.map((horario, indice) => ({
            ...horario,
            id_horario:
                `${horario.hora_inicio}-${horario.hora_fin}-${indice}`
        }));
    };

    // DETERMINAR SI UN HORARIO ESTÁ OCUPADO

    const estaOcupado = (horario) => {
        return horariosOcupados.some((reserva) => {
            return (
                horaAMinutos(horario.hora_inicio) <
                    horaAMinutos(reserva.hora_fin) &&
                horaAMinutos(reserva.hora_inicio) <
                    horaAMinutos(horario.hora_fin)
            );
        });
    };

    // OBTENER TODOS LOS HORARIOS DISPONIBLES DEL DÍA

    const obtenerTodosLosHorarios = () => {
        if (!fechaReserva) return [];

        const diaSemana = obtenerDiaSemana(fechaReserva);

        const disponibilidadesDelDia = disponibilidad.filter((item) => {
            const diaDisponibilidad = item.dia_semana
                ?.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            return (
                diaDisponibilidad === diaSemana &&
                item.estado === "disponible"
            );
        });

        return generarHorariosDeUnaHora(disponibilidadesDelDia);
    };

    // FORMATEAR HORA

    const formatearHora = (hora) => {
        if (!hora) return "";

        const partes = hora.split(":");
        const horas = Number(partes[0]);
        const minutos = partes[1];

        const periodo = horas >= 12 ? "p. m." : "a. m.";
        const hora12 = horas % 12 || 12;

        return `${hora12}:${minutos} ${periodo}`;
    };

    // SELECCIONAR FECHA

    const seleccionarFecha = (fecha) => {
        setFechaReserva(fecha);
        setHorarioSeleccionado(null);
        setHorariosOcupados([]);
        setErrorHorarios("");
        setMensaje("");
        setError("");
        setPaso(1);
    };

    // SELECCIONAR HORARIO

    const seleccionarHorario = (horario) => {
        if (estaOcupado(horario)) return;

        setHorarioSeleccionado(horario);
        setError("");
        setMensaje("");
        setPaso(2);
    };

    // CONTINUAR

    const continuar = () => {
        if (!fechaReserva) {
            setError("Primero debes seleccionar una fecha.");
            return;
        }

        if (!horarioSeleccionado) {
            setError("Selecciona un horario para continuar.");
            return;
        }

        if (estaOcupado(horarioSeleccionado)) {
            setError("Este horario ya no está disponible. Selecciona otro.");
            setHorarioSeleccionado(null);
            setPaso(2);
            return;
        }

        setError("");
        setPaso(3);
    };

    // VOLVER A SELECCIONAR HORARIO

    const volverASeleccionarHorario = () => {
        setPaso(2);
        setMensaje("");
        setError("");
    };

    // CREAR RESERVA

    const reservarHorario = async () => {
        if (reservando || mensaje) return;

        if (!fechaReserva || !horarioSeleccionado) {
            setError("Debes seleccionar una fecha y un horario.");
            return;
        }

        try {
            setError("");
            setReservando(true);

            const datosReserva = {
                idInstructor: instructorSeleccionado.id_instructor,
                idRutina: rutinaSeleccionada.id_rutina,
                objetivo: "Entrenamiento de fuerza",
                fecha: fechaReserva,
                horaInicio: horarioSeleccionado.hora_inicio,
                horaFin: horarioSeleccionado.hora_fin,
                precio: 50000
            };

            const respuesta = await crearReserva(datosReserva);

            const numeroReserva =
                respuesta.id_reserva ||
                respuesta.idReserva ||
                respuesta.id ||
                "";

            setMensaje(
                numeroReserva
                    ? `Reserva creada correctamente. Número de reserva: ${numeroReserva}`
                    : "Tu reserva fue creada correctamente."
            );
        } catch (error) {
            console.error("Error al crear reserva:", error);

            setError(
                error.message ||
                "No fue posible crear la reserva."
            );
        } finally {
            setReservando(false);
        }
    };

    const todosLosHorarios = obtenerTodosLosHorarios();

    if (!rutinaSeleccionada || !instructorSeleccionado) {
        return (
            <section className="reserva-page">
                <div className="reserva-container">
                    <div className="reserva-card">
                        <h2>No se pudo iniciar la reserva</h2>

                        <p>
                            Debes seleccionar primero una rutina
                            y un instructor.
                        </p>

                        <button
                            type="button"
                            className="btn-reservar"
                            onClick={() => navigate("/rutinas")}
                        >
                            Volver a rutinas
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="reserva-page">
            <div className="reserva-container">

                {/* ENCABEZADO */}

                <div className="reserva-header">
                    <span className="reserva-tag">Reserva</span>

                    <h1>
                        Agenda tu <em>entrenamiento</em>
                    </h1>

                    <p>
                        Completa los pasos para reservar tu entrenamiento.
                    </p>
                </div>

                {/* INDICADORES DE LOS PASOS */}

                <div className="reserva-pasos">
                    <button
                        type="button"
                        className={
                            paso >= 1
                                ? "reserva-paso-indicador activo"
                                : "reserva-paso-indicador"
                        }
                        onClick={() => {
                            if (!mensaje) {
                                setPaso(1);
                                setError("");
                            }
                        }}
                        disabled={Boolean(mensaje)}
                    >
                        <span>1</span>
                        <strong>Fecha</strong>
                    </button>

                    <div className="reserva-paso-linea"></div>

                    <button
                        type="button"
                        className={
                            paso >= 2
                                ? "reserva-paso-indicador activo"
                                : "reserva-paso-indicador"
                        }
                        disabled={paso < 2 || Boolean(mensaje)}
                        onClick={() => {
                            setPaso(2);
                            setError("");
                        }}
                    >
                        <span>2</span>
                        <strong>Horario</strong>
                    </button>

                    <div className="reserva-paso-linea"></div>

                    <button
                        type="button"
                        className={
                            paso >= 3
                                ? "reserva-paso-indicador activo"
                                : "reserva-paso-indicador"
                        }
                        disabled={paso < 3 || Boolean(mensaje)}
                        onClick={() => {
                            setPaso(3);
                            setError("");
                        }}
                    >
                        <span>3</span>
                        <strong>Confirmar</strong>
                    </button>
                </div>

                {/* TARJETA PRINCIPAL */}

                <div className="reserva-card">

                    {/* DATOS DE LA RUTINA Y EL INSTRUCTOR */}

                    <div className="reserva-detalles">
                        <div className="reserva-detalle">
                            <span>Rutina</span>
                            <strong>
                                {rutinaSeleccionada.nombre_rutina}
                            </strong>
                        </div>

                        <div className="reserva-detalle">
                            <span>Instructor</span>
                            <strong>
                                {instructorSeleccionado.nombre}{" "}
                                {instructorSeleccionado.apellido}
                            </strong>
                        </div>
                    </div>

                    {/* NAVEGACIÓN */}

                    {!mensaje && (
                        <div className="reserva-navegacion">
                            <button
                                type="button"
                                className="btn-volver-instructores"
                                onClick={volverAInstructores}
                            >
                                ← Volver a instructores
                            </button>

                            <button
                                type="button"
                                className="btn-cancelar-proceso"
                                onClick={cancelarProceso}
                            >
                                Cancelar proceso
                            </button>
                        </div>
                    )}

                    {/* PASO 1: FECHA */}

                    {paso === 1 && !mensaje && (
                        <div className="reserva-seccion">
                            <div className="reserva-paso-titulo">
                                <div className="reserva-paso-numero">1</div>

                                <div>
                                    <h3>Selecciona una fecha</h3>
                                    <p>
                                        Elige el día en el que deseas
                                        realizar tu entrenamiento.
                                    </p>
                                </div>
                            </div>

                            <div className="reserva-campo">
                                <label htmlFor="fecha">
                                    📅 Fecha del entrenamiento
                                </label>

                                <input
                                    id="fecha"
                                    type="date"
                                    value={fechaReserva}
                                    min={obtenerFechaLocal()}
                                    onChange={(e) =>
                                        seleccionarFecha(e.target.value)
                                    }
                                />
                            </div>

                            {!fechaReserva && (
                                <div className="reserva-ayuda">
                                    👆 Selecciona una fecha para consultar
                                    los horarios disponibles.
                                </div>
                            )}

                            {fechaReserva && (
                                <button
                                    type="button"
                                    className="btn-continuar"
                                    onClick={() => {
                                        setError("");
                                        setPaso(2);
                                    }}
                                >
                                    Ver horarios disponibles →
                                </button>
                            )}
                        </div>
                    )}

                    {/* PASO 2: HORARIOS */}

                    {paso === 2 && !mensaje && (
                        <div className="reserva-seccion">
                            <div className="reserva-paso-titulo">
                                <div className="reserva-paso-numero">2</div>

                                <div>
                                    <h3>Selecciona un horario</h3>
                                    <p>
                                        Consulta la agenda del instructor.
                                        Los horarios ocupados no se pueden seleccionar.
                                    </p>
                                </div>
                            </div>

                            <div className="reserva-fecha-elegida">
                                📅 Fecha seleccionada:
                                <strong>{" "}{fechaReserva}</strong>
                            </div>

                            {(cargando || cargandoHorarios) && (
                                <div className="reserva-ayuda">
                                    Buscando horarios disponibles...
                                </div>
                            )}

                            {errorHorarios && (
                                <div className="reserva-error">
                                    {errorHorarios}
                                </div>
                            )}

                            {!cargando &&
                                !cargandoHorarios &&
                                !errorHorarios &&
                                todosLosHorarios.length === 0 && (
                                    <div className="reserva-ayuda">
                                        ❌ El instructor no tiene horarios
                                        disponibles para esta fecha.
                                        <br />
                                        <small>
                                            Puedes seleccionar otro día.
                                        </small>
                                    </div>
                                )}

                            {!cargando &&
                                !cargandoHorarios &&
                                !errorHorarios &&
                                todosLosHorarios.length > 0 && (
                                    <>
                                        <div className="reserva-instruccion">
                                            👇 Consulta los horarios:
                                        </div>

                                        <div className="reserva-instruccion">
                                            🟢 Disponible
                                            {"    "}
                                            🔴 Ocupado
                                        </div>

                                        <div className="horarios-lista">
                                            {todosLosHorarios.map((horario) => {
                                                const ocupado = estaOcupado(horario);

                                                const seleccionado =
                                                    horarioSeleccionado?.id_horario ===
                                                    horario.id_horario;

                                                return (
                                                    <button
                                                        type="button"
                                                        key={horario.id_horario}
                                                        disabled={ocupado}
                                                        className={
                                                            ocupado
                                                                ? "horario-item horario-ocupado"
                                                                : seleccionado
                                                                    ? "horario-item seleccionado"
                                                                    : "horario-item"
                                                        }
                                                        onClick={() =>
                                                            seleccionarHorario(horario)
                                                        }
                                                    >
                                                        <div className="horario-hora">
                                                            🕐{" "}
                                                            {formatearHora(
                                                                horario.hora_inicio
                                                            )}
                                                            {" - "}
                                                            {formatearHora(
                                                                horario.hora_fin
                                                            )}
                                                        </div>

                                                        <div className="horario-estado">
                                                            {ocupado
                                                                ? "🔴 Ocupado"
                                                                : seleccionado
                                                                    ? "✓ Horario seleccionado"
                                                                    : "🟢 Disponible"}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {horarioSeleccionado &&
                                            !estaOcupado(horarioSeleccionado) && (
                                                <div className="reserva-continuar">
                                                    <div className="reserva-seleccion-confirmada">
                                                        ✓ Has seleccionado:
                                                        <strong>
                                                            {" "}
                                                            {formatearHora(
                                                                horarioSeleccionado.hora_inicio
                                                            )}
                                                            {" - "}
                                                            {formatearHora(
                                                                horarioSeleccionado.hora_fin
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="btn-continuar"
                                                        onClick={continuar}
                                                    >
                                                        Continuar →
                                                    </button>
                                                </div>
                                            )}
                                    </>
                                )}

                            <button
                                type="button"
                                className="btn-volver-paso"
                                onClick={() => {
                                    setPaso(1);
                                    setError("");
                                }}
                            >
                                ← Cambiar fecha
                            </button>
                        </div>
                    )}

                    {/* PASO 3: CONFIRMAR */}

                    {paso === 3 && !mensaje && (
                        <div className="reserva-seccion">
                            <div className="reserva-paso-titulo">
                                <div className="reserva-paso-numero">3</div>

                                <div>
                                    <h3>Confirma tu reserva</h3>
                                    <p>
                                        Revisa los datos de tu entrenamiento
                                        antes de confirmar.
                                    </p>
                                </div>
                            </div>

                            <div className="reserva-resumen">
                                <div className="reserva-resumen-item">
                                    <span>🏋️ Rutina</span>
                                    <strong>
                                        {rutinaSeleccionada.nombre_rutina}
                                    </strong>
                                </div>

                                <div className="reserva-resumen-item">
                                    <span>👤 Instructor</span>
                                    <strong>
                                        {instructorSeleccionado.nombre}{" "}
                                        {instructorSeleccionado.apellido}
                                    </strong>
                                </div>

                                <div className="reserva-resumen-item">
                                    <span>📅 Fecha</span>
                                    <strong>{fechaReserva}</strong>
                                </div>

                                <div className="reserva-resumen-item">
                                    <span>🕐 Horario</span>
                                    <strong>
                                        {formatearHora(
                                            horarioSeleccionado?.hora_inicio
                                        )}
                                        {" - "}
                                        {formatearHora(
                                            horarioSeleccionado?.hora_fin
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <div className="reserva-confirmacion-ayuda">
                                🔎 Revisa que la fecha y el horario
                                sean correctos.
                            </div>

                            <div className="reserva-botones-finales">
                                <button
                                    type="button"
                                    className="btn-volver-paso"
                                    onClick={volverASeleccionarHorario}
                                    disabled={reservando}
                                >
                                    ← Cambiar horario
                                </button>

                                <button
                                    type="button"
                                    className="btn-reservar"
                                    onClick={reservarHorario}
                                    disabled={reservando}
                                >
                                    {reservando
                                        ? "Procesando reserva..."
                                        : "Confirmar reserva"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MENSAJE DE ERROR */}

                    {error && (
                        <div className="reserva-error">
                            {error}
                        </div>
                    )}

                    {/* RESERVA EXITOSA */}

                    {mensaje && (
                        <div className="reserva-exitosa">
                            <div className="reserva-exitosa-icono">
                                ✓
                            </div>

                            <h2>¡Entrenamiento agendado correctamente!</h2>

                            <p>{mensaje}</p>

                            <p>
                                Tu entrenamiento ya está registrado.
                                Ahora puedes consultar tu reserva y continuar
                                con el proceso de pago.
                            </p>

                            <button
                                type="button"
                                className="btn-reservar"
                                onClick={() => navigate("/mis-reservas")}
                            >
                                Ir a Mis reservas →
                            </button>

                            <button
                                type="button"
                                className="btn-volver-paso"
                                onClick={() => navigate("/")}
                            >
                                Volver al inicio
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Reserva;

