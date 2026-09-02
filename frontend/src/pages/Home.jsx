import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import Pilares from '../components/Pilares'
import Rutinas from '../components/Rutinas'
import Progreso from '../components/Progreso'
import CtaFinal from '../components/CtaFinal'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar />
      <Pilares />
      <Rutinas />
      <Progreso />
      <CtaFinal />
      <Footer />
    </>
  )
}

export default Home