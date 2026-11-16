import { AppShell } from '../components/AppShell'
import { WORLD_ACCENTS, requireWorld } from '../content/loadWorlds'
import { useSaveStore } from '../store/saveStore'

export function StoryLogScreen({ worldId }: { worldId: string }) {
  const world = requireWorld(worldId)
  const state = useSaveStore((s) => s.getWorldState(worldId))
  const leaveToHome = useSaveStore((s) => s.leaveToHome)
  const enterWorld = useSaveStore((s) => s.enterWorld)
  const accent = WORLD_ACCENTS[worldId] ?? '#9aa4b2'
  const unseen = new Set(state.unseenRecap)

  const byChapter = new Map<number, typeof state.log>()
  for (const entry of state.log) {
    const list = byChapter.get(entry.chapter) ?? []
    list.push(entry)
    byChapter.set(entry.chapter, list)
  }

  return (
    <AppShell accent={accent} title="Story log">
      {state.log.length === 0 ? (
        <p className="muted">No choices yet in this world.</p>
      ) : (
        [...byChapter.entries()].map(([chapterIndex, entries]) => (
          <section key={chapterIndex} className="panel">
            <h3 className="section-label">
              Chapter {chapterIndex + 1}:{' '}
              {world.chapters[chapterIndex]?.title ?? '—'}
            </h3>
            <ul className="log-list">
              {entries.map((entry) => {
                const revealed = !unseen.has(entry.cardId)
                return (
                  <li key={`${entry.cardId}-${entry.at}`}>
                    <strong>{entry.label}</strong>
                    <div className="muted">{entry.result}</div>
                    {revealed ? (
                      <div className="later">{entry.later}</div>
                    ) : (
                      <div className="muted">Consequence waiting for your return.</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))
      )}
      <div className="row">
        <button type="button" className="btn" onClick={() => enterWorld(worldId)}>
          Back to world
        </button>
        <button type="button" className="btn" onClick={leaveToHome}>
          Home
        </button>
      </div>
    </AppShell>
  )
}
