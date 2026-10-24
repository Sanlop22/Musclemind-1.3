import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Seguimiento from './pages/Seguimiento'
import Rutinas from './pages/Rutinas'
import Instructores from './pages/Instructores'
import Mensajes from './pages/Mensajes'
import Reserva from './pages/Reserva'
import Historial from './pages/Historial'
import Calificaciones from './pages/Calificaciones'
import MisReservas from './pages/MisReservas'
import Pagos from './pages/Pagos'
import RutaProtegida from './components/RutaProtegida'

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route path="/seguimiento" element={<RutaProtegida><Seguimiento /></RutaProtegida>} />

                <Route path="/rutinas" element={<RutaProtegida><Rutinas /></RutaProtegida>} />

                <Route path="/instructores" element={<RutaProtegida><Instructores /></RutaProtegida>} />

                <Route path="/mensajes/:idInstructor" element={<RutaProtegida><Mensajes /></RutaProtegida>} />

                <Route path="/reserva" element={<RutaProtegida><Reserva /></RutaProtegida>} />

                <Route path="/historial" element={<RutaProtegida><Historial /></RutaProtegida>} />

<Route path="/calificaciones" element={<RutaProtegida><Calificaciones /></RutaProtegida>} />
<Route path="/mis-reservas" element={<RutaProtegida><MisReservas /></RutaProtegida>} />

<Route path="/pagos" element={<RutaProtegida><Pagos /></RutaProtegida>} />

            </Routes>

        </BrowserRouter>
    )
}

export default App