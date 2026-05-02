import { motion } from 'framer-motion'
import { CirclePlay, Headphones, RadioTower } from 'lucide-react'

export default function Hero() {
  return (
    <section className="hero-section" id="inicio">
      <div className="hero-backdrop" />
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="eyebrow">Trabalho USP</p>
        <h1>Do Beat ao Bit</h1>
        <p>
          A música digital representa uma das maiores transformações tecnológicas da história do som.
          Ao converter sinais analógicos em dados numéricos, tornou-se possível armazenar, processar e
          distribuir áudio com precisão e eficiência.
        </p>
        <p>
          Este site apresenta a evolução do áudio digital, desde os primeiros experimentos computacionais
          até os formatos modernos, explicando seus fundamentos, tecnologias e impactos na sociedade.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#simulador">
            <Headphones size={18} />
            Experimentar áudio
          </a>
          <a className="secondary-button" href="#video">
            <CirclePlay size={18} />
            Assista ao vídeo explicativo
          </a>
        </div>
      </motion.div>
      <motion.div
        className="hero-visual"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="orbital relative flex items-center justify-center w-64 h-64">
  <RadioTower className="z-10 w-12 h-12 text-pink-500" />
  {Array.from({ length: 84 }).map((_, index) => (
    <span 
      key={index} 
      style={{ '--i': index }} 
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-1/2 origin-bottom bg-gradient-to-t from-pink-500 to-transparent opacity-50" 
    />
  ))}
</div>
      </motion.div>
    </section>
  )
}
