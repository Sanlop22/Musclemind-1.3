import { useNavigate } from 'react-router-dom'

function Login() {
const navigate = useNavigate()

return (
<div className="login-page">

  <div className="login-card">

    <div className="login-logo">
      💪 MUSCLE<span>MIND</span>
    </div>

    <p className="login-tag">
      BIENVENIDO DE NUEVO
    </p>

    <h1>Iniciar sesión</h1>

    <p className="login-description">
      Ingresa a tu cuenta y continúa trabajando en tu mejor versión.
    </p>

    <form className="login-form">

      <div className="form-group">
        <label htmlFor="email">
          Correo electrónico
        </label>

        <input
          id="email"
          type="email"
          placeholder="Ingresa tu correo"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          Contraseña
        </label>

        <input
          id="password"
          type="password"
          placeholder="Ingresa tu contraseña"
        />
      </div>

      <button
        type="submit"
        className="login-button"
      >
        INGRESAR
      </button>

    </form>

    <button
      className="back-home"
      onClick={() => navigate('/')}
    >
      ← Volver al inicio
    </button>

  </div>

</div>

)
}

export default Login