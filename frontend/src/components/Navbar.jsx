import { useNavigate } from 'react-router-dom'
import { haySesion, obtenerUsuario, cerrarSesion } from '../utils/session'

function Navbar() {
  const navigate = useNavigate()
  const sesionActiva = haySesion()

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
          <a href="#pilares">Pilares</a>
        </li>

        <li>
          <a href="#rutinas">Rutinas</a>
        </li>

        <li>
          <a href="#progreso">Progreso</a>
        </li>
      </ul>

      {sesionActiva ? (
        <button className="nav-cta" onClick={handleCerrarSesion}>
          CERRAR SESIÓN ({obtenerUsuario().nombre})
        </button>
      ) : (
        <button className="nav-cta" onClick={() => navigate('/login')}>
          EMPEZAR AHORA
        </button>
      )}
    </nav>
  )
}

export default Navbar
