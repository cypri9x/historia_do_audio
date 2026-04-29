import { Disc3, FileAudio, Orbit } from 'lucide-react'

const technologies = [
  {
    icon: FileAudio,
    title: 'MP3',
    badge: 'Compacto',
    text: 'Compressão com perdas baseada em princípios psicoacústicos. Remove partes do áudio consideradas inaudíveis para reduzir o tamanho dos arquivos.',
    stats: ['Arquivos pequenos', 'Ideal para transmissão', 'Pode perder detalhes'],
  },
  {
    icon: Disc3,
    title: 'PCM',
    badge: 'Fiel',
    text: 'Áudio sem compressão, preservando o sinal original com alta fidelidade.',
    stats: ['Sem compressão', 'Alta qualidade', 'Arquivos grandes'],
  },
  {
    icon: Orbit,
    title: 'Dolby Digital',
    badge: 'Imersivo',
    text: 'Compressão com suporte a múltiplos canais, criando experiência sonora imersiva.',
    stats: ['Multicanal', 'Cinema e TV', 'Compressão eficiente'],
  },
]

export default function AudioTechCards() {
  return (
    <div className="tech-grid">
      {technologies.map(({ icon: Icon, title, badge, text, stats }) => (
        <article className="glass-card tech-card" key={title}>
          <div className="tech-top">
            <Icon />
            <span>{badge}</span>
          </div>
          <h3>{title}</h3>
          <p>{text}</p>
          <ul>
            {stats.map((stat) => (
              <li key={stat}>{stat}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
