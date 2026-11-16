import { AppShell } from '../components/AppShell'
import { WORLD_ACCENTS, requireWorld } from '../content/loadWorlds'
import type { ChoiceLog } from '../engine'
import { useSaveStore } from '../store/saveStore'

export function ChapterEndScreen({
  worldId,
  sessionChoices,
}: {
  worldId: string
  sessionChoices: ChoiceLog[]
}) {
  const world = requireWorld(worldId)
  const leaveToHome = useSaveStore((s) => s.leaveToHome)
  const accent = WORLD_ACCENTS[worldId] ?? '#9aa4b2'

  return (
    <AppShell accent={accent} title={world.title} worldId={worldId} showMotif>
      <p className="lede">
        You leave. This world keeps going without you.
      </p>
      <ul className="recap-list">
        {sessionChoices.map((entry) => (
          <li key={`${entry.cardId}-${entry.at}`}>
            <strong>{entry.label}</strong>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn--primary" onClick={leaveToHome}>
        Back to Home
      </button>
    </AppShell>
  )
}
