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

                <Route
                    path="/seguimiento"
                    element={<Seguimiento />}
                />

                <Route
                    path="/rutinas"
                    element={<Rutinas />}
                />

                <Route
                    path="/instructores"
                    element={<Instructores />}
                />

                <Route
                    path="/mensajes/:idInstructor"
                    element={<Mensajes />}
                />

                <Route
                    path="/reserva"
                    element={<Reserva />}
                />

                <Route
    path="/historial"
    element={<Historial />}
/>

<Route
    path="/calificaciones"
    element={<Calificaciones />}
/>
<Route
    path="/mis-reservas"
    element={<MisReservas />}
/>

<Route path="/mis-reservas" element={<MisReservas />} />
<Route path="/pagos" element={<Pagos />} />

            </Routes>

        </BrowserRouter>
    )
}

export default App