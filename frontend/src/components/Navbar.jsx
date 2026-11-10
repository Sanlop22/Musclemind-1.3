
import { useNavigate, Link } from 'react-router-dom'
import {
  haySesion,
  obtenerUsuario,
  cerrarSesion
} from '../utils/session'

function Navbar() {
  const navigate = useNavigate()
  const sesionActiva = haySesion()
  const usuario = obtenerUsuario()

  const esInstructor = usuario?.rol === 'instructor'
  const esDeportista = usuario?.rol === 'usuario'

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <nav>
      <div className="nav-logo">
        💪 MUSCLE<span>MIND</span>
      </div>

      <ul className="nav-links">
        <li>
          <a href="/#pilares">Pilares</a>
        </li>

        <li>
          <a href="/#rutinas">Rutinas</a>
        </li>

        <li>
          <a href="/#progreso">Progreso</a>
        </li>

        {/* Opciones del instructor */}
        {sesionActiva && esInstructor && (
          <>
            <li>
              <Link to="/disponibilidad">
                Administrar horarios
              </Link>
            </li>

            <li>
              <Link to="/conversaciones">
                Mis conversaciones
              </Link>
            </li>
          </>
        )}
         <li>
              <Link to="/reservas-instructor">
                Mis reservas
              </Link>
            </li>

        {/* Opciones del deportista */}
        {sesionActiva && esDeportista && (
          <>
            <li>
              <Link to="/instructores">
                Buscar instructores
              </Link>
            </li>

            <li>
              <Link to="/mis-reservas">
                Mis reservas
              </Link>
            </li>

            <li>
              <Link to="/mis-mensajes">
                Mis mensajes
              </Link>
            </li>
          </>
        )}
      </ul>

      {sesionActiva ? (
        <button
          className="nav-cta"
          onClick={handleCerrarSesion}
        >
          CERRAR SESIÓN ({usuario.nombre})
        </button>
      ) : (
        <button
          className="nav-cta"
          onClick={() => navigate('/login')}
        >
          EMPEZAR AHORA
        </button>
      )}
    </nav>
  )
}

export default Navbar
