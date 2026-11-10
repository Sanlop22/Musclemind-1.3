import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../services/api'
import { obtenerUsuario } from '../utils/session'
import './Disponibilidad.css'

function Disponibilidad() {
    const navigate = useNavigate()
    const usuario = obtenerUsuario()

    const [diaSemana, setDiaSemana] = useState('lunes')
    const [horaInicio, setHoraInicio] = useState('08:00')
    const [horaFin, setHoraFin] = useState('12:00')
    const [horarios, setHorarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [actualizando, setActualizando] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')

    const idInstructor = usuario?.id_instructor

    const cargarHorarios = async () => {
        if (!idInstructor) {
            setError('No se encontró el identificador de tu perfil de instructor.')
            setCargando(false)
            return
        }

        try {
            setError('')

            const datos = await apiFetch(
                `/disponibilidad/instructor/${idInstructor}`
            )

            setHorarios(Array.isArray(datos) ? datos : [])
        } catch (err) {
            setError(err.message || 'No fue posible cargar tus horarios.')
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        cargarHorarios()
    }, [])

    const registrarHorario = async (e) => {
        e.preventDefault()

        setMensaje('')
        setError('')

        if (horaFin <= horaInicio) {
            setError('La hora de finalización debe ser posterior a la hora de inicio.')
            return
        }

        try {
            setGuardando(true)

            await apiFetch('/disponibilidad', {
                method: 'POST',
                body: {
                    diaSemana,
                    horaInicio,
                    horaFin
                }
            })

            setMensaje('¡Tu horario se registró correctamente!')

            setHoraInicio('08:00')
            setHoraFin('12:00')

            await cargarHorarios()
        } catch (err) {
            setError(err.message || 'No fue posible registrar el horario.')
        } finally {
            setGuardando(false)
        }
    }

    const cambiarEstado = async (horario) => {
        setMensaje('')
        setError('')

        const nuevoEstado = horario.estado === 'disponible'
            ? 'no_disponible'
            : 'disponible'

        try {
            setActualizando(horario.id_disponibilidad)

            await apiFetch(`/disponibilidad/${horario.id_disponibilidad}`, {
                method: 'PUT',
                body: {
                    diaSemana: horario.dia_semana,
                    horaInicio: String(horario.hora_inicio).slice(0, 5),
                    horaFin: String(horario.hora_fin).slice(0, 5),
                    estado: nuevoEstado
                }
            })

            setMensaje('El estado del horario se actualizó correctamente.')

            await cargarHorarios()
        } catch (err) {
            setError(err.message || 'No fue posible cambiar el estado del horario.')
        } finally {
            setActualizando(null)
        }
    }

    const nombreDia = (dia) => {
        const dias = {
            lunes: 'Lunes',
            martes: 'Martes',
            miercoles: 'Miércoles',
            jueves: 'Jueves',
            viernes: 'Viernes',
            sabado: 'Sábado',
            domingo: 'Domingo'
        }

        return dias[dia] || dia
    }

    return (
        <main className="disponibilidad-container">

            <header className="disponibilidad-header">

                <button
                    type="button"
                    className="btn-volver"
                    onClick={() => navigate('/')}
                >
                    ← Volver
                </button>

                <h1>Mi disponibilidad</h1>

                <p>
                    Administra los días y horarios en los que puedes atender
                    a tus deportistas.
                </p>

            </header>

            <section className="disponibilidad-formulario">
                <h2>Registrar nuevo horario</h2>

                <form onSubmit={registrarHorario}>

                    <div className="disponibilidad-campo">
                        <label htmlFor="diaSemana">
                            Día de la semana
                        </label>

                        <select
                            id="diaSemana"
                            value={diaSemana}
                            onChange={(e) => setDiaSemana(e.target.value)}
                        >
                            <option value="lunes">Lunes</option>
                            <option value="martes">Martes</option>
                            <option value="miercoles">Miércoles</option>
                            <option value="jueves">Jueves</option>
                            <option value="viernes">Viernes</option>
                            <option value="sabado">Sábado</option>
                            <option value="domingo">Domingo</option>
                        </select>
                    </div>

                    <div className="disponibilidad-horas">

                        <div className="disponibilidad-campo">
                            <label htmlFor="horaInicio">
                                Hora de inicio
                            </label>

                            <input
                                id="horaInicio"
                                type="time"
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                                required
                            />
                        </div>

                        <div className="disponibilidad-campo">
                            <label htmlFor="horaFin">
                                Hora de finalización
                            </label>

                            <input
                                id="horaFin"
                                type="time"
                                value={horaFin}
                                onChange={(e) => setHoraFin(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    {error && (
                        <p className="disponibilidad-error">
                            {error}
                        </p>
                    )}

                    {mensaje && (
                        <p className="disponibilidad-exito">
                            {mensaje}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={guardando}
                        className="disponibilidad-boton"
                    >
                        {guardando ? 'Guardando...' : 'Guardar horario'}
                    </button>

                </form>
            </section>

            <section className="disponibilidad-listado">
                <h2>Mis horarios registrados</h2>

                {cargando ? (
                    <p>Cargando horarios...</p>
                ) : horarios.length === 0 ? (
                    <p className="disponibilidad-vacio">
                        Todavía no has registrado horarios disponibles.
                    </p>
                ) : (
                    <div className="disponibilidad-lista">

                        {horarios.map((horario) => (
                            <article
                                className="disponibilidad-tarjeta"
                                key={horario.id_disponibilidad}
                            >
                                <div>
                                    <h3>
                                        {nombreDia(horario.dia_semana)}
                                    </h3>

                                    <p>
                                        {String(horario.hora_inicio).slice(0, 5)}
                                        {' - '}
                                        {String(horario.hora_fin).slice(0, 5)}
                                    </p>
                                </div>

                                <div className="disponibilidad-acciones">

                                    <span
                                        className={
                                            horario.estado === 'disponible'
                                                ? 'disponibilidad-estado'
                                                : 'disponibilidad-estado no-disponible'
                                        }
                                    >
                                        {horario.estado === 'disponible'
                                            ? 'Disponible'
                                            : 'No disponible'}
                                    </span>

                                    <button
                                        type="button"
                                        className="disponibilidad-boton"
                                        disabled={actualizando !== null}
                                        onClick={() => cambiarEstado(horario)}
                                    >
                                        {actualizando === horario.id_disponibilidad
                                            ? 'Actualizando...'
                                            : horario.estado === 'disponible'
                                                ? 'Marcar como no disponible'
                                                : 'Marcar como disponible'}
                                    </button>

                                </div>
                            </article>
                        ))}

                    </div>
                )}
            </section>

        </main>
    )
}

export default Disponibilidad