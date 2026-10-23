type TapeProps = {
  variant?: 'plain' | 'striped' | 'clear'
  /** Position and rotation, e.g. "-top-3 left-6 -rotate-6". */
  className?: string
}

/** A strip of washi tape for sticking sheets and notes onto the page. */
export default function Tape({ variant = 'plain', className = '' }: TapeProps) {
  const variantClass = variant === 'plain' ? '' : `tape--${variant}`

  return <span aria-hidden="true" className={`tape ${variantClass} ${className}`} />
}
