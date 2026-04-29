import { HardDrive, Music, Network, Radio, Sparkles, Waves } from 'lucide-react'

const events = [
  {
    year: '1957',
    icon: Music,
    title: 'Max Mathews cria o MUSIC I',
    text: 'Primeiro sistema capaz de gerar som digital. Um computador levava cerca de uma hora para produzir poucos segundos de áudio.',
  },
  {
    year: '1960-70',
    icon: Waves,
    title: 'Evolução da síntese sonora',
    text: 'Surgem sistemas mais avançados e o conceito de construção de sons por blocos.',
  },
  {
    year: '1980',
    icon: HardDrive,
    title: 'Consolidação do áudio digital',
    text: 'Tecnologias como PCM passam a ser usadas com alta qualidade, mas geram arquivos muito grandes.',
  },
  {
    year: '1990',
    icon: Sparkles,
    title: 'Criação do MP3',
    text: 'Surge o MP3 como solução para reduzir o tamanho dos arquivos e permitir armazenamento e transmissão.',
  },
  {
    year: '2000',
    icon: Network,
    title: 'Popularização da música digital',
    text: 'Expansão da distribuição online e substituição gradual das mídias físicas.',
  },
  {
    year: 'Atualidade',
    icon: Radio,
    title: 'Streaming e acesso global',
    text: 'Plataformas digitais permitem acesso instantâneo a músicas em qualquer lugar.',
  },
]

export default function Timeline() {
  return (
    <>
      <div className="mp3-problem">
        <strong>O problema que levou ao MP3:</strong> na época, 1 minuto de áudio podia ocupar cerca de
        10 MB. Computadores tinham apenas 30-40 MB de armazenamento e a internet era muito lenta.
      </div>
      <div className="timeline">
        {events.map(({ year, icon: Icon, title, text }) => (
          <article className="timeline-item" key={year}>
            <div className="timeline-marker">
              <Icon />
            </div>
            <div className="glass-card">
              <span>{year}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
