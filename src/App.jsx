import { Binary, BrainCircuit, Cpu, Music2, Radio, Sparkles, Waves } from 'lucide-react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Section from './components/Section'
import Timeline from './components/Timeline'
import AudioTechCards from './components/AudioTechCards'
import AudioSimulator from './components/AudioSimulator'
import VideoSection from './components/VideoSection'
import Footer from './components/Footer'
import TomsDinerPlayer from './components/TomsDinerPlayer'

const conceptCards = [
  {
    icon: Waves,
    title: 'Som analógico',
    text: 'Ondas contínuas viajam pelo ar e variam suavemente no tempo, como a voz, um violão ou uma palma.',
  },
  {
    icon: Binary,
    title: 'Conversão para dados',
    text: 'O sinal é medido milhares de vezes por segundo e transformado em números que o computador entende.',
  },
  {
    icon: Cpu,
    title: 'Processamento digital',
    text: 'Depois de digitalizado, o áudio pode ser comprimido, editado, transmitido, sintetizado e analisado.',
  },
]

const digitalStructure = [
  ['Amostragem', 'Captura do sinal em intervalos regulares de tempo.'],
  ['Quantização', 'Conversão dos valores em níveis discretos.'],
  ['Codificação', 'Transformação desses valores em dados binários.'],
]

const impacts = [
  'Fim da dependência de mídias físicas',
  'Facilidade de distribuição',
  'Streaming',
  'Democratização da produção musical',
  'Mudanças na indústria fonográfica',
  'Maior interação entre artistas e público',
]

function playSynthTone(frequency) {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return
  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.38)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.42)
}

function SignalTransform() {
  return (
    <div className="signal-lab" aria-label="Ilustração de onda analógica convertida em amostras e binário">
      <div className="signal-wave">
        {Array.from({ length: 42 }).map((_, index) => (
          <span key={index} style={{ '--i': index }} />
        ))}
      </div>
      <div className="sample-row">
        {Array.from({ length: 18 }).map((_, index) => (
          <i key={index} style={{ '--i': index }} />
        ))}
      </div>
      <div className="binary-rain">
        {Array.from({ length: 72 }).map((_, index) => (
          <b key={index}>{index % 3 === 0 ? 1 : 0}</b>
        ))}
      </div>
    </div>
  )
}

function InstrumentSection() {
  return (
    <div className="instrument-grid">
      <div>
        <p className="eyebrow">Computador como instrumento</p>
        <h2>Matemática virando timbre</h2>
        <p>
          O desenvolvimento da música digital está ligado à ideia do computador como instrumento musical.
          Pesquisas pioneiras demonstraram que qualquer som audível pode ser gerado por computador,
          desde que seja descrito matematicamente.
        </p>
      </div>
      <div className="computer-visual">
        <div className="screen">
          <span className="scanline" />
          <div className="terminal-lines">
            <i />
            <i />
            <i />
          </div>
          <div className="oscilloscope">
            {Array.from({ length: 54 }).map((_, index) => (
              <span key={index} style={{ '--i': index }} />
            ))}
          </div>
        </div>
        <div className="keyboard">
          {Array.from({ length: 17 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function NyquistSection() {
  return (
    <div className="nyquist-grid">
      <article className="glass-card theorem-card">
        <BrainCircuit />
        <h3>Teorema de Nyquist-Shannon</h3>
        <p>
          Um sinal pode ser reconstruído corretamente se a taxa de amostragem for maior que o dobro
          da maior frequência presente no sinal original.
        </p>
        <div className="formula">fs &gt; 2 x fmax</div>
      </article>
      <article className="glass-card alias-card">
        <Radio />
        <h3>Aliasing</h3>
        <p>
          Quando a condição não é atendida, frequências altas podem ser interpretadas como frequências
          mais baixas, causando distorções.
        </p>
        <div className="alias-visual">
          <span />
          <span />
        </div>
      </article>
    </div>
  )
}

function SynthSection() {
  const keys = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77]

  return (
    <div className="synth-panel">
      <div>
        <p className="eyebrow">Síntese sonora</p>
        <h2>Sons criados sem gravar uma fonte real</h2>
        <p>
          A síntese sonora permite gerar sons por meio de modelos matemáticos. Isso abre espaço para
          novos timbres, simulação de instrumentos e paisagens sonoras impossíveis no mundo acústico.
        </p>
      </div>
      <div className="synth">
        <div className="synth-knobs">
          {['OSC', 'ENV', 'FILTER', 'LFO'].map((label) => (
            <button key={label} type="button" aria-label={label}>
              <span />
              {label}
            </button>
          ))}
        </div>
        <div className="synth-keys">
          {keys.map((frequency, index) => (
            <button
              type="button"
              key={frequency}
              className={index % 3 === 1 ? 'black' : ''}
              aria-label={`Tocar nota ${Math.round(frequency)} Hz`}
              onPointerDown={() => playSynthTone(frequency)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <Section id="musica-digital" eyebrow="Conceito" title="O que é música digital">
          <p className="section-lead">
            A música digital é a representação do som em formato numérico. Sinais contínuos são
            convertidos em dados discretos, permitindo que o áudio seja manipulado por sistemas
            computacionais.
          </p>
          <div className="card-grid three">
            {conceptCards.map(({ icon: Icon, title, text }) => (
              <article className="glass-card icon-card" key={title}>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="instrumento">
          <InstrumentSection />
        </Section>

        <Section id="estrutura" eyebrow="Do sinal ao arquivo" title="Estrutura do áudio digital">
          <div className="split-layout">
            <div className="card-grid stack">
              {digitalStructure.map(([title, text], index) => (
                <article className="glass-card process-card" key={title}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
            <SignalTransform />
          </div>
        </Section>

        <Section id="matematica" eyebrow="Fundamentos matemáticos" title="A regra que evita distorções">
          <NyquistSection />
        </Section>

        <Section id="timeline" eyebrow="Evolução" title="Linha do tempo do áudio digital">
          <Timeline />
        </Section>

        <Section id="tecnologias" eyebrow="Formatos e tecnologias" title="Comparação visual">
          <AudioTechCards />
        </Section>

        <Section id="sintese">
          <SynthSection />
        </Section>

        <Section id="toms-diner" eyebrow="Estudo de caso" title="A música que ajudou a criar o MP3">
          <div className="case-study">
            <div>
              <p>
                A canção Tom&apos;s Diner, interpretada por Suzanne Vega, teve papel fundamental no
                desenvolvimento do MP3. Por ser uma gravação a cappella, composta apenas pela voz
                humana, ela era muito sensível a distorções, sendo ideal para testar compressão de áudio.
              </p>
              <p>
                Durante o desenvolvimento do MP3, Karlheinz Brandenburg usou essa música como referência
                para aprimorar o algoritmo, ajustando-o até preservar bem a voz.
              </p>
            </div>
            <aside className="highlight-card">
              <Sparkles />
              <strong>Suzanne Vega ficou conhecida como “Mãe do MP3”.</strong>
            </aside>
          </div>
          <TomsDinerPlayer />
        </Section>

        <Section id="impactos" eyebrow="Sociedade" title="Impactos da música digital">
          <div className="impact-grid">
            {impacts.map((impact, index) => (
              <article className="glass-card impact-card" key={impact}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{impact}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="simulador" eyebrow="Experimento" title="Experimente o Áudio Digital">
          <AudioSimulator />
        </Section>

        <VideoSection />
      </main>
      <Footer />
      <a className="floating-action" href="#simulador">
        <Music2 size={18} />
        Simulador
      </a>
    </>
  )
}

export default App
