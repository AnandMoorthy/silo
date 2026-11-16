import { AppShell } from '../components/AppShell'
import { StatBars } from '../components/StatBar'
import { WORLD_ACCENTS, requireWorld } from '../content/loadWorlds'
import { recapEntries, statsBeforeUnseenRecap } from '../engine/recap'
import { useSaveStore } from '../store/saveStore'

function timeSince(iso: string | null): string {
  if (!iso) return 'A while'
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.max(1, Math.round(ms / 60000))
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'}`
  const hours = Math.round(mins / 60)
  if (hours < 48) return `${hours} hour${hours === 1 ? '' : 's'}`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'}`
}

export function RecapScreen({ worldId }: { worldId: string }) {
  const world = requireWorld(worldId)
  const state = useSaveStore((s) => s.getWorldState(worldId))
  const confirmRecap = useSaveStore((s) => s.confirmRecap)
  const accent = WORLD_ACCENTS[worldId] ?? '#9aa4b2'
  const entries = recapEntries(state)
  const before = statsBeforeUnseenRecap(world, state)

  return (
    <AppShell accent={accent} title="Since you left">
      <p className="lede">
        {timeSince(state.lastExitAt)} since you were last in {world.title}.
      </p>

      <ul className="recap-list">
        {entries.map((entry) => (
          <li key={`${entry.cardId}-${entry.at}`}>
            <strong>{entry.label}</strong>
            <span> → {entry.later}</span>
          </li>
        ))}
      </ul>

      <h3 className="section-label">What shifted</h3>
      <StatBars
        labels={world.statLabels}
        values={state.stats}
        previous={before}
        accent={accent}
        showDelta
      />

      <button
        type="button"
        className="btn btn--primary"
        onClick={() => confirmRecap(worldId)}
      >
        Continue
      </button>
    </AppShell>
  )
}
