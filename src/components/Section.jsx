import { motion } from 'framer-motion'

export default function Section({ id, eyebrow, title, children }) {
  return (
    <motion.section
      id={id}
      className="content-section"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      {(eyebrow || title) && (
        <div className="section-heading">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2>{title}</h2>}
        </div>
      )}
      {children}
    </motion.section>
  )
}
