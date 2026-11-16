import { AppShell } from '../components/AppShell'
import { StatBars } from '../components/StatBar'
import { WORLD_ACCENTS, requireWorld } from '../content/loadWorlds'
import { useSaveStore } from '../store/saveStore'

export function EndingScreen({ worldId }: { worldId: string }) {
  const world = requireWorld(worldId)
  const state = useSaveStore((s) => s.getWorldState(worldId))
  const leaveToHome = useSaveStore((s) => s.leaveToHome)
  const openLog = useSaveStore((s) => s.openLog)
  const accent = WORLD_ACCENTS[worldId] ?? '#9aa4b2'

  return (
    <AppShell accent={accent} title={world.title} worldId={worldId} showMotif>
      <p className="badge">Story complete</p>
      <p className="ending-text">{state.endingText ?? 'The story ends here.'}</p>
      <StatBars labels={world.statLabels} values={state.stats} accent={accent} />
      <div className="row">
        <button type="button" className="btn" onClick={() => openLog(worldId)}>
          Full story
        </button>
        <button type="button" className="btn btn--primary" onClick={leaveToHome}>
          Home
        </button>
      </div>
    </AppShell>
  )
}
