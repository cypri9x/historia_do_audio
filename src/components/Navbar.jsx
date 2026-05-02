import { Menu, Music2, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  ['Início', 'inicio'],
  ['Conceitos', 'musica-digital'],
  ['Linha do tempo', 'timeline'],
  ['Tecnologias', 'tecnologias'],
  ['Simulador', 'simulador'],
  ['Vídeo', 'video'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <a className="brand" href="#inicio" aria-label="Ir para o início">
        <Music2 />
        <span>Do Beat ao Bit</span>
      </a>
      <button className="nav-toggle" type="button" aria-label="Abrir menu" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? 'open' : ''}>
        {links.map(([label, id]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}
