import { useCallback, useEffect, useRef, useState } from 'react'
import { FileUp, Gauge, Play, SlidersHorizontal, UploadCloud, Waves } from 'lucide-react'

const presets = [
  { label: 'Fala humana', path: '/audios/fala-humana.wav' },
  { label: 'Acorde de violão', path: '/audios/violao.wav' },
  { label: 'Palma', path: '/audios/palma.wav' },
  { label: 'Som constante de 440 Hz', path: '/audios/440hz.wav' },
  { label: "Tom's Diner - Suzanne Vega", path: '/audios/toms-diner.mp3' },
  { label: 'Teste', path: '/audios/audio_teste.wav' },
  { label: 'Acorde de Sol', path: '/audios/chord_G.wav' },
  { label: 'Fala Humana 2', path: '/audios/fala_humana2.wav' },
  { label: '440 Hz 2s', path: '/audios/tone-440hz-sine-2s.wav' },
]

const compressionProfiles = {
  baixa: { ratio: 0.72, noise: 0.004, bitPenalty: 0, label: 'baixa' },
  media: { ratio: 0.38, noise: 0.014, bitPenalty: -2, label: 'média' },
  alta: { ratio: 0.16, noise: 0.034, bitPenalty: -4, label: 'alta' },
}

function getAudioContext(ref) {
  if (!ref.current) {
    ref.current = new (window.AudioContext || window.webkitAudioContext)()
  }
  return ref.current
}

function clamp(value) {
  return Math.max(-1, Math.min(1, value))
}

function audioBufferToWavBlob(buffer) {
  const channels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const length = buffer.length * channels * 2 + 44
  const view = new DataView(new ArrayBuffer(length))
  let offset = 0

  const writeString = (value) => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i))
    offset += value.length
  }

  writeString('RIFF')
  view.setUint32(offset, length - 8, true)
  offset += 4
  writeString('WAVE')
  writeString('fmt ')
  view.setUint32(offset, 16, true)
  offset += 4
  view.setUint16(offset, 1, true)
  offset += 2
  view.setUint16(offset, channels, true)
  offset += 2
  view.setUint32(offset, sampleRate, true)
  offset += 4
  view.setUint32(offset, sampleRate * channels * 2, true)
  offset += 4
  view.setUint16(offset, channels * 2, true)
  offset += 2
  view.setUint16(offset, 16, true)
  offset += 2
  writeString('data')
  view.setUint32(offset, length - offset - 4, true)
  offset += 4

  for (let i = 0; i < buffer.length; i += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = clamp(buffer.getChannelData(channel)[i])
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }

  return new Blob([view], { type: 'audio/wav' })
}

function renderWaveform(buffer, canvas, accent = '#8ee7ff') {
  if (!buffer || !canvas) return
  const context = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const data = buffer.getChannelData(0)
  const step = Math.ceil(data.length / width)
  const center = height / 2

  context.clearRect(0, 0, width, height)
  context.fillStyle = 'rgba(255,255,255,0.035)'
  context.fillRect(0, 0, width, height)
  context.lineWidth = 2
  context.strokeStyle = accent
  context.beginPath()

  for (let x = 0; x < width; x += 1) {
    let min = 1
    let max = -1
    for (let j = 0; j < step; j += 1) {
      const datum = data[x * step + j] || 0
      if (datum < min) min = datum
      if (datum > max) max = datum
    }
    context.moveTo(x, center + min * center * 0.82)
    context.lineTo(x, center + max * center * 0.82)
  }

  context.stroke()
}

function renderLiveWaveform(canvas, analyser, accent = '#8ee7ff') {
  if (!canvas || !analyser) return
  const context = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const data = new Uint8Array(analyser.fftSize)

  analyser.getByteTimeDomainData(data)
  context.clearRect(0, 0, width, height)
  context.fillStyle = 'rgba(255,255,255,0.035)'
  context.fillRect(0, 0, width, height)
  context.lineWidth = 3
  context.strokeStyle = accent
  context.beginPath()

  for (let i = 0; i < data.length; i += 1) {
    const x = (i / (data.length - 1)) * width
    const y = (data[i] / 255) * height
    if (i === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }

  context.stroke()
}

function renderSamplingPreview(canvas, sampleRate, bitDepth) {
  if (!canvas) return
  const context = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const center = height / 2
  const amplitude = height * 0.32
  const sampleCount = { 8000: 12, 11025: 16, 22050: 26, 44100: 44 }[sampleRate]
  const levels = { 8: 8, 16: 16, 24: 32 }[bitDepth]

  context.clearRect(0, 0, width, height)
  context.fillStyle = 'rgba(255,255,255,0.035)'
  context.fillRect(0, 0, width, height)
  context.strokeStyle = 'rgba(255,255,255,0.08)'
  context.lineWidth = 1

  for (let i = 0; i <= levels; i += 1) {
    const y = 20 + (i / levels) * (height - 40)
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }

  context.strokeStyle = '#8ee7ff'
  context.lineWidth = 3
  context.beginPath()
  for (let x = 0; x < width; x += 1) {
    const t = x / width
    const y = center + Math.sin(t * Math.PI * 5.5) * amplitude + Math.sin(t * Math.PI * 15) * amplitude * 0.18
    if (x === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }
  context.stroke()

  context.strokeStyle = '#c7ff6b'
  context.fillStyle = '#c7ff6b'
  context.lineWidth = 2
  context.beginPath()
  for (let i = 0; i < sampleCount; i += 1) {
    const x = 24 + (i / (sampleCount - 1)) * (width - 48)
    const t = x / width
    const raw = Math.sin(t * Math.PI * 5.5) * amplitude + Math.sin(t * Math.PI * 15) * amplitude * 0.18
    const normalized = raw / amplitude
    const quantized = Math.round(normalized * (levels / 2)) / (levels / 2)
    const y = center + quantized * amplitude
    if (i === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  }
  context.stroke()

  for (let i = 0; i < sampleCount; i += 1) {
    const x = 24 + (i / (sampleCount - 1)) * (width - 48)
    const t = x / width
    const raw = Math.sin(t * Math.PI * 5.5) * amplitude + Math.sin(t * Math.PI * 15) * amplitude * 0.18
    const normalized = raw / amplitude
    const quantized = Math.round(normalized * (levels / 2)) / (levels / 2)
    const y = center + quantized * amplitude
    context.beginPath()
    context.arc(x, y, sampleRate <= 11025 ? 5 : 3.5, 0, Math.PI * 2)
    context.fill()
  }
}

function renderSpectrumPreview(canvas, sampleRate, compression) {
  if (!canvas) return
  const context = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const bins = 36
  const nyquist = sampleRate / 2
  const compressionCut = compression === 'alta' ? 0.58 : compression === 'media' ? 0.78 : 0.95

  context.clearRect(0, 0, width, height)
  context.fillStyle = 'rgba(255,255,255,0.035)'
  context.fillRect(0, 0, width, height)

  for (let i = 0; i < bins; i += 1) {
    const frequency = (i / (bins - 1)) * 22050
    const keptBySampleRate = frequency <= nyquist
    const keptByCompression = i / (bins - 1) <= compressionCut
    const kept = keptBySampleRate && keptByCompression
    const base = Math.sin((i / bins) * Math.PI) * 0.55 + 0.22 + ((i * 7) % 9) / 28
    const barHeight = height * (kept ? base : base * 0.22)
    const x = (i / bins) * width
    const barWidth = width / bins - 4
    const y = height - barHeight - 18
    const gradient = context.createLinearGradient(0, y, 0, height)
    gradient.addColorStop(0, kept ? '#c7ff6b' : 'rgba(255,123,213,0.38)')
    gradient.addColorStop(1, kept ? '#8ee7ff' : 'rgba(255,255,255,0.16)')
    context.fillStyle = gradient
    context.fillRect(x + 2, y, Math.max(3, barWidth), barHeight)
  }

  context.fillStyle = '#a9b8cf'
  context.font = '700 13px Inter, system-ui, sans-serif'
  context.fillText('graves', 12, height - 8)
  context.fillText('medios', width / 2 - 26, height - 8)
  context.fillText('agudos', width - 58, height - 8)
}

function simulateBuffer(original, context, sampleRate, bitDepth, compression) {
  const profile = compressionProfiles[compression]
  const result = context.createBuffer(original.numberOfChannels, original.length, original.sampleRate)
  const step = Math.max(1, Math.round(original.sampleRate / sampleRate))
  const effectiveBits = Math.max(4, bitDepth + profile.bitPenalty)
  const levels = 2 ** (effectiveBits - 1)

  for (let channel = 0; channel < original.numberOfChannels; channel += 1) {
    const input = original.getChannelData(channel)
    const output = result.getChannelData(channel)
    let smoothed = 0

    for (let i = 0; i < input.length; i += 1) {
      const heldIndex = Math.min(input.length - 1, Math.floor(i / step) * step)
      const artifact = (Math.random() * 2 - 1) * profile.noise * (1 - Math.abs(input[heldIndex]))
      const quantized = Math.round(clamp(input[heldIndex] + artifact) * levels) / levels
      smoothed = compression === 'alta' ? smoothed * 0.38 + quantized * 0.62 : quantized
      output[i] = clamp(smoothed)
    }
  }

  return result
}

function estimateResult(buffer, sampleRate, bitDepth, compression) {
  if (!buffer) return null
  const profile = compressionProfiles[compression]
  const seconds = buffer.duration
  const channels = buffer.numberOfChannels
  const rawBytes = seconds * sampleRate * channels * (bitDepth / 8)
  const sizeMb = (rawBytes * profile.ratio) / (1024 * 1024)
  const sampleScore = Math.min(1, sampleRate / 44100)
  const bitScore = bitDepth / 24
  const compressionScore = compression === 'baixa' ? 0.96 : compression === 'media' ? 0.74 : 0.52
  const score = Math.round((sampleScore * 0.45 + bitScore * 0.25 + compressionScore * 0.3) * 100)
  const losses = []

  if (sampleRate <= 11025) losses.push('perda de agudos e risco de aliasing')
  if (bitDepth === 8) losses.push('ruído de quantização perceptível')
  if (compression === 'alta') losses.push('artefatos de compressão e menor definição')
  if (losses.length === 0) losses.push('perdas leves ou pouco perceptíveis')

  return {
    score,
    sizeMb: Math.max(0.01, sizeMb).toFixed(2),
    losses: losses.join(', '),
    explanation:
      'Taxas menores reduzem a qualidade e podem causar perda de detalhes. Bit depth menor aumenta ruído de quantização. Compressão alta reduz o tamanho, mas pode gerar perda perceptível.',
  }
}

export default function AudioSimulator() {
  const [sourceUrl, setSourceUrl] = useState(presets[0].path)
  const [sourceLabel, setSourceLabel] = useState(presets[0].label)
  const [buffer, setBuffer] = useState(null)
  const [simulatedBuffer, setSimulatedBuffer] = useState(null)
  const [simulatedUrl, setSimulatedUrl] = useState('')
  const [result, setResult] = useState(null)
  const [sampleRate, setSampleRate] = useState(22050)
  const [bitDepth, setBitDepth] = useState(16)
  const [compression, setCompression] = useState('media')
  const [error, setError] = useState('')
  const audioContextRef = useRef(null)
  const originalCanvas = useRef(null)
  const simulatedCanvas = useRef(null)
  const originalAudioRef = useRef(null)
  const simulatedAudioRef = useRef(null)
  const liveAudioRef = useRef({
    original: { source: null, analyser: null, frame: null },
    simulated: { source: null, analyser: null, frame: null },
  })
  const samplingPreviewCanvas = useRef(null)
  const spectrumPreviewCanvas = useRef(null)

  const decodeArrayBuffer = useCallback(async (arrayBuffer) => {
    const context = getAudioContext(audioContextRef)
    return context.decodeAudioData(arrayBuffer.slice(0))
  }, [])

  const loadPreset = useCallback(
    async (preset) => {
      setError('')
      setSourceUrl(preset.path)
      setSourceLabel(preset.label)
      setSimulatedUrl('')
      setSimulatedBuffer(null)
      setResult(null)
      try {
        const response = await fetch(preset.path)
        if (!response.ok) throw new Error('Arquivo não encontrado')
        const decoded = await decodeArrayBuffer(await response.arrayBuffer())
        setBuffer(decoded)
      } catch {
        setBuffer(null)
        setError('Não foi possível carregar este áudio. O caminho já está pronto para você adicionar o arquivo depois.')
      }
    },
    [decodeArrayBuffer],
  )

  useEffect(() => {
    let active = true

    async function loadInitialPreset() {
      try {
        const response = await fetch(presets[0].path)
        if (!response.ok) throw new Error('Arquivo não encontrado')
        const decoded = await decodeArrayBuffer(await response.arrayBuffer())
        if (active) setBuffer(decoded)
      } catch {
        if (active) setError('Não foi possível carregar o áudio inicial. Os caminhos já estão prontos para receber arquivos.')
      }
    }

    loadInitialPreset()
    return () => {
      active = false
    }
  }, [decodeArrayBuffer])

  useEffect(() => {
    renderWaveform(buffer, originalCanvas.current, '#8ee7ff')
  }, [buffer])

  useEffect(() => {
    renderSamplingPreview(samplingPreviewCanvas.current, sampleRate, bitDepth)
    renderSpectrumPreview(spectrumPreviewCanvas.current, sampleRate, compression)
  }, [sampleRate, bitDepth, compression])

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setError('')
    setSourceLabel(file.name)
    setSourceUrl(URL.createObjectURL(file))
    setSimulatedUrl('')
    setSimulatedBuffer(null)
    setResult(null)
    try {
      const decoded = await decodeArrayBuffer(await file.arrayBuffer())
      setBuffer(decoded)
    } catch {
      setBuffer(null)
      setError('Não consegui decodificar esse arquivo. Tente WAV, MP3 ou OGG.')
    }
  }

  function applySimulation() {
    if (!buffer) {
      setError('Carregue ou envie um áudio antes de aplicar a simulação.')
      return
    }

    const context = getAudioContext(audioContextRef)
    const simulated = simulateBuffer(buffer, context, sampleRate, bitDepth, compression)
    const blob = audioBufferToWavBlob(simulated)
    const url = URL.createObjectURL(blob)
    if (simulatedUrl) URL.revokeObjectURL(simulatedUrl)
    setSimulatedUrl(url)
    setSimulatedBuffer(simulated)
    setResult(estimateResult(buffer, sampleRate, bitDepth, compression))
    renderWaveform(simulated, simulatedCanvas.current, '#c7ff6b')
  }

  async function startLiveWaveform(kind) {
    const audio = kind === 'original' ? originalAudioRef.current : simulatedAudioRef.current
    const canvas = kind === 'original' ? originalCanvas.current : simulatedCanvas.current
    const accent = kind === 'original' ? '#8ee7ff' : '#c7ff6b'
    if (!audio || !canvas) return

    const context = getAudioContext(audioContextRef)
    const live = liveAudioRef.current[kind]
    if (!live.analyser) {
      live.analyser = context.createAnalyser()
      live.analyser.fftSize = 1024
    }
    if (!live.source) {
      live.source = context.createMediaElementSource(audio)
      live.source.connect(live.analyser)
      live.analyser.connect(context.destination)
    }
    if (context.state === 'suspended') await context.resume()

    const draw = () => {
      renderLiveWaveform(canvas, live.analyser, accent)
      live.frame = requestAnimationFrame(draw)
    }

    cancelAnimationFrame(live.frame)
    draw()
  }

  function stopLiveWaveform(kind) {
    const live = liveAudioRef.current[kind]
    cancelAnimationFrame(live.frame)
    if (kind === 'original') renderWaveform(buffer, originalCanvas.current, '#8ee7ff')
    if (kind === 'simulated') renderWaveform(simulatedBuffer, simulatedCanvas.current, '#c7ff6b')
  }

  return (
    <div className="simulator">
      <div className="simulator-top">
        <div>
          <h3>Laboratório de amostragem, quantização e compressão</h3>
          <p>
            Escolha um exemplo, envie seu áudio e compare como mudanças técnicas afetam qualidade,
            tamanho estimado e aparência da onda sonora.
          </p>
        </div>
        <div className="source-pill">
          <Waves size={18} />
          {sourceLabel}
        </div>
      </div>

      <div className="simulator-grid">
        <aside className="control-panel">
          <label>
            Áudios pré-definidos
            <select
              value={sourceUrl}
              onChange={(event) => loadPreset(presets.find((preset) => preset.path === event.target.value))}
            >
              {presets.map((preset) => (
                <option value={preset.path} key={preset.path}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>

          <label className="upload-box">
            <UploadCloud />
            <span>Enviar áudio .wav, .mp3 ou .ogg</span>
            <input accept=".wav,.mp3,.ogg,audio/*" type="file" onChange={handleUpload} />
          </label>

          <label>
            Taxa de amostragem
            <select value={sampleRate} onChange={(event) => setSampleRate(Number(event.target.value))}>
              {[8000, 11025, 22050, 44100].map((rate) => (
                <option value={rate} key={rate}>
                  {rate} Hz
                </option>
              ))}
            </select>
          </label>

          <label>
            Bit depth
            <select value={bitDepth} onChange={(event) => setBitDepth(Number(event.target.value))}>
              {[8, 16, 24].map((depth) => (
                <option value={depth} key={depth}>
                  {depth}-bit
                </option>
              ))}
            </select>
          </label>

          <label>
            Compressão
            <select value={compression} onChange={(event) => setCompression(event.target.value)}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </label>

          <button className="primary-button full" type="button" onClick={applySimulation}>
            <SlidersHorizontal size={18} />
            Aplicar simulação
          </button>
        </aside>

        <div className="wave-area">
          {error && <div className="error-box">{error}</div>}

          <div className="lab-visuals">
            <article className="lab-card">
              <div className="audio-card-head">
                <Waves size={18} />
                <strong>Amostragem e quantização</strong>
              </div>
              <canvas ref={samplingPreviewCanvas} width="720" height="210" />
              <p>
                A linha azul representa a onda contínua. Os pontos verdes mostram as amostras, e a
                linha em degraus mostra como o bit depth limita os níveis possíveis.
              </p>
            </article>

            <article className="lab-card">
              <div className="audio-card-head">
                <Gauge size={18} />
                <strong>Espectro e perda de frequências</strong>
              </div>
              <canvas ref={spectrumPreviewCanvas} width="720" height="210" />
              <p>
                Barras apagadas representam regiões que tendem a sumir quando a taxa de amostragem é
                baixa ou quando a compressão é mais agressiva.
              </p>
            </article>
          </div>

          <div className="comparison-grid">
            <article className="audio-card">
              <div className="audio-card-head">
                <Play size={18} />
                <strong>Áudio original</strong>
              </div>
              <audio
                ref={originalAudioRef}
                controls
                src={sourceUrl}
                onPlay={() => startLiveWaveform('original')}
                onPause={() => stopLiveWaveform('original')}
                onEnded={() => stopLiveWaveform('original')}
              />
              <canvas ref={originalCanvas} width="720" height="180" />
            </article>

            <article className="audio-card">
              <div className="audio-card-head">
                <Gauge size={18} />
                <strong>Áudio simulado</strong>
              </div>
              <audio
                ref={simulatedAudioRef}
                controls
                src={simulatedUrl}
                onPlay={() => startLiveWaveform('simulated')}
                onPause={() => stopLiveWaveform('simulated')}
                onEnded={() => stopLiveWaveform('simulated')}
              />
              <canvas ref={simulatedCanvas} width="720" height="180" />
            </article>
          </div>

          <div className="result-grid">
            <article className="result-card">
              <span>Qualidade estimada</span>
              <strong>{result ? `${result.score}%` : '--'}</strong>
            </article>
            <article className="result-card">
              <span>Tamanho estimado</span>
              <strong>{result ? `${result.sizeMb} MB` : '--'}</strong>
            </article>
            <article className="result-card wide">
              <span>Possíveis perdas</span>
              <strong>{result ? result.losses : 'Aplique a simulação para ver o diagnóstico.'}</strong>
            </article>
          </div>

          <div className="explanation-box">
            <FileUp size={18} />
            <p>
              {result
                ? result.explanation
                : 'O simulador gera uma versão básica com reamostragem, quantização e artefatos conceituais de compressão para facilitar a comparação.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
