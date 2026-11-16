import { motion } from 'framer-motion'
import type { StatKey } from '../engine'

interface StatBarProps {
  label: string
  value: number
  previous?: number
  accent: string
  showDelta?: boolean
}

export function StatBar({
  label,
  value,
  previous,
  accent,
  showDelta = false,
}: StatBarProps) {
  const delta =
    previous === undefined ? 0 : value - previous
  const marker =
    delta > 0 ? '↑' : delta < 0 ? '↓' : showDelta ? '·' : null

  return (
    <div className="stat-bar">
      <div className="stat-bar__header">
        <span>{label}</span>
        <span className="stat-bar__value">
          {showDelta && previous !== undefined ? (
            <>
              {previous} → {value}
              {marker ? ` ${marker}` : ''}
            </>
          ) : (
            value
          )}
        </span>
      </div>
      <div className="stat-bar__track">
        <motion.div
          className="stat-bar__fill"
          style={{ background: accent }}
          initial={false}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function StatBars({
  labels,
  values,
  previous,
  accent,
  showDelta,
}: {
  labels: Record<StatKey, string>
  values: Record<StatKey, number>
  previous?: Record<StatKey, number>
  accent: string
  showDelta?: boolean
}) {
  const keys: StatKey[] = ['heart', 'coin', 'bonds', 'spirit']
  return (
    <div className="stat-bars">
      {keys.map((key) => (
        <StatBar
          key={key}
          label={labels[key]}
          value={values[key]}
          previous={previous?.[key]}
          accent={accent}
          showDelta={showDelta}
        />
      ))}
    </div>
  )
}
