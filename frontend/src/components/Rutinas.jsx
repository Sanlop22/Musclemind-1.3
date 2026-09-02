function Rutinas() {
  return (
    <section id="rutinas">
      <div className="section-inner">
        <p className="section-tag">Entrenamiento</p>

        <h2 className="section-title">
          Rutinas para <em>cada objetivo</em>
        </h2>

        <p className="section-desc">
          Selecciona la rutina que se adapta a tu nivel y metas.
          Cada plan fue diseñado por entrenadores certificados.
        </p>

        <div className="routines-grid">

          <div className="routine-card">
            <div className="routine-badge">Intermedio</div>
            <h3>Pecho & Tríceps</h3>
            <p>
              Enfocado en fuerza funcional y masa muscular en tren
              superior. Incluye press banca, fondos y cables.
            </p>

            <div className="routine-meta">
              <span>⏱️ 55 min</span>
              <span>💪 8 ejercicios</span>
            </div>
          </div>

          <div className="routine-card">
            <div className="routine-badge">Avanzado</div>
            <h3>Espalda & Bíceps</h3>
            <p>
              Volumen alto para máximo crecimiento. Dominadas,
              remos y curls en superset para mayor densidad.
            </p>

            <div className="routine-meta">
              <span>⏱️ 60 min</span>
              <span>💪 10 ejercicios</span>
            </div>
          </div>

          <div className="routine-card">
            <div className="routine-badge">Avanzado</div>
            <h3>Piernas & Glúteos</h3>
            <p>
              Sentadillas, peso muerto y prensa para desarrollar
              potencia y definición en tren inferior.
            </p>

            <div className="routine-meta">
              <span>⏱️ 65 min</span>
              <span>💪 8 ejercicios</span>
            </div>
          </div>

          <div className="routine-card">
            <div className="routine-badge">Intermedio</div>
            <h3>Hombros & Core</h3>
            <p>
              Estabilidad y fuerza en deltoides y núcleo. Clave
              para prevenir lesiones y mejorar postura.
            </p>

            <div className="routine-meta">
              <span>⏱️ 45 min</span>
              <span>💪 7 ejercicios</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Rutinas