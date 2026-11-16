import { useState } from 'react'
import { chapterProgressLabel } from '../engine'
import { WORLD_ACCENTS } from '../content/loadWorlds'
import { listWorldStates, useSaveStore } from '../store/saveStore'
import { AppShell } from '../components/AppShell'

function formatVisited(iso: string | null): string {
  if (!iso) return 'Not visited yet'
  const then = new Date(iso).getTime()
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000))
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 48) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export function HomeScreen() {
  const save = useSaveStore((s) => s.save)
  const enterWorld = useSaveStore((s) => s.enterWorld)
  const resetWorld = useSaveStore((s) => s.resetWorld)
  const resetAll = useSaveStore((s) => s.resetAll)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirm, setConfirm] = useState<null | { kind: 'one' | 'all'; worldId?: string }>(
    null,
  )

  const worlds = listWorldStates(save)

  return (
    <AppShell title="Silo">
      <p className="lede">
        Five lives in five sealed worlds. What you do in one stays there.
      </p>

      <div className="world-list">
        {worlds.map(({ content, state }) => {
          const accent = WORLD_ACCENTS[content.id] ?? '#9aa4b2'
          const changed = state.unseenRecap.length > 0 && state.cardIndex === 0
          return (
            <button
              key={content.id}
              type="button"
              className="world-card"
              style={{ ['--accent' as string]: accent }}
              onClick={() => enterWorld(content.id)}
            >
              <div className="world-card__top">
                <h2>{content.title}</h2>
                {state.status === 'complete' ? (
                  <span className="badge">Story complete</span>
                ) : changed ? (
                  <span className="badge badge--pulse">Something changed</span>
                ) : null}
              </div>
              <p>{content.tagline}</p>
              <div className="world-card__meta">
                <span>Chapter {chapterProgressLabel(content, state)}</span>
                <span>{formatVisited(state.lastExitAt)}</span>
              </div>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className="linkish"
        onClick={() => setMenuOpen((v) => !v)}
      >
        {menuOpen ? 'Close reset menu' : 'Reset…'}
      </button>

      {menuOpen ? (
        <div className="reset-menu">
          {worlds.map(({ content }) => (
            <button
              key={content.id}
              type="button"
              onClick={() => setConfirm({ kind: 'one', worldId: content.id })}
            >
              Reset {content.title}
            </button>
          ))}
          <button type="button" onClick={() => setConfirm({ kind: 'all' })}>
            Reset all worlds
          </button>
        </div>
      ) : null}

      {confirm ? (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__card">
            <p>
              {confirm.kind === 'all'
                ? 'Reset every world? This cannot be undone.'
                : `Reset ${worlds.find((w) => w.content.id === confirm.worldId)?.content.title}? The other worlds stay untouched.`}
            </p>
            <div className="row">
              <button type="button" className="btn" onClick={() => setConfirm(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => {
                  if (confirm.kind === 'all') resetAll()
                  else if (confirm.worldId) resetWorld(confirm.worldId)
                  setConfirm(null)
                  setMenuOpen(false)
                }}
              >
                Confirm reset
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  )
}
