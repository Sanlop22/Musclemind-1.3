import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { obtenerDisponibilidadPorInstructor } from "../services/disponibilidadService";
import { crearReserva } from "../services/reservaService";

function Reserva() {
    const location = useLocation();
    const navigate = useNavigate();

    const rutinaSeleccionada = location.state?.rutina;
    const instructorSeleccionado = location.state?.instructor;

    const [fechaReserva, setFechaReserva] = useState("");
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

    const [paso, setPaso] = useState(1);

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const cargarDisponibilidad = async () => {
            if (!instructorSeleccionado) {
                return;
            }

            try {
                setCargando(true);
                setError("");

                const datos =
                    await obtenerDisponibilidadPorInstructor(
                        instructorSeleccionado.id_instructor
                    );

                setDisponibilidad(datos);

            } catch (error) {
                console.error(
                    "Error al cargar disponibilidad:",
                    error
                );

                setError(
                    "No fue posible cargar los horarios disponibles."
                );

            } finally {
                setCargando(false);
            }
        };

        cargarDisponibilidad();

    }, [instructorSeleccionado]);

    const obtenerFechaLocal = () => {
        const hoy = new Date();

        const año = hoy.getFullYear();

        const mes = String(
            hoy.getMonth() + 1
        ).padStart(2, "0");

        const dia = String(
            hoy.getDate()
        ).padStart(2, "0");

        return `${año}-${mes}-${dia}`;
    };

    const obtenerDiaSemana = (fecha) => {
        const fechaSeleccionada =
            new Date(`${fecha}T00:00:00`);

        const dias = [
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ];

        return dias[
            fechaSeleccionada.getDay()
        ];
    };

    const horaAMinutos = (hora) => {
        const partes = hora.split(":");

        const horas = Number(partes[0]);
        const minutos = Number(partes[1]);

        return (
            horas * 60 +
            minutos
        );
    };

    const minutosAHora = (minutos) => {
        const horas =
            Math.floor(minutos / 60);

        const minutosRestantes =
            minutos % 60;

        return (
            `${String(horas).padStart(2, "0")}:` +
            `${String(minutosRestantes).padStart(2, "0")}:00`
        );
    };

    const generarHorariosDeUnaHora = (
        disponibilidades
    ) => {

        const horariosGenerados = [];

        disponibilidades.forEach(
            (disponibilidad) => {

                const inicio =
                    horaAMinutos(
                        disponibilidad.hora_inicio
                    );

                const fin =
                    horaAMinutos(
                        disponibilidad.hora_fin
                    );

                for (
                    let minutos = inicio;
                    minutos + 60 <= fin;
                    minutos += 60
                ) {

                    const horaInicio =
                        minutosAHora(
                            minutos
                        );

                    const horaFin =
                        minutosAHora(
                            minutos + 60
                        );

                    const horarioYaExiste =
                        horariosGenerados.some(
                            (horario) =>
                                horario.hora_inicio ===
                                    horaInicio &&
                                horario.hora_fin ===
                                    horaFin
                        );

                    if (!horarioYaExiste) {

                        horariosGenerados.push({

                            id_disponibilidad:
                                disponibilidad.id_disponibilidad,

                            id_instructor:
                                disponibilidad.id_instructor,

                            dia_semana:
                                disponibilidad.dia_semana,

                            hora_inicio:
                                horaInicio,

                            hora_fin:
                                horaFin,

                            estado:
                                disponibilidad.estado
                        });
                    }
                }
            }
        );

        horariosGenerados.sort(
            (a, b) =>
                horaAMinutos(a.hora_inicio) -
                horaAMinutos(b.hora_inicio)
        );

        return horariosGenerados.map(
            (horario, indice) => ({
                ...horario,

                id_horario:
                    `${horario.hora_inicio}-${horario.hora_fin}-${indice}`
            })
        );
    };

    const obtenerHorariosDisponibles = () => {

        if (!fechaReserva) {
            return [];
        }

        const diaSemana =
            obtenerDiaSemana(
                fechaReserva
            );

        const disponibilidadesDelDia =
            disponibilidad.filter(
                (item) => {

                    const diaDisponibilidad =
                        item.dia_semana
                            ?.toLowerCase()
                            .normalize("NFD")
                            .replace(
                                /[\u0300-\u036f]/g,
                                ""
                            );

                    return (
                        diaDisponibilidad ===
                        diaSemana
                    );
                }
            );

        return generarHorariosDeUnaHora(
            disponibilidadesDelDia
        );
    };

    const formatearHora = (hora) => {

        if (!hora) {
            return "";
        }

        const partes =
            hora.split(":");

        const horas =
            Number(partes[0]);

        const minutos =
            partes[1];

        const periodo =
            horas >= 12
                ? "p. m."
                : "a. m.";

        const hora12 =
            horas % 12 || 12;

        return `${hora12}:${minutos} ${periodo}`;
    };

    const seleccionarFecha = (fecha) => {

        setFechaReserva(fecha);

        setHorarioSeleccionado(null);

        setMensaje("");

        setError("");

        setPaso(1);
    };

    const seleccionarHorario = (horario) => {

        setHorarioSeleccionado(horario);

        setError("");

        setPaso(2);
    };

    const continuar = () => {

        if (!fechaReserva) {

            setError(
                "Primero debes seleccionar una fecha."
            );

            return;
        }

        if (!horarioSeleccionado) {

            setError(
                "Selecciona un horario para continuar."
            );

            return;
        }

        setError("");

        setPaso(3);
    };

    const volverASeleccionarHorario = () => {

        setPaso(2);

        setMensaje("");

        setError("");
    };

    const reservarHorario = async () => {

        if (!fechaReserva) {

            setError(
                "Primero debes seleccionar una fecha."
            );

            return;
        }

        if (!horarioSeleccionado) {

            setError(
                "Primero debes seleccionar un horario."
            );

            return;
        }

        try {

            setError("");

            setMensaje("");

            const datosReserva = {

                idUsuario: 29,

                idInstructor:
                    instructorSeleccionado.id_instructor,

                idRutina:
                    rutinaSeleccionada.id_rutina,

                objetivo:
                    "Entrenamiento de fuerza",

                fecha:
                    fechaReserva,

                horaInicio:
                    horarioSeleccionado.hora_inicio,

                horaFin:
                    horarioSeleccionado.hora_fin,

                precio:
                    50000
            };

            console.log(
                "Datos de la reserva:",
                datosReserva
            );

            const respuesta =
                await crearReserva(
                    datosReserva
                );

            console.log(
                "Reserva creada:",
                respuesta
            );

            setMensaje(
                `Reserva creada correctamente. Número de reserva: ${
                    respuesta.id_reserva ||
                    respuesta.idReserva ||
                    respuesta.id
                }`
            );

        } catch (error) {

            console.error(
                "Error al crear reserva:",
                error
            );

            setError(
                error.message ||
                "No fue posible crear la reserva."
            );
        }
    };

    const horariosDisponibles =
        obtenerHorariosDisponibles();

    if (
        !rutinaSeleccionada ||
        !instructorSeleccionado
    ) {

        return (

            <section className="reserva-page">

                <div className="reserva-container">

                    <div className="reserva-card">

                        <h2>
                            No se pudo iniciar la reserva
                        </h2>

                        <p>
                            Debes seleccionar primero
                            una rutina y un instructor.
                        </p>

                        <button
                            type="button"
                            className="btn-reservar"
                            onClick={() =>
                                navigate("/rutinas")
                            }
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

                <div className="reserva-header">

                    <span className="reserva-tag">
                        Reserva
                    </span>

                    <h1>
                        Agenda tu{" "}
                        <em>entrenamiento</em>
                    </h1>

                    <p>
                        Completa los pasos para
                        reservar tu entrenamiento.
                    </p>

                </div>

                <div className="reserva-pasos">

                    <div
                        className={
                            paso >= 1
                                ? "reserva-paso-indicador activo"
                                : "reserva-paso-indicador"
                        }
                    >
                        <span>1</span>
                        <strong>Fecha</strong>
                    </div>

                    <div className="reserva-paso-linea"></div>

                    <div
                        className={
                            paso >= 2
                                ? "reserva-paso-indicador activo"
                                : "reserva-paso-indicador"
                        }
                    >
                        <span>2</span>
                        <strong>Horario</strong>
                    </div>

                    <div className="reserva-paso-linea"></div>

                    <div
                        className={
                            paso >= 3
                                ? "reserva-paso-indicador activo"
                                : "reserva-paso-indicador"
                        }
                    >
                        <span>3</span>
                        <strong>Confirmar</strong>
                    </div>

                </div>

                <div className="reserva-card">

                    <div className="reserva-detalles">

                        <div className="reserva-detalle">

                            <span>
                                Rutina
                            </span>

                            <strong>
                                {
                                    rutinaSeleccionada.nombre_rutina
                                }
                            </strong>

                        </div>

                        <div className="reserva-detalle">

                            <span>
                                Instructor
                            </span>

                            <strong>
                                {
                                    instructorSeleccionado.nombre
                                }{" "}
                                {
                                    instructorSeleccionado.apellido
                                }
                            </strong>

                        </div>

                    </div>

                    {paso === 1 && (

                        <div className="reserva-seccion">

                            <div className="reserva-paso-titulo">

                                <div className="reserva-paso-numero">
                                    1
                                </div>

                                <div>

                                    <h3>
                                        Selecciona una fecha
                                    </h3>

                                    <p>
                                        Elige el día en el
                                        que deseas realizar
                                        tu entrenamiento.
                                    </p>

                                </div>

                            </div>

                            <div className="reserva-campo">

                                <label htmlFor="fecha">

                                    📅 Fecha del
                                    entrenamiento

                                </label>

                                <input
                                    id="fecha"
                                    type="date"
                                    value={
                                        fechaReserva
                                    }
                                    min={
                                        obtenerFechaLocal()
                                    }
                                    onChange={(e) =>
                                        seleccionarFecha(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            {!fechaReserva && (

                                <div className="reserva-ayuda">

                                    👆 Selecciona una fecha
                                    para consultar los
                                    horarios disponibles.

                                </div>

                            )}

                            {fechaReserva && (

                                <button
                                    type="button"
                                    className="btn-continuar"
                                    onClick={() =>
                                        setPaso(2)
                                    }
                                >
                                    Ver horarios disponibles →
                                </button>

                            )}

                        </div>

                    )}

                    {paso === 2 && (

                        <div className="reserva-seccion">

                            <div className="reserva-paso-titulo">

                                <div className="reserva-paso-numero">
                                    2
                                </div>

                                <div>

                                    <h3>
                                        Selecciona un horario
                                    </h3>

                                    <p>
                                        Selecciona uno de los
                                        horarios disponibles
                                        de una hora.
                                    </p>

                                </div>

                            </div>

                            <div className="reserva-fecha-elegida">

                                📅 Fecha seleccionada:

                                <strong>
                                    {" "}
                                    {fechaReserva}
                                </strong>

                            </div>

                            {cargando && (

                                <div className="reserva-ayuda">

                                    Buscando horarios
                                    disponibles...

                                </div>

                            )}

                            {!cargando &&
                                horariosDisponibles.length === 0 && (

                                    <div className="reserva-ayuda">

                                        ❌ No hay horarios
                                        disponibles para esta
                                        fecha.

                                        <br />

                                        <small>
                                            Puedes volver y
                                            seleccionar otro día.
                                        </small>

                                    </div>

                                )}

                            {!cargando &&
                                horariosDisponibles.length > 0 && (

                                    <>

                                        <div className="reserva-instruccion">

                                            👆 Selecciona uno de
                                            los horarios disponibles:

                                        </div>

                                        <div className="horarios-lista">

                                            {horariosDisponibles.map(
                                                (horario) => {

                                                    const seleccionado =
                                                        horarioSeleccionado
                                                            ?.id_horario ===
                                                        horario.id_horario;

                                                    return (

                                                        <button
                                                            type="button"
                                                            key={
                                                                horario.id_horario
                                                            }
                                                            className={
                                                                seleccionado
                                                                    ? "horario-item seleccionado"
                                                                    : "horario-item"
                                                            }
                                                            onClick={() =>
                                                                seleccionarHorario(
                                                                    horario
                                                                )
                                                            }
                                                        >

                                                            <div className="horario-hora">

                                                                🕐{" "}

                                                                {
                                                                    formatearHora(
                                                                        horario.hora_inicio
                                                                    )
                                                                }

                                                                {" - "}

                                                                {
                                                                    formatearHora(
                                                                        horario.hora_fin
                                                                    )
                                                                }

                                                            </div>

                                                            <div className="horario-estado">

                                                                {seleccionado
                                                                    ? "✓ Horario seleccionado"
                                                                    : "🟢 Disponible"}

                                                            </div>

                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                        {horarioSeleccionado && (

                                            <div className="reserva-continuar">

                                                <div className="reserva-seleccion-confirmada">

                                                    ✓ Has seleccionado:

                                                    <strong>
                                                        {" "}
                                                        {
                                                            formatearHora(
                                                                horarioSeleccionado.hora_inicio
                                                            )
                                                        }

                                                        {" - "}

                                                        {
                                                            formatearHora(
                                                                horarioSeleccionado.hora_fin
                                                            )
                                                        }
                                                    </strong>

                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn-continuar"
                                                    onClick={
                                                        continuar
                                                    }
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
                                onClick={() =>
                                    setPaso(1)
                                }
                            >
                                ← Cambiar fecha
                            </button>

                        </div>

                    )}

                    {paso === 3 && (

                        <div className="reserva-seccion">

                            <div className="reserva-paso-titulo">

                                <div className="reserva-paso-numero">
                                    3
                                </div>

                                <div>

                                    <h3>
                                        Confirma tu reserva
                                    </h3>

                                    <p>
                                        Revisa los datos de tu
                                        entrenamiento antes de
                                        confirmar.
                                    </p>

                                </div>

                            </div>

                            <div className="reserva-resumen">

                                <div className="reserva-resumen-item">

                                    <span>
                                        🏋️ Rutina
                                    </span>

                                    <strong>
                                        {
                                            rutinaSeleccionada.nombre_rutina
                                        }
                                    </strong>

                                </div>

                                <div className="reserva-resumen-item">

                                    <span>
                                        👤 Instructor
                                    </span>

                                    <strong>
                                        {
                                            instructorSeleccionado.nombre
                                        }{" "}
                                        {
                                            instructorSeleccionado.apellido
                                        }
                                    </strong>

                                </div>

                                <div className="reserva-resumen-item">

                                    <span>
                                        📅 Fecha
                                    </span>

                                    <strong>
                                        {fechaReserva}
                                    </strong>

                                </div>

                                <div className="reserva-resumen-item">

                                    <span>
                                        🕐 Horario
                                    </span>

                                    <strong>

                                        {
                                            formatearHora(
                                                horarioSeleccionado.hora_inicio
                                            )
                                        }

                                        {" - "}

                                        {
                                            formatearHora(
                                                horarioSeleccionado.hora_fin
                                            )
                                        }

                                    </strong>

                                </div>

                            </div>

                            <div className="reserva-confirmacion-ayuda">

                                🔎 Revisa que la fecha y el
                                horario sean correctos.

                            </div>

                            <div className="reserva-botones-finales">

                                <button
                                    type="button"
                                    className="btn-volver-paso"
                                    onClick={
                                        volverASeleccionarHorario
                                    }
                                >
                                    ← Cambiar horario
                                </button>

                                <button
                                    type="button"
                                    className="btn-reservar"
                                    onClick={
                                        reservarHorario
                                    }
                                >
                                    Confirmar reserva
                                </button>

                            </div>

                        </div>

                    )}

                    {error && (

                        <div className="reserva-error">

                            {error}

                        </div>

                    )}

                    {mensaje && (

                        <div className="reserva-exitosa">

                            <div className="reserva-exitosa-icono">
                                ✓
                            </div>

                            <h2>
                                ¡Reserva realizada!
                            </h2>

                            <p>
                                {mensaje}
                            </p>

                            <button
                                type="button"
                                className="btn-reservar"
                                onClick={() =>
                                    navigate("/")
                                }
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