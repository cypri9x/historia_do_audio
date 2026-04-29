import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, Waves } from 'lucide-react'

const AUDIO_SRC = '/audios/toms-diner.mp3'

export default function TomsDinerPlayer() {
  const audioRef = useRef(null)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const animationRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    const updateProgress = () => {
      const nextProgress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0
      setProgress(nextProgress)
    }

    const stopPlayback = () => {
      setPlaying(false)
      setProgress(0)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', stopPlayback)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', stopPlayback)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  function setupAudioGraph() {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext || !audioRef.current) return null

    if (!contextRef.current) {
      contextRef.current = new AudioContext()
      analyserRef.current = contextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
    }

    if (!sourceRef.current) {
      sourceRef.current = contextRef.current.createMediaElementSource(audioRef.current)
      sourceRef.current.connect(analyserRef.current)
      analyserRef.current.connect(contextRef.current.destination)
    }

    return contextRef.current
  }

  function draw() {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    const data = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(data)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(6, 8, 21, 0.45)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const barWidth = canvas.width / data.length
    data.forEach((value, index) => {
      const height = Math.max(8, (value / 255) * canvas.height * 0.86)
      const x = index * barWidth
      const y = canvas.height - height
      const gradient = ctx.createLinearGradient(0, y, 0, canvas.height)
      gradient.addColorStop(0, '#c7ff6b')
      gradient.addColorStop(0.48, '#8ee7ff')
      gradient.addColorStop(1, '#ff7bd5')
      ctx.fillStyle = gradient
      ctx.fillRect(x + 1, y, Math.max(2, barWidth - 2), height)
    })

    animationRef.current = requestAnimationFrame(draw)
  }

  async function togglePlay() {
    const audio = audioRef.current
    const context = setupAudioGraph()
    if (!audio || !context) return

    if (context.state === 'suspended') await context.resume()

    if (audio.paused) {
      await audio.play()
      setPlaying(true)
      draw()
    } else {
      audio.pause()
      setPlaying(false)
      cancelAnimationFrame(animationRef.current)
    }
  }

  function restart() {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    setProgress(0)
  }

  return (
    <article className="toms-player">
      <div className="record-art" aria-hidden="true">
        <div className={playing ? 'record spinning' : 'record'}>
          <span />
        </div>
      </div>

      <div className="toms-player-body">
        <div className="track-meta">
          <span>Referencia a cappella</span>
          <h3>Tom&apos;s Diner</h3>
          <p>Suzanne Vega</p>
        </div>

        <canvas ref={canvasRef} width="720" height="190" aria-label="Ondas do audio de Tom's Diner" />

        <div className="track-progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="player-controls">
          <button type="button" className="primary-button" onClick={togglePlay}>
            {playing ? <Pause size={18} /> : <Play size={18} />}
            {playing ? 'Pausar' : 'Dar play'}
          </button>
          <button type="button" className="secondary-button" onClick={restart}>
            <RotateCcw size={18} />
            Reiniciar
          </button>
          <div className="wave-label">
            <Waves size={18} />
            Waveform em tempo real
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" />
    </article>
  )
}
