import { useNavigate } from 'react-router-dom'

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero">
      <p className="hero-eyebrow">
        Tu mejor versión te espera
      </p>

      <h1>
        ENTRENA TU CUERPO
        <br />
        Y <em>FORTALECE</em>
        <br />
        TU MENTE.
      </h1>

      <p className="hero-sub">
        Rutinas personalizadas, seguimiento de progreso y
        comunicación directa con tu entrenador — todo en un
        solo lugar.
      </p>

      <div className="hero-actions">
        <button
          className="btn-primary"
          onClick={() => navigate('/login')}
        >
          Iniciar Sesión
        </button>

        <button
          className="btn-outline"
          onClick={() => navigate('/register')}
        >
          Crear Cuenta
        </button>
      </div>
    </section>
  )
}

export default Hero