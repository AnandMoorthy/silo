import { useState } from 'react'
import { motion, type PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { AppShell } from '../components/AppShell'
import { WORLD_ACCENTS, requireWorld } from '../content/loadWorlds'
import { currentCard, currentChapter } from '../engine'
import { useSaveStore } from '../store/saveStore'

export function CardScreen({ worldId }: { worldId: string }) {
  const world = requireWorld(worldId)
  const state = useSaveStore((s) => s.getWorldState(worldId))
  const choose = useSaveStore((s) => s.choose)
  const accent = WORLD_ACCENTS[worldId] ?? '#9aa4b2'
  const card = currentCard(world, state)
  const chapter = currentChapter(world, state)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-180, 180], [-12, 12])
  const [busy, setBusy] = useState(false)

  if (!card || !chapter) {
    return (
      <AppShell accent={accent} title={world.title}>
        <p>No card to play.</p>
      </AppShell>
    )
  }

  const commit = (pick: 'a' | 'b') => {
    if (busy) return
    setBusy(true)
    choose(worldId, pick)
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) commit('b')
    else if (info.offset.x < -100) commit('a')
  }

  return (
    <AppShell accent={accent} title={chapter.title}>
      <motion.div
        className="play-card"
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={onDragEnd}
      >
        <p className="speaker">{card.speaker}</p>
        <p className="card-text">{card.text}</p>
      </motion.div>

      <div className="choices">
        <button
          type="button"
          className="choice choice--left"
          disabled={busy}
          onClick={() => commit('a')}
        >
          <span className="choice__hint">←</span>
          {card.a.label}
        </button>
        <button
          type="button"
          className="choice choice--right"
          disabled={busy}
          onClick={() => commit('b')}
        >
          {card.b.label}
          <span className="choice__hint">→</span>
        </button>
      </div>
      <p className="muted center">Tap a choice or swipe left / right</p>
    </AppShell>
  )
}
