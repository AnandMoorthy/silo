import { AppShell } from '../components/AppShell'
import { StatBars } from '../components/StatBar'
import { WORLD_ACCENTS, requireWorld } from '../content/loadWorlds'
import { useSaveStore } from '../store/saveStore'

export function WorldStateScreen({ worldId }: { worldId: string }) {
  const world = requireWorld(worldId)
  const state = useSaveStore((s) => s.getWorldState(worldId))
  const startChapter = useSaveStore((s) => s.startChapter)
  const openLog = useSaveStore((s) => s.openLog)
  const leaveToHome = useSaveStore((s) => s.leaveToHome)
  const accent = WORLD_ACCENTS[worldId] ?? '#9aa4b2'
  const chapter = world.chapters[state.chaptersDone]
  const firstVisit = state.status === 'new' && state.log.length === 0

  const factLabels = state.flags
    .map((flag) => world.facts[flag])
    .filter((label): label is string => Boolean(label))

  return (
    <AppShell accent={accent} title={world.title} worldId={worldId} showMotif>
      <p className="role">{world.role}</p>

      <StatBars labels={world.statLabels} values={state.stats} accent={accent} />

      <section className="panel">
        <h3 className="section-label">
          {firstVisit ? 'This place' : 'World facts'}
        </h3>
        {firstVisit ? (
          <p>{world.tagline}</p>
        ) : factLabels.length === 0 ? (
          <p className="muted">Nothing lasting has settled here yet.</p>
        ) : (
          <ul className="facts">
            {factLabels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        )}
      </section>

      {chapter ? (
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => startChapter(worldId)}
        >
          Play chapter {state.chaptersDone + 1}: {chapter.title}
        </button>
      ) : null}

      <div className="row">
        <button type="button" className="btn" onClick={() => openLog(worldId)}>
          Story log
        </button>
        <button type="button" className="btn" onClick={leaveToHome}>
          Leave
        </button>
      </div>
    </AppShell>
  )
}
