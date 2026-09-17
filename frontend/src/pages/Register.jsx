import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
  nombre: "",
  apellido: "",
  numero_documento: "",
  tipo_documento: "",
  correo: "",
  contrasena: "",
  edad: "",
  peso: "",
  altura: "",
  pais: "",
});

const handleChange = (e) => {
const { name, value } = e.target;

setFormData({
  ...formData,
  [name]: value,
});

};

const handleSubmit = async (e) => {
e.preventDefault();

try {
  const response = await fetch("http://localhost:3000/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...formData,
      edad: Number(formData.edad),
      peso: Number(formData.peso),
      altura: Number(formData.altura),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al registrar el usuario");
  }

  alert("Usuario registrado correctamente");

setFormData({
  nombre: "",
  apellido: "",
  numero_documento: "",
  tipo_documento: "",
  correo: "",
  contrasena: "",
  edad: "",
  peso: "",
  altura: "",
  pais: "",
});

document.activeElement?.blur();
} catch (error) {
  console.error("Error:", error);
  alert(error.message);
}

};

return (
<div className="register-container">

  <button
    className="btn-back"
    onClick={() => navigate("/")}
  >
    ← Volver
  </button>

  <div className="register-logo">
    💪 <span>MUSCLE</span>MIND
  </div>

  <div className="register-tag">
    CREA TU CUENTA
  </div>

  <h1>Crear cuenta</h1>

  <p className="register-description">
    Completa tus datos y comienza a trabajar en tu mejor versión.
  </p>

  <form className="register-form" onSubmit={handleSubmit}>

    <div>
      <label>Nombre</label>
      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />
    </div>

    <div>
      <label>Apellido</label>
      <input
        type="text"
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        required
      />
    </div>

    <div>
      <label>Tipo de documento</label>
      <select
        name="tipo_documento"
        value={formData.tipo_documento}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione</option>
        <option value="CC">Cédula de ciudadanía</option>
        <option value="TI">Tarjeta de identidad</option>
        <option value="CE">Cédula de extranjería</option>
      </select>
    </div>

    <div>
      <label>Número de documento</label>
      <input
        type="text"
        name="numero_documento"
        value={formData.numero_documento}
        onChange={handleChange}
        required
      />
    </div>

    <div>
  <label>Correo electrónico</label>
  <input
    type="email"
    name="correo"
    value={formData.correo}
    onChange={handleChange}
    required
  />
</div>
    
   

    <div>
      <label>Contraseña</label>
      <input
        type="password"
        name="contrasena"
        value={formData.contrasena}
        onChange={handleChange}
        required
      />
    </div>

    <div>
      <label>Edad</label>
      <input
        type="number"
        name="edad"
        value={formData.edad}
        onChange={handleChange}
        required
      />
    </div>

    <div>
      <label>Peso (kg)</label>
      <input
        type="number"
        name="peso"
        value={formData.peso}
        onChange={handleChange}
        step="0.1"
        required
      />
    </div>

    <div>
      <label>Altura (cm)</label>
      <input
        type="number"
        name="altura"
        value={formData.altura}
        onChange={handleChange}
        step="0.1"
        required
      />
    </div>

    <div>
      <label>País</label>
      <input
        type="text"
        name="pais"
        value={formData.pais}
        onChange={handleChange}
        required
      />
    </div>

    <button type="submit">Registrarse</button>

  </form>

</div>

);
}

export default Register;