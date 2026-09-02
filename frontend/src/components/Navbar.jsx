function Navbar() {
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

      <button className="nav-cta">
        EMPEZAR AHORA
      </button>
    </nav>
  )
}

export default Navbar