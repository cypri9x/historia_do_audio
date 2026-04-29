import Section from './Section'
import { Clapperboard } from 'lucide-react'

export default function VideoSection() {
  return (
    <Section id="video" eyebrow="Vídeo" title="Explicação final">
      <div className="video-shell">
        <div className="video-placeholder">
          <Clapperboard />
          <p>Assista ao vídeo explicativo para entender melhor o funcionamento do site e os conceitos apresentados.</p>
          <span>Espaço pronto para iframe do YouTube</span>
        </div>
        {/* Substitua este bloco por um iframe do YouTube quando o vídeo estiver pronto. */}
        {/*
        <iframe
          src="https://www.youtube.com/embed/ID_DO_VIDEO"
          title="Vídeo explicativo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        */}
      </div>
    </Section>
  )
}
