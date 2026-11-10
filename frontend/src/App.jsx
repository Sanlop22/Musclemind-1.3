
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Seguimiento from './pages/Seguimiento'
import Rutinas from './pages/Rutinas'
import Instructores from './pages/Instructores'
import Mensajes from './pages/Mensajes'
import MisMensajes from './pages/MisMensajes'
import Reserva from './pages/Reserva'
import Historial from './pages/Historial'
import Calificaciones from './pages/Calificaciones'
import MisReservas from './pages/MisReservas'
import Pagos from './pages/Pagos'
import Disponibilidad from './pages/Disponibilidad'
import ConversacionesInstructor from './pages/ConversacionesInstructor'
import ReservasInstructor from './pages/ReservasInstructor'

import RutaProtegida from './components/RutaProtegida'

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/seguimiento"
                    element={
                        <RutaProtegida>
                            <Seguimiento />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/rutinas"
                    element={
                        <RutaProtegida>
                            <Rutinas />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/instructores"
                    element={
                        <RutaProtegida>
                            <Instructores />
                        </RutaProtegida>
                    }
                />

                {/* Chat del deportista con un instructor */}
                <Route
                    path="/mensajes/:idInstructor"
                    element={
                        <RutaProtegida roles={['usuario']}>
                            <Mensajes />
                        </RutaProtegida>
                    }
                />

                {/* Chat del instructor con un deportista */}
                <Route
                    path="/mensajes/usuario/:idUsuario"
                    element={
                        <RutaProtegida roles={['instructor']}>
                            <Mensajes />
                        </RutaProtegida>
                    }
                />

                {/* Bandeja de mensajes del deportista */}
                <Route
                    path="/mis-mensajes"
                    element={
                        <RutaProtegida roles={['usuario']}>
                            <MisMensajes />
                        </RutaProtegida>
                    }
                />

                {/* Bandeja de conversaciones del instructor */}
                <Route
                    path="/conversaciones"
                    element={
                        <RutaProtegida roles={['instructor']}>
                            <ConversacionesInstructor />
                        </RutaProtegida>
                    }
                />

                {/* Crear reserva */}
                <Route
                    path="/reserva"
                    element={
                        <RutaProtegida>
                            <Reserva />
                        </RutaProtegida>
                    }
                />

                {/* Historial */}
                <Route
                    path="/historial"
                    element={
                        <RutaProtegida>
                            <Historial />
                        </RutaProtegida>
                    }
                />

                {/* Calificaciones */}
                <Route
                    path="/calificaciones"
                    element={
                        <RutaProtegida>
                            <Calificaciones />
                        </RutaProtegida>
                    }
                />

                {/* Reservas del deportista */}
                <Route
                    path="/mis-reservas"
                    element={
                        <RutaProtegida>
                            <MisReservas />
                        </RutaProtegida>
                    }
                />

                {/* Pagos */}
                <Route
                    path="/pagos"
                    element={
                        <RutaProtegida>
                            <Pagos />
                        </RutaProtegida>
                    }
                />

                {/* Disponibilidad del instructor */}
                <Route
                    path="/disponibilidad"
                    element={
                        <RutaProtegida roles={['instructor']}>
                            <Disponibilidad />
                        </RutaProtegida>
                    }
                />

                {/* Reservas del instructor */}
                <Route
                    path="/reservas-instructor"
                    element={
                        <RutaProtegida roles={['instructor']}>
                            <ReservasInstructor />
                        </RutaProtegida>
                    }
                />

            </Routes>
        </BrowserRouter>
    )
}

export default App
