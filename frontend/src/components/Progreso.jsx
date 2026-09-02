function Progreso() {
  return (
    <section className="progress-section" id="progreso">
      <div className="section-inner">

        <div className="progress-layout">

          <div>
            <p className="section-tag">Tu evolución</p>

            <h2 className="section-title">
              Cada sesión <em>cuenta</em>
            </h2>

            <p className="section-desc">
              Visualiza en tiempo real cómo cambia tu cuerpo semana
              a semana. El progreso real es invisible en el día a
              día, pero imparable en el tiempo.
            </p>

            <ul className="progress-list">

              <li className="progress-item">
                <div className="progress-label">
                  <span>Constancia semanal</span>
                  <span>87%</span>
                </div>

                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: '87%' }}
                  ></div>
                </div>
              </li>

              <li className="progress-item">
                <div className="progress-label">
                  <span>Ganancia de masa</span>
                  <span>+2.3 kg</span>
                </div>

                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: '72%' }}
                  ></div>
                </div>
              </li>

              <li className="progress-item">
                <div className="progress-label">
                  <span>Reducción de grasa</span>
                  <span>-4.1%</span>
                </div>

                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: '65%' }}
                  ></div>
                </div>
              </li>

              <li className="progress-item">
                <div className="progress-label">
                  <span>Racha activa</span>
                  <span>12 días</span>
                </div>

                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: '55%' }}
                  ></div>
                </div>
              </li>

            </ul>
          </div>

          <div className="progress-visual">

            <p className="pv-title">
              OBJETIVO ACTUAL
            </p>

            <p className="pv-goal">
              GANAR MASA MUSCULAR
            </p>

            <div className="pv-metric">
              <span className="pv-num">78.4</span>
              <span className="pv-unit">kg · Peso</span>
            </div>

            <p className="pv-sub">
              ↑ +2.3 kg desde el inicio
            </p>

            <div className="pv-divider">

              <div className="pv-metric">
                <span className="pv-num small">
                  71.5
                </span>

                <span className="pv-unit">
                  % · Masa muscular
                </span>
              </div>

              <p className="pv-sub">
                Semana 6 · En progreso
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default Progreso