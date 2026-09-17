import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        'http://localhost:3000/api/usuarios/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      alert(data.mensaje)

      console.log('Usuario:', data.usuario)

      navigate('/')

    } catch (error) {
      console.error('Error:', error)
      alert(error.message)
    }
  }

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

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              name="correo"
              placeholder="Ingresa tu correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              name="contrasena"
              placeholder="Ingresa tu contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required
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