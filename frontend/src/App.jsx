import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Seguimiento from './pages/Seguimiento'
import Rutinas from './pages/Rutinas'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/seguimiento" element={<Seguimiento />} />

        <Route path="/rutinas" element={<Rutinas />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App